import Nav from "../../components/nav/nav";
import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import ProjectCard from "~/components/projectCard/projectCard";
import { useProjects } from "../layout";

export default component$(() => {
  const allProjects = useProjects().value;
  const [featured, top2, top3, ...sorted] = Object.values(allProjects).sort((a, b) => (b.date ? new Date(b.date).getTime() - new Date(a.date).getTime() : 1));

  return (
    <div class="h-screen w-full overflow-x-hidden pb-8 bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Nav />
      <div class="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div class="max-w-2xl mx-auto lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">Projects</h2>
          <p class="mt-4 text-zinc-400">Some of the projects are from school and some are on my own time.</p>
        </div>
        <div class="w-full h-px bg-zinc-800" />
        <div class="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <ProjectCard project={featured} key={featured.slug} isFeatured />
          <div class="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {[top2, top3].map((project) => (
              <ProjectCard project={project} key={project.slug!} />
            ))}
          </div>
        </div>
        <div class="hidden w-full h-px md:block bg-zinc-800" />
        <div class="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          {[0, 1, 2].map((colIndex) => (
            <div class="grid grid-cols-1 gap-4" key={colIndex}>
              {sorted
                .filter((_, i) => i % 3 === colIndex)
                .map((project) => (
                  <ProjectCard project={project} key={project.slug} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Projects",
  meta: [
    {
      name: "description",
      content: "This is the projects page",
    },
    {
      property: "og:title",
      content: "Projects",
    },
    {
      property: "og:description",
      content: "This is the projects page",
    },
  ],
};
