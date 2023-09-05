import { component$ } from "@builder.io/qwik";
import Nav from "../../components/nav/nav";
import ResumeItem from "../../components/resumeItem/resumeItem";
import type { DocumentHead } from "@builder.io/qwik-city";
import Particles from "~/components/particles/particles";

export default component$(() => {
  return (
    <div class="h-screen w-full overflow-x-hidden pb-8 bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Particles
        classNameTS="absolute z-50 pointer-events-none"
        quantity={100}
      />
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
              aria-label="link to resume"
            >
              as a pdf
            </a>{" "}
          </p>
        </div>
        <div class="w-full h-px bg-zinc-800" />
        <ul>
          <ResumeItem
            type="work"
            role="Student"
            location="CSULB"
            link="https://www.csulb.edu/"
            start="2023"
            end="Present"
          />
          <ResumeItem
            type="work"
            role="Dance Instructor"
            location="CSDA"
            link="https://csdalb.com/"
            start="2023"
            end="Present"
          />
          <ResumeItem
            type="work"
            role="Web Developer"
            location="Valter Tennis"
            link="https://valtertennis.com/"
            start="2023"
            end="Present"
          />
        </ul>
        <div class="w-full h-px bg-zinc-800" />
        <ul>
          <ResumeItem
            type="experience"
            title="Languages"
            description="Python, Typescript, Javascript"
          />
          <ResumeItem
            type="experience"
            title="Frameworks"
            description="NextJS, Qwik, React, Vite"
          />
          <ResumeItem
            type="experience"
            title="Concepts"
            description="Machine Learning, Linear Algebra, Statistics, Image Processing"
          />
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
