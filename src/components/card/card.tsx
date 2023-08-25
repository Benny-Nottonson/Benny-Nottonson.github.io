import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  const container = useSignal<HTMLDivElement>();
  const gradientRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (container.value && gradientRef.value) {
        const rect = container.value.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (
          x > 0 &&
          y > 0 &&
          x < container.value.clientWidth &&
          y < container.value.clientHeight
        ) {
          gradientRef.value.style.setProperty(
            "background",
            `radial-gradient(circle at ${x}px ${y}px, 
              rgba(255, 255, 255, 0.1) 0, 
              rgba(0, 0, 0, 0.1) 8rem
            `,
          );
        } else {
          gradientRef.value.style.setProperty("background", "transparent");
        }
      }
    });
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
