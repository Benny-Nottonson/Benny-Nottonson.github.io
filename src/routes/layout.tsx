import type { NoSerialize } from "@builder.io/qwik";
import { component$, noSerialize, Slot } from "@builder.io/qwik";
import { type RequestHandler, routeLoader$ } from "@builder.io/qwik-city";
import type { JSXNode } from "@builder.io/qwik/jsx-runtime";

export interface Project {
  slug: string;
  published: boolean;
  date: string;
  title: string;
  description: string;
  url: string;
  repository?: string;
  content: NoSerialize<JSXNode>;
}

export const useProjects = routeLoader$(async () => {
  const projectFiles = import.meta.glob("../content/projects/*.mdx") as Record<
    string,
    () => Promise<{ default: () => JSXNode; frontmatter: any }>
  >;

  const allProjects: Project[] = await Promise.all(
    Object.entries(projectFiles).map(async ([fileName, project]) => {
      const slug = fileName
        .replace("../content/projects/", "")
        .replace(".mdx", "");
      const fileContents = await project();
      const data = fileContents.frontmatter;
      const date = data.date ? data.date : null;
      const published = data.published ?? false;
      const title = data.title ?? "";
      const description = data.description ?? "";
      const url = data.url ?? "";
      const repository = data.repository ?? "";
      const content = fileContents.default();
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
    }),
  );

  const projects = allProjects.reduce((acc: any, project) => {
    acc[project.slug] = project;
    acc[project.slug].content = noSerialize(project.content);
    return acc;
  }, {});

  return projects as Record<string, Project>;
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
