import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Particles from "../components/particles/particles";

export default component$(() => {
  return (
    <div class="flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <Particles
        classNameTS="absolute inset-0 z-10 animate-fade-in pointer-events-none"
        quantity={100}
      />
      <h1 class="z-10 text-4xl text-transparent bg-white cursor-default text-edge-outline font-display sm:text-6xl md:text-8xl whitespace-nowrap bg-clip-text ">
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
