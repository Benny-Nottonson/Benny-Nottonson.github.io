import { component$ } from "@builder.io/qwik";
import Nav from "../../components/nav/nav";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="h-screen w-full overflow-x-hidden pb-8 bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Nav />
      <div class="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div class="max-w-2xl mx-auto lg:mx-0">
          <h2 class="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Resume
          </h2>
          <p class="mt-4 text-zinc-400">
            Below is my resume, a downloadable version is available{" "}
            <a
              target="_blank"
              href="../Tech.pdf"
              class="underline duration-500 hover:text-zinc-300"
              aria-name="Tech Resume"
            >
              here
            </a>{" "}
          </p>
        </div>
        <div class="w-full h-px bg-zinc-800" />
        <ul>
          <li class="mt-4 text-zinc-400">
            <p>
              <span class="font-bold">Student</span> at{" "}
              <a
                target="_blank"
                href="https://www.csulb.edu/"
                class="underline duration-500 hover:text-zinc-300"
                aria-name="CSULB"
              >
                CSULB
              </a>{" "}
              from
              <span class="font-bold"> 2023 - Present</span>
            </p>
          </li>
          <li class="mt-4 text-zinc-400">
            <p>
              <span class="font-bold">Dance Instructor</span> at{" "}
              <a
                target="_blank"
                href="https://csdalb.com/"
                class="underline duration-500 hover:text-zinc-300"
                aria-name="CSDA"
              >
                CSDA
              </a>{" "}
              from
              <span class="font-bold"> 2023 - Present</span>
            </p>
          </li>
          <li class="mt-4 text-zinc-400">
            <p>
              <span class="font-bold">Web Developer</span> at{" "}
              <a
                target="_blank"
                href="https://valtertennis.com/"
                class="underline duration-500 hover:text-zinc-300"
                aria-name="Valter Tennis"
              >
                Valter Tennis
              </a>{" "}
              from
              <span class="font-bold"> 2023 - Present</span>
            </p>
          </li>
        </ul>
        <div class="w-full h-px bg-zinc-800" />
        <ul>
          <li class="mt-4 text-zinc-400">
            <p>
              <span class="font-bold">Languages - </span>
              <span>Python, Typescript, Javascript</span>
            </p>
          </li>
          <li class="mt-4 text-zinc-400">
            <p>
              <span class="font-bold">Frameworks - </span>
              <span>NextJS, Qwik, React, Vite</span>
            </p>
          </li>
          <li class="mt-4 text-zinc-400">
            <p>
              <span class="font-bold">Concepts - </span>
              <span>
                Machine Learning, Linear Algebra, Statistics, Image Processing
              </span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Resume",
  meta: [
    {
      name: "description",
      content: "This is a page with Benny's resume",
    },
    {
      property: "og:title",
      content: "Resume",
    },
    {
      property: "og:description",
      content: "This is a page with Benny's resume",
    },
  ],
};
