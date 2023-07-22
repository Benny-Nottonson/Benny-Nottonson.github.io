import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import Header from "./header";
import Mdx from "./mdx";
import { allProjects } from "~/projects";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const location = useLocation();
  const project = allProjects.find((p) => p.slug === location.params.id);
  if (!project) throw new Error("Missing project");

  useVisibleTask$(() => {
    document.title = `${project.title} | Benny Nottonson`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", project.description);
  });

  return (
    <div class="w-screen bg-zinc-50 min-h-screen">
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
        name: 'description',
        content: `This is the project page`,
      },
    ],
};