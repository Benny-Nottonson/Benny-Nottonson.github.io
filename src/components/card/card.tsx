import {
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

class Background {
  private gradientRef: HTMLDivElement | null = null;
  private containerRef: HTMLDivElement | null = null;
  private acceleration = 0.05;
  private velocity = 0;
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
    const { left, top } = this.containerRef!.getBoundingClientRect();
      this.offset = {
        x: left,
        y: top,
      };
    this.attach();
    this.animate();
  }
  
  public update() {
    this.gradientRef!.style.background = `radial-gradient(circle at ${this.position.x}px ${this.position.y}px, 
         rgba(255, 255, 255, ${this.opacity}) 0, 
         rgba(0, 0, 0, ${this.opacity}) ${8 * this.scale}rem
       `;
  }

  public center() {
    const { clientWidth, clientHeight } = this.containerRef!;
    return {
      x: clientWidth / 2,
      y: clientHeight / 2,
    };
  }

  public fadeIn() {
    if (this.opacity >= 0.1) {
      return;
    }
    this.opacity += 0.005;
  }

  public fadeOut() {
    if (this.opacity <= 0 || !this.nearCenter()) {
      return;
    }
    this.opacity -= 0.005;
  }

  public scaleIn() {
    if (this.scale >= 1) {
      return;
    }
    this.scale += 0.025;
  }

  public scaleOut() {
    if (this.scale <= 0 || !this.nearCenter()) {
      return;
    }
    this.scale -= 0.025;
  }

  private nearCenter() {
    // Return if position and target are within 5% of each other
    const thresholdX = this.containerRef!.clientWidth * 0.05;
    const thresholdY = this.containerRef!.clientHeight * 0.05;
    return (
      Math.abs(this.position.x - this.target.x) < thresholdX &&
      Math.abs(this.position.y - this.target.y) < thresholdY
    );
  }

  public moveTowards(target: { x: number; y: number }) {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const ax = dx * this.acceleration;
    const ay = dy * this.acceleration;
    this.velocity += Math.sqrt(ax * ax + ay * ay);
    this.position.x += ax;
    this.position.y += ay;
  }

  public attach() {
    this.containerRef!.addEventListener("mouseenter", (event) => {
      this.exit = false;
      this.target = {
        x: event.clientX - this.offset.x,
        y: event.clientY - this.offset.y,
      };
    });

    this.containerRef!.addEventListener("mouseleave", () => {
      this.exit = true;
      this.target = this.center();
    });

    this.containerRef!.addEventListener("mousemove", (event) => {
      this.target = {
        x: event.clientX - this.offset.x,
        y: event.clientY - this.offset.y,
      };
    });

    document.addEventListener("scroll", () => {
      const { left, top } = this.containerRef!.getBoundingClientRect();
      this.offset = {
        x: left,
        y: top,
      };
    });
  }

  private animate() {
    const updateFrame = () => {
      // Calculate the new position based on the target
      this.moveTowards(this.target);
  
      // Check the exit flag and call the appropriate methods
      if (this.exit) {
        this.fadeOut();
        this.scaleOut();
      } else {
        this.fadeIn();
        this.scaleIn();
      }
  
      // Update the background
      this.update();
  
      // Request the next animation frame
      requestAnimationFrame(updateFrame);
    };
  
    // Start the animation loop
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
