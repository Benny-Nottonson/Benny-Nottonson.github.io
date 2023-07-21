import { component$ } from "@builder.io/qwik";
import Particles from "~/components/particles/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default component$(() => {
  return (
    <div class="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
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
      <div class="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles
        classNameTS="absolute inset-0 z-10 animate-fade-in pointer-events-none"
        quantity={100}
      />
      <h1 class="z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-8xl whitespace-nowrap bg-clip-text ">
        Benny Nottonson
      </h1>
      <div class="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div class="my-16 text-center animate-fade-in">
        <h2 class="text-sm text-zinc-500 ">
          Hi, my name is Benny, I'm working on{" "}
          <a
            target="_blank"
            href="https://github.com/Benny-Nottonson/spotifySort-Qwik"
            class="underline duration-500 hover:text-zinc-300"
          >
            spotifySort-Qwik
          </a>{" "}
          all day.
        </h2>
      </div>
    </div>
  );
});