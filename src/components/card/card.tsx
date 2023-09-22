import {
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

class Background {
  private acceleration = 0.1;
  private opacity = 0;
  private scale = 0;
  private exit = true;
  private velocity = 0;
  private position = { x: 0, y: 0 };
  private target = { x: 0, y: 0 };
  private offset = { x: 0, y: 0 };

  constructor(private gradientRef: HTMLDivElement, private containerRef: HTMLDivElement) {
    this.position = this.center();
    this.target = this.center();
    this.offset = this.getOffset();
    this.attach();
    this.animate();
  }

  private update() {
    this.gradientRef!.style.background = `radial-gradient(circle at ${this.position.x}px ${this.position.y}px, 
      rgba(255, 255, 255, ${this.opacity}) 0, 
      rgba(0, 0, 0, ${this.opacity}) ${8 * this.scale}rem
    `;
  }

  private center() {
    const { clientWidth, clientHeight } = this.containerRef!;
    return {
      x: clientWidth / 2,
      y: clientHeight / 2,
    };
  }

  private fadeOrb(increment: number) {
    this.opacity = Math.min(0.1, Math.max(0, this.opacity + increment));
  }


  private scaleOrb(increment: number) {
    this.scale = Math.min(1, Math.max(0, this.scale + increment));
  }

  private nearCenter() {
    const thresholdX = this.containerRef!.clientWidth * 0.05;
    const thresholdY = this.containerRef!.clientHeight * 0.05;
    return (
      Math.abs(this.position.x - this.target.x) < thresholdX &&
      Math.abs(this.position.y - this.target.y) < thresholdY
    );
  }

  private moveTowards(target: { x: number; y: number }) {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const angle = Math.atan2(dy, dx);
    const ax = Math.cos(angle) * this.acceleration;
    const ay = Math.sin(angle) * this.acceleration;
    this.velocity += Math.sqrt(ax * ax + ay * ay);
    this.position.x += ax * this.velocity;
    this.position.y += ay * this.velocity;
  }
  

  private attach() {
    this.containerRef!.addEventListener("mouseenter", (event) => {
      this.exit = false;
      this.target = this.getMousePosition(event);
    });

    this.containerRef!.addEventListener("mouseleave", () => {
      this.exit = true;
      this.target = this.center();
    });

    this.containerRef!.addEventListener("mousemove", (event) => {
      this.target = this.getMousePosition(event);
    });

    document.addEventListener("scroll", () => {
      this.offset = this.getOffset();
    });
  }

  private animate() {
    const updateFrame = () => {
      this.moveTowards(this.target);

      if (!this.exit) {
        this.fadeOrb(0.005);
        this.scaleOrb(0.025);
      } else if (this.nearCenter()) {
        this.fadeOrb(-0.005);
        this.scaleOrb(-0.025);
      }

      this.update();

      requestAnimationFrame(updateFrame);
    };

    updateFrame();
  }

  private getOffset() {
    const { left, top } = this.containerRef!.getBoundingClientRect();
    return { x: left, y: top };
  }

  private getMousePosition(event: MouseEvent) {
    return {
      x: event.clientX - this.offset.x,
      y: event.clientY - this.offset.y,
    };
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
