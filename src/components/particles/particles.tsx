import {
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";
import { Circle } from "./circle";

interface ParticlesProps {
  classNameTS?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
}

export default component$(
  ({
    classNameTS = "",
    quantity = 30,
    staticity = 50,
    ease = 50,
  }: ParticlesProps) => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const canvasContainerRef = useSignal<HTMLDivElement>();
    const mouse = useStore({ x: 0, y: 0 });

    const handleMouseMove = $((event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    useVisibleTask$(() => {
      const circles: Array<Circle> = [];
      const canvas = canvasRef.value!;
      const context = canvas.getContext("2d")!;
      const dpr = window.devicePixelRatio || 1;
      const canvasContainer = canvasContainerRef.value!;
      const { width, height } = canvasContainer.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      const resizeCanvas = () => {
        const { width, height } = canvasContainer.getBoundingClientRect();
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        context.scale(dpr, dpr);
      };

      const drawCircle = (circle: Circle, update = false) => {
        circle.draw(context, dpr);

        if (!update) {
          circles.push(circle);
        }
      };

      const clearContext = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      const drawParticles = () => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
          const circle = new Circle(canvasContainer);
          drawCircle(circle);
        }
      };

      const remapValue = (
        value: number,
        start1: number,
        end1: number,
        start2: number,
        end2: number,
      ): number => {
        const remapped =
          ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
      };

      const animate = () => {
        clearContext();
        const { width, height } = canvasContainer.getBoundingClientRect();
        circles.forEach((circle: Circle, i: number) => {
          const closestEdge = circle.getClosestEdge(width, height);
          const remapClosestEdge = parseFloat(
            remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
          );
          circle.animateMotion(remapClosestEdge, ease, mouse, staticity);
          if (circle.inBounds(width, height)) {
            circles.splice(i, 1);
            const newCircle = new Circle(canvasContainer);
            drawCircle(newCircle);
          } else {
            circle.draw(context, dpr);
          }
        });
        window.requestAnimationFrame(animate);
      };

      const initCanvas = () => {
        resizeCanvas();
        drawParticles();
        animate();
      };

      initCanvas();
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", resizeCanvas);
      };
    });

    return (
      <div class={classNameTS} ref={canvasContainerRef} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    );
  },
);
