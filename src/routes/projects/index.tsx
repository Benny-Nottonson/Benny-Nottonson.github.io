import { allProjects } from "~/projects";
import Nav from "~/components/nav/nav";
import Card from "~/components/card/card";
import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const featured = allProjects.find(
    (project) => project.slug === "spotifySort",
  );
  const top2 = allProjects.find((project) => project.slug === "spotifySort-TS");
  const top3 = allProjects.find(
    (project) => project.slug === "appLabWhitelistProxy",
  );
  if (!featured || !top2 || !top3) throw new Error("Missing featured project");
  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured.slug &&
        project.slug !== top2.slug &&
        project.slug !== top3.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    );

  return (
    <div class="h-screen w-screen overflow-x-hidden pb-8">
      <Nav />
      <div class="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div class="max-w-2xl mx-auto lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p class="mt-4 text-zinc-400">
            Some of the projects are from school and some are on my own time.
          </p>
        </div>
        <div class="w-full h-px bg-zinc-800" />

        <div class="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <a href={`/projects/${featured.slug}`}>
            <Card>
              <article class="relative w-full h-full p-4 md:p-8">
                <div class="flex items-center justify-between gap-2">
                  <div class="text-xs text-zinc-100">
                    {featured.date ? (
                      <time dateTime={new Date(featured.date).toISOString()}>
                        {Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                        }).format(new Date(featured.date))}
                      </time>
                    ) : (
                      <span>SOON</span>
                    )}
                  </div>
                </div>

                <h2
                  id="featured-post"
                  class="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  {featured.title}
                </h2>
                <p class="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  {featured.description}
                </p>
                <div class="pt-4 bottom-4 md:bottom-8">
                  <p class="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </article>
            </Card>
          </a>

          <div class="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {[top2, top3].map((project) => (
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
                    <h2 class="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
                      {project.title}
                    </h2>
                    <p class="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
                      {project.description}
                    </p>
                  </article>
                </Card>
              </a>
            ))}
          </div>
        </div>
        <div class="hidden w-full h-px md:block bg-zinc-800" />

        <div class="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div class="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <a href={`/projects/${project.slug}`} key={project.slug}>
                  <Card>
                    <article class="p-4 md:p-8">
                      <div class="flex justify-between gap-2 items-center">
                        <span class="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
                          {project.date ? (
                            <time
                              dateTime={new Date(project.date).toISOString()}
                            >
                              {Intl.DateTimeFormat(undefined, {
                                dateStyle: "medium",
                              }).format(new Date(project.date))}
                            </time>
                          ) : (
                            <span>SOON</span>
                          )}
                        </span>
                      </div>
                      <h2 class="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
                        {project.title}
                      </h2>
                      <p class="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
                        {project.description}
                      </p>
                    </article>
                  </Card>
                </a>
              ))}
          </div>
          <div class="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <a href={`/projects/${project.slug}`} key={project.slug}>
                  <Card>
                    <article class="p-4 md:p-8">
                      <div class="flex justify-between gap-2 items-center">
                        <span class="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
                          {project.date ? (
                            <time
                              dateTime={new Date(project.date).toISOString()}
                            >
                              {Intl.DateTimeFormat(undefined, {
                                dateStyle: "medium",
                              }).format(new Date(project.date))}
                            </time>
                          ) : (
                            <span>SOON</span>
                          )}
                        </span>
                      </div>
                      <h2 class="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
                        {project.title}
                      </h2>
                      <p class="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
                        {project.description}
                      </p>
                    </article>
                  </Card>
                </a>
              ))}
          </div>
          <div class="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <a href={`/projects/${project.slug}`} key={project.slug}>
                  <Card>
                    <article class="p-4 md:p-8">
                      <div class="flex justify-between gap-2 items-center">
                        <span class="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
                          {project.date ? (
                            <time
                              dateTime={new Date(project.date).toISOString()}
                            >
                              {Intl.DateTimeFormat(undefined, {
                                dateStyle: "medium",
                              }).format(new Date(project.date))}
                            </time>
                          ) : (
                            <span>SOON</span>
                          )}
                        </span>
                      </div>
                      <h2 class="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
                        {project.title}
                      </h2>
                      <p class="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
                        {project.description}
                      </p>
                    </article>
                  </Card>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});
