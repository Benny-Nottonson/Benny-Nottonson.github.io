import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  const container = useSignal<HTMLDivElement>();
  const gradientRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    const containerValue = container.value!;
    const gradientValue = gradientRef.value!;
    let mouseOut = true;

    const updateGradient = (
      x: number,
      y: number,
      opacity: number = 0.1,
      scale: number = 1,
    ) => {
      gradientValue.style.setProperty(
        "background",
        `radial-gradient(circle at ${x}px ${y}px, 
          rgba(255, 255, 255, ${opacity}) 0, 
          rgba(0, 0, 0, ${opacity}) ${8 * scale}rem
        `,
      );
    };

    const handleMouseAction = async (e: MouseEvent) => {
      const { clientWidth, clientHeight } = containerValue;
      const { left, top } = containerValue.getBoundingClientRect();
      const { x, y } = { x: e.clientX - left, y: e.clientY - top };
      const steps = 250;

      if (e.type === "mousemove") {
        mouseOut = false;
        if (x > 0 && y > 0 && x < clientWidth && y < clientHeight) {
          updateGradient(x, y);
        }
      } else if (e.type === "mouseleave") {
        mouseOut = true;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        for (let i = 0; i < steps && mouseOut; i++) {
          const t = (i / steps) * Math.PI - Math.PI / 2;
          const xOffset = x + ((clientWidth / 2 - x) * (Math.sin(t) + 1)) / 2;
          const yOffset = y + ((clientHeight / 2 - y) * (Math.sin(t) + 1)) / 2;
          updateGradient(xOffset, yOffset);
          await new Promise((resolve) => setTimeout(resolve, 1));
        }

        const finalX = clientWidth / 2;
        const finalY = clientHeight / 2;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        for (let i = 0; i < steps && mouseOut; i++) {
          const scale = 1 + (i / steps) * 2;
          const opacity = (0.1 * (steps - i)) / steps;
          updateGradient(finalX, finalY, opacity, scale);
          await new Promise((resolve) => setTimeout(resolve, 1));
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (mouseOut) {
          gradientValue.style.setProperty("background", "transparent");
        }
      }
    };

    containerValue.addEventListener("mousemove", handleMouseAction);
    containerValue.addEventListener("mouseleave", handleMouseAction);
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
