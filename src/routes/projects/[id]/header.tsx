import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

interface Project {
  slug: string;
  published: boolean;
  date: string;
  title: string;
  description: string;
  url: string;
  repository: string;
  content: string;
}

export default component$((p: { project: Project }) => {
  const ref = useSignal<HTMLElement>();
  const isIntersecting = useSignal(true);
  const project = p.project;

  const links: { label: string; href: string }[] = [];
  if (project.repository) {
    links.push({
      label: "GitHub",
      href: `https://github.com/${project.repository}`,
    });
  }
  if (project.url) {
    links.push({
      label: "Website",
      href: project.url,
    });
  }
  useVisibleTask$(() => {
    if (!ref.value) return;
    const observer = new IntersectionObserver(
      ([entry]) => (isIntersecting.value = entry.isIntersecting),
    );

    observer.observe(ref.value);
    return () => observer.disconnect();
  });

  const Instagram = (classNameTS: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={classNameTS}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );

  const Github = (classNameTS: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={classNameTS}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );

  const ArrowLeft = (classNameTS: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={classNameTS}
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );

  return (
    <header
      ref={ref}
      class="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black -pb-8"
    >
      <div
        class={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
          isIntersecting.value
            ? "bg-zinc-900/0 border-transparent"
            : "bg-white/10  border-zinc-200 lg:border-transparent"
        }`}
      >
        <div class="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div class="flex justify-between gap-8">
            <a
              aria-label="instagram link"
              target="_blank"
              href="https://insagram.com/bennynottonson"
              class={`duration-200 hover:font-medium ${
                isIntersecting.value
                  ? " text-zinc-400 hover:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900"
              } `}
            >
              <Instagram class="w-6 h-6 " />
            </a>
            <a
              aria-label="github link"
              target="_blank"
              href="https://github.com/benny-nottonson"
              class={`duration-200 hover:font-medium ${
                isIntersecting.value
                  ? " text-zinc-400 hover:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900"
              } `}
            >
              <Github class="w-6 h-6 " />
            </a>
          </div>

          <a
            aria-label="home link"
            href="/projects"
            class={`duration-200 hover:font-medium ${
              isIntersecting.value
                ? " text-zinc-400 hover:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900"
            } `}
          >
            <ArrowLeft class="w-6 h-6 " />
          </a>
        </div>
      </div>
      <div class="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div class="mx-auto max-w-2xl lg:mx-0">
            <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
              {project.title}
            </h1>
            <p class="mt-6 text-lg leading-8 text-zinc-300">
              {project.description}
            </p>
          </div>

          <div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div class="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              {links.map((link) => (
                <a target="_blank" key={link.label} href={link.href}>
                  {link.label} <span aria-hidden="true">&rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
