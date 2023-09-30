import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import Background from "./background.min.mjs";

export default component$(() => {
  const container = useSignal<HTMLDivElement>();
  const gradientRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    new Background(gradientRef.value!, container.value!);
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
