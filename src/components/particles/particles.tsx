import {
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";

interface ParticlesProps {
  classNameTS?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export default component$(
  ({
    classNameTS = "",
    quantity = 30,
    staticity = 50,
    ease = 50,
  }: ParticlesProps) => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const canvasContainerRef = useSignal<HTMLDivElement>();
    const circles = useSignal<Array<Circle>>([]);
    const mouse = useStore({ x: 0, y: 0 });

    const handleMouseMove = $((event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    useVisibleTask$(() => {
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

      const circleParams = (): Circle => {
        const { width, height } = canvasContainer.getBoundingClientRect();
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return {
          x,
          y,
          translateX,
          translateY,
          size,
          alpha,
          targetAlpha,
          dx,
          dy,
          magnetism,
        };
      };

      const drawCircle = (circle: Circle, update = false) => {
        const { x, y, translateX, translateY, size, alpha } = circle;
        context.translate(translateX, translateY);
        context.beginPath();
        context.arc(x, y, size, 0, 2 * Math.PI);
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.fill();
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (!update) {
          circles.value.push(circle);
        }
      };

      const clearContext = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      const drawParticles = () => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
          const circle = circleParams();
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
        circles.value.forEach((circle: Circle, i: number) => {
          const edge = [
            circle.x + circle.translateX - circle.size,
            width - circle.x - circle.translateX - circle.size,
            circle.y + circle.translateY - circle.size,
            height - circle.y - circle.translateY - circle.size,
          ];
          const closestEdge = edge.reduce((a, b) => Math.min(a, b));
          const remapClosestEdge = parseFloat(
            remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
          );
          if (remapClosestEdge > 1) {
            circle.alpha += 0.02;
            if (circle.alpha > circle.targetAlpha) {
              circle.alpha = circle.targetAlpha;
            }
          } else {
            circle.alpha = circle.targetAlpha * remapClosestEdge;
          }
          circle.x += circle.dx;
          circle.y += circle.dy;
          circle.translateX +=
            (mouse.x / (staticity / circle.magnetism) - circle.translateX) /
            ease;
          circle.translateY +=
            (mouse.y / (staticity / circle.magnetism) - circle.translateY) /
            ease;
          if (
            circle.x < -circle.size ||
            circle.x > width + circle.size ||
            circle.y < -circle.size ||
            circle.y > height + circle.size
          ) {
            circles.value.splice(i, 1);
            const newCircle = circleParams();
            drawCircle(newCircle);
          } else {
            drawCircle(
              {
                ...circle,
                x: circle.x,
                y: circle.y,
                translateX: circle.translateX,
                translateY: circle.translateY,
                alpha: circle.alpha,
              },
              true,
            );
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
