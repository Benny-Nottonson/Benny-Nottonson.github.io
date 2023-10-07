import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <svg class="absolute top-0 left-0 pointer-events-none">
      <filter id="liquid">
        <feTurbulence baseFrequency="0.02" numOctaves="2"></feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="100">
          <animate
            attributeName="scale"
            dur="0.5s"
            values="200;100;0"
            begin="img1.mouseover"
            fill="freeze"
          />
          <animate
            attributeName="scale"
            dur="0.5s"
            values="0;100;200"
            begin="img1.mouseout"
            fill="freeze"
          />
        </feDisplacementMap>
      </filter>
    </svg>
  );
});
