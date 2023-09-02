import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import Header from "./header";
import Mdx from "./mdx";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useProjects } from "~/routes/layout";

export default component$(() => {
  const allProjects = useProjects().value;
  const loc = useLocation().params.id as keyof typeof allProjects;
  const project = allProjects[loc];

  useVisibleTask$(() => {
    document.title = `${project.title} | Benny Nottonson`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", project.description);
  });

  return (
    <div class="w-full bg-zinc-50 min-h-screen">
      <Header project={project} />
      <article class="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={project.content} />
      </article>
    </div>
  );
});

export const head: DocumentHead = {
  title: `Project`,
  meta: [
    {
      name: "description",
      content: `This is the project page`,
    },
  ],
};
