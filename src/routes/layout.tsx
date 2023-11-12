import { component$, noSerialize, Slot } from "@builder.io/qwik";
import { type RequestHandler, routeLoader$ } from "@builder.io/qwik-city";
import type { JSXNode } from "@builder.io/qwik/jsx-runtime";
import type { Project } from "./types";

export const useProjects = routeLoader$(async () => {
  const projectFiles = import.meta.glob("../content/projects/*.mdx") as Record<
    string,
    () => Promise<{ default: () => JSXNode; frontmatter: any }>
  >;

  const projects: Record<string, Project> = {};

  for (const [fileName, loadProject] of Object.entries(projectFiles)) {
    const slug = fileName
      .replace("../content/projects/", "")
      .replace(".mdx", "");
    const { frontmatter, default: content } = await loadProject();
    projects[slug] = { slug, content: noSerialize(content()), ...frontmatter };
  }

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
