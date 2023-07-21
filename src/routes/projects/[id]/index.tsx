import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Header from "./header";
import Mdx from "./mdx";

export default component$(() => {
  const id = useLocation();
  const mdxSource = fs.readFileSync(
    path.join(process.cwd(), `src/content/projects/${id.params.id}.mdx`),
    "utf8",
  );
  const { data } = matter(mdxSource);
  const date = data.date ? data.date : null;
  const published = data.published ?? false;
  const title = data.title ?? "";
  const description = data.description ?? "";
  const url = data.url ?? "";
  const repository = data.repository ?? "";
  const project = {
    slug: id.params.id,
    date,
    published,
    title,
    description,
    url,
    repository,
    body: {
      code: mdxSource,
    },
  };
  return (
    <div class="bg-zinc-50 min-h-screen">
      <Header project={project} />
      <article class="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
});
