import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <h1 class="z-10 text-4xl text-transparent bg-white cursor-default font-display sm:text-6xl md:text-8xl">
        This page was not found
      </h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Not found",
  meta: [
    {
      name: "description",
      content: "This page was not found",
    },
    {
      property: "og:title",
      content: "Not found",
    },
    {
      property: "og:description",
      content: "This page was not found",
    },
  ],
};
