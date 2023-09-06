import { component$ } from "@builder.io/qwik";
import Card from "../card/card";
import type { Project } from "~/routes/layout";

interface Props {
  project: Project;
  isFeatured?: boolean;
}

export default component$(({ project, isFeatured }: Props) => {
  return (
    <a href={`/projects/${project.slug}`} key={project.slug}>
      <Card>
        <article class="p-4 md:p-8">
          <div class="flex justify-between gap-2 items-center">
            <span class="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
              {project.date ? (
                <time dateTime={new Date(project.date).toISOString()}>
                  {Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(project.date))}
                </time>
              ) : (
                <span>SOON</span>
              )}
            </span>
          </div>
          <h2
            class={`group-hover:text-white font-display ${
              isFeatured
                ? "mt-4 text-3xl font-bold text-zinc-100  sm:text-4xl"
                : "z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200"
            }
              `}
          >
            {project.title}
          </h2>
          <p
            class={`text-zinc-400 mt-4 ${
              isFeatured
                ? "mt-4 leading-8 duration-150 group-hover:text-zinc-300"
                : "z-20 mt-4 text-sm  duration-1000 group-hover:text-zinc-200"
            }
                `}
          >
            {project.description}
          </p>
          {isFeatured && (
            <div class="pt-4 bottom-4 md:bottom-8">
              <p class="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                Read more <span aria-hidden="true">&rarr;</span>
              </p>
            </div>
          )}
        </article>
      </Card>
    </a>
  );
});
