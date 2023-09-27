import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

class Background {
  private gradientRef: HTMLDivElement | null = null;
  private containerRef: HTMLDivElement | null = null;
  private acceleration = 0.05;
  private opacity = 0;
  private scale = 0;
  private exit = true;
  private position = { x: 0, y: 0 };
  private target = { x: 0, y: 0 };
  private offset = { x: 0, y: 0 };

  constructor(gradientRef: HTMLDivElement, containerRef: HTMLDivElement) {
    this.gradientRef = gradientRef;
    this.containerRef = containerRef;
    this.position = this.center();
    this.target = this.center();
    this.offset = this.getOffset();
    this.attach();
    this.animate();
  }

  private getOffset() {
    const { left, top } = this.containerRef!.getBoundingClientRect();
    return {
      x: left,
      y: top,
    };
  }

  public update() {
    this.gradientRef!.style.background = `radial-gradient(circle at ${
      this.position.x
    }px ${this.position.y}px, rgba(255, 255, 255, ${
      this.opacity
    }) 0, rgba(0, 0, 0, ${this.opacity}) ${8 * this.scale}rem`;
  }

  public center() {
    return {
      x: this.containerRef!.clientWidth / 2,
      y: this.containerRef!.clientHeight / 2,
    };
  }

  public adjustOrb(
    property: "opacity" | "scale",
    direction: "in" | "out",
    max: number,
    step: number,
  ) {
    const currentValue = this[property];
    if (
      (direction === "in" && currentValue >= max) ||
      (direction === "out" && (currentValue <= 0 || !this.nearCenter()))
    ) {
      return;
    }
    this[property] += (direction === "in" ? 1 : -1) * step;
  }

  private nearCenter() {
    return (
      Math.abs(this.position.x - this.target.x) <
        this.containerRef!.clientWidth * 0.025 &&
      Math.abs(this.position.y - this.target.y) <
        this.containerRef!.clientHeight * 0.025
    );
  }

  public moveTowards(target: { x: number; y: number }) {
    const ax = (target.x - this.position.x) * this.acceleration;
    const ay = (target.y - this.position.y) * this.acceleration;
    this.position.x += ax;
    this.position.y += ay;
  }

  public attach() {
    const onEnterOrLeave = (event: MouseEvent) => {
      this.exit = event.type === "mouseleave";
      this.target = this.exit ? this.center() : this.target;
    };

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      this.target = { x: clientX - this.offset.x, y: clientY - this.offset.y };
    };

    this.containerRef!.addEventListener("mouseenter", onEnterOrLeave);
    this.containerRef!.addEventListener("mouseleave", onEnterOrLeave);
    this.containerRef!.addEventListener("mousemove", onMouseMove);
    document.addEventListener("scroll", () => (this.offset = this.getOffset()));
  }

  private animate() {
    const updateFrame = () => {
      const inOut = this.exit ? "out" : "in";
      this.moveTowards(this.target);
      this.adjustOrb("opacity", inOut, 0.1, 0.005);
      this.adjustOrb("scale", inOut, 1, 0.05);
      this.update();
      requestAnimationFrame(updateFrame);
    };

    updateFrame();
  }
}

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
