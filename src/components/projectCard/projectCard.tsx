import { component$ } from "@builder.io/qwik";
import Card from "../card/card";
import type { Project } from "~/routes/types";

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
                ? "text-zinc-100 mt-4 text-3xl font-bold sm:text-4xl"
                : "text-zinc-200 z-20 text-xl font-medium duration-1000 lg:text-3xl"
            }
              `}
          >
            {project.title}
          </h2>
          <p
            class={`text-zinc-400 mt-4 ${
              isFeatured
                ? "group-hover:text-zinc-300 leading-8 duration-150"
                : "group-hover:text-zinc-200 z-20 text-sm duration-1000"
            }
                `}
          >
            {project.description}
          </p>
          {isFeatured && (
            <div class="pt-4 bottom-4 md:bottom-8 absolute">
              <p class="text-zinc-200 hover:text-zinc-50 lg:block">
                Read more <span>&rarr;</span>
              </p>
            </div>
          )}
        </article>
      </Card>
    </a>
  );
});
