import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Background } from "./background";
import Filter from "./filter";

export default component$(
  ({ classNameTS, quantity }: { classNameTS: string; quantity: number }) => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const canvasContainerRef = useSignal<HTMLDivElement>();

    useVisibleTask$(() => {
      new Background(canvasRef.value!, canvasContainerRef.value!, quantity);
    });

    return (
      <div class={classNameTS} ref={canvasContainerRef} aria-hidden="true">
        <Filter />
        <canvas ref={canvasRef} />
      </div>
    );
  },
);
