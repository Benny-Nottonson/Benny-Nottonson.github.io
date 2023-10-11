import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Particles from "../components/particles/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  { name: "Resume", href: "/resume" },
];

export default component$(() => {
  useVisibleTask$(() => {
    document.body.style.overflow = "hidden";
    document.body.style.overflowY = "hidden";
    document.styleSheets[0].insertRule(
      "html { overflow: hidden; overflow-y: hidden; }",
      0,
    );
    document.body.style.position = "relative";
  });

  return (
    <div class="flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav class="my-16 animate-fade-in">
        <ul>
          <li class="flex items-center justify-center gap-4">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                class="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
              >
                {item.name}
              </a>
            ))}
          </li>
        </ul>
      </nav>
      <div class="hidden w-full h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles
        classNameTS="absolute inset-0 z-10 animate-fade-in pointer-events-none"
        quantity={500}
      />
      <h1 class="select-none z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-8xl whitespace-nowrap bg-clip-text ">
        Benny Nottonson
      </h1>
      <div class="hidden w-full h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div class="my-16 text-center animate-fade-in mx-16">
        <h2 class="text-sm text-zinc-500 ">
          Hi, my name is Benny, I'm working on{<br />}
          <a
            href="./projects/valterTennis"
            class="underline duration-500 hover:text-zinc-300"
          >
            valterTennis
          </a>{" "}
          currently.
        </h2>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Benny Nottonson",
  meta: [
    {
      name: "description",
      content:
        "A portfolio website for Benny Nottonson, a student at CSULB for Computer Science",
    },
    {
      property: "og:title",
      content: "Benny Nottonson",
    },
    {
      property: "og:description",
      content:
        "A portfolio website for Benny Nottonson, a student at CSULB for Computer Science",
    },
  ],
};
