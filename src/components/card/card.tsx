import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default component$(() => {
  const container = useSignal<HTMLDivElement>();
  const gradientRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    const containerValue = container.value!;
    const gradientValue = gradientRef.value!;
    const { clientWidth, clientHeight } = containerValue;
    const steps = 250;
    let mouseOut = true;

    const updateGradient = (x: number, y: number, opacity = 0.1, scale = 1) => {
      gradientValue.style.background = `radial-gradient(circle at ${x}px ${y}px, 
        rgba(255, 255, 255, ${opacity}) 0, 
        rgba(0, 0, 0, ${opacity}) ${8 * scale}rem
      `;
    };

    const handleMouseMove = async (e: MouseEvent) => {
      const { left, top } = containerValue.getBoundingClientRect();
      const { x, y } = { x: e.clientX - left, y: e.clientY - top };
      mouseOut = false;

      x > 0 &&
        y > 0 &&
        x < clientWidth &&
        y < clientHeight &&
        updateGradient(x, y);
    };

    const handleMouseLeave = async (e: MouseEvent) => {
      const { left, top } = containerValue.getBoundingClientRect();
      const { x, y } = { x: e.clientX - left, y: e.clientY - top };
      mouseOut = true;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      for (let i = 0; i < steps && mouseOut; i++) {
        const t = (i / steps) * Math.PI - Math.PI / 2;
        const sinTPlusOne = Math.sin(t) + 1;
        const xOffset = x + ((clientWidth / 2 - x) * sinTPlusOne) / 2;
        const yOffset = y + ((clientHeight / 2 - y) * sinTPlusOne) / 2;
        updateGradient(xOffset, yOffset);
        await delay(1);
      }

      const { finalX, finalY } = {
        finalX: clientWidth / 2,
        finalY: clientHeight / 2,
      };

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      for (let i = 0; i < steps && mouseOut; i++) {
        const scale = 1 + (i / steps) * 2;
        const opacity = (0.1 * (steps - i)) / steps;
        updateGradient(finalX, finalY, opacity, scale);
        await delay(1);
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      mouseOut && gradientValue.style.setProperty("background", "transparent");
    };

    containerValue.addEventListener("mousemove", handleMouseMove);
    containerValue.addEventListener("mouseleave", handleMouseLeave);
  });

  return (
    <div
      ref={container}
      class="overflow-hidden relative border rounded-xl md:gap-8 hover:border-zinc-400/50 border-zinc-600 min-h-full"
    >
      <div>
        <div class="absolute inset-0 z-0 bg-gradient-to-br via-slate-400/10 from-zinc-600/10 to-zinc-600/10" />
        <div ref={gradientRef} class="absolute inset-0 z-10" />
        <Slot />
      </div>
    </div>
  );
});
