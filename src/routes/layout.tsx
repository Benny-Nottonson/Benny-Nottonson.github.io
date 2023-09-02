import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";

export interface Project {
  slug: string;
  published: boolean;
  date: string;
  title: string;
  description: string;
  url: string;
  repository: string;
  content: string;
}

export const useProjects = routeLoader$<{
  [key: string]: Project;
}>(async () => {
  const { readdirSync, readFileSync } = await import("fs");
  const { join } = await import("path");
  const { default: matter } = await import("gray-matter");

  const allProjects = readdirSync(
    join(process.cwd(), "src/content/projects"),
  ).map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fileContents = readFileSync(
      join(process.cwd(), "src/content/projects", fileName),
      "utf8",
    );
    const { data } = matter(fileContents);
    const date = data.date ? data.date : null;
    const published = data.published ?? false;
    const title = data.title ?? "";
    const description = data.description ?? "";
    const url = data.url ?? "";
    const repository = data.repository ?? "";
    const content = fileContents.split("---").slice(2).join("---");
    return {
      slug,
      published,
      date,
      title,
      description,
      url,
      repository,
      content,
      ...data,
    };
  });

  const projects = allProjects.reduce((acc: any, project) => {
    acc[project.slug] = project;
    return acc;
  }, {});

  return projects;
});


export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div
      class={`bg-black ${
        process.env.NODE_ENV === "development" ? "debug-screens" : undefined
      }`}
    >
      <Slot />
    </div>
  );
});
