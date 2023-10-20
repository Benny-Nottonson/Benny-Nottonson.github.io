import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <svg class="absolute top-0 left-0 pointer-events-none overflow-hidden">
      <filter id="liquid">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02"
          numOctaves="2"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="100"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
});
