"use client";
import { useEffect, useRef } from "react";
import { Circle } from "./circle";

export function Particles({ quantity }: { quantity: number }) {
  const stateRef = useRef({
    circles: [] as Circle[],
    mouse: { x: 0, y: 0 },
    dpr: 1,
    animationFrame: 0,
    width: 0,
    height: 0,
    context: null as CanvasRenderingContext2D | null,
    canvas: null as HTMLCanvasElement | null,
  });

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    stateRef.current.canvas = canvas;

    const context = canvas.getContext("2d");
    if (!context) return;
    stateRef.current.context = context;

    const container = canvas.parentElement;
    if (!container) return;

    const { dpr } = stateRef.current;

    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect();
      stateRef.current.width = width;
      stateRef.current.height = height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      context.resetTransform();
      context.scale(dpr, dpr);
    };

    handleResize();

    stateRef.current.circles = Array.from(
      { length: quantity },
      () => new Circle(container),
    );

    const animate = () => {
      const { context, canvas, circles, width, height, mouse } =
        stateRef.current;
      if (!context || !canvas) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach((circle) => circle.update(width, height, mouse, context));

      stateRef.current.animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.mouse.x = e.clientX;
      stateRef.current.mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(stateRef.current.animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [quantity]);

  return null;
}
