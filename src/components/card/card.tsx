import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  const container = useSignal<HTMLDivElement>();
  const gradientRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    document.addEventListener("mousemove", (e) => {
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
          const xCalc = x;
          const yCalc = y;
          gradientRef.value.style.setProperty(
            "background",
            `radial-gradient(circle at ${xCalc}px ${yCalc}px, rgba(255, 255, 255, 0.075) 0, rgba(122, 122, 122, 0.05) 5rem, rgba(0, 0, 0, 0.1) 10rem)`,
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
        <div class="absolute inset-0 z-0 bg-gradient-to-br via-zinc-700/10 from-slate-500/10 to-slate-500/10" />
        <div ref={gradientRef} class="absolute inset-0 z-10" />
        <Slot />
      </div>
    </div>
  );
});
