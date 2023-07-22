import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import Header from "./header";
import Mdx from "./mdx";
import { allProjects } from "~/projects";

export default component$(() => {
  const location = useLocation();
  const project = allProjects.find((p) => p.slug === location.params.id);
  if (!project) throw new Error("Missing project");
  return (
    <div class="bg-zinc-50 min-h-screen">
      <Header project={project} />
      <article class="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={project.content} />
      </article>
    </div>
  );
});
