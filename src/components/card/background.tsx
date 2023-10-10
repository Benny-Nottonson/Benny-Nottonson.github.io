const opacityMax = 0.1;
const scaleMax = 1;
const opacityStep = 0.005;
const scaleStep = 0.05;
const distanceThreshold = 0.025;
const baseScale = 8;
const targetFrameRate = 90;
const maxVelocity = 10;

interface Point {
  x: number;
  y: number;
}

export class Background {
  private gradientRef: HTMLDivElement;
  private containerRef: HTMLDivElement;
  private acceleration = 0.05;
  private opacity = 0;
  private scale = 0;
  private exit = true;
  private position: Point = { x: 0, y: 0 };
  private target: Point = { x: 0, y: 0 };
  private offset: Point = { x: 0, y: 0 };
  private velocity: Point = { x: 0, y: 0 };
  private passedCenter = false;

  constructor(gradientRef: HTMLDivElement, containerRef: HTMLDivElement) {
    this.gradientRef = gradientRef;
    this.containerRef = containerRef;
    this.position = this.target = this.center();
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

  private update() {
    this.gradientRef!.style.background = `radial-gradient(circle at ${
      this.position.x
    }px ${this.position.y}px, rgba(255, 255, 255, ${
      this.opacity
    }) 0, rgba(0, 0, 0, ${this.opacity}) ${baseScale * this.scale}rem`;
  }

  private center() {
    const { clientWidth, clientHeight } = this.containerRef!;
    return { x: clientWidth / 2, y: clientHeight / 2 };
  }

  private adjustOrb(
    property: "opacity" | "scale",
    direction: "in" | "out",
    max: number,
    step: number,
  ) {
    const currentValue = this[property];
    const goingIn = direction === "in";
    const shouldAdjust =
      (goingIn && currentValue < max) ||
      (!goingIn && currentValue > 0 && this.nearCenter());

    if (shouldAdjust) {
      this[property] += (goingIn ? 1 : -1) * step;
    }
  }

  private nearCenter() {
    const deltaX = Math.abs(this.position.x - this.target.x);
    const deltaY = Math.abs(this.position.y - this.target.y);
    const widthThreshold = this.containerRef!.clientWidth * distanceThreshold;
    const heightThreshold = this.containerRef!.clientHeight * distanceThreshold;

    if (!this.passedCenter) {
      this.passedCenter = deltaX < widthThreshold && deltaY < heightThreshold;
    }

    return this.passedCenter;
  }

  private updateOffset() {
    this.offset = this.getOffset();
  }

  private moveTowards(target: { x: number; y: number }) {
    const { x: targetX, y: targetY } = target;
    const { x: posX, y: posY } = this.position;

    const desiredVelocityX = (targetX - posX) * this.acceleration;
    const desiredVelocityY = (targetY - posY) * this.acceleration;

    this.velocity.x += (desiredVelocityX - this.velocity.x) * this.acceleration;
    this.velocity.y += (desiredVelocityY - this.velocity.y) * this.acceleration;

    const velocityMagnitude = Math.hypot(this.velocity.x, this.velocity.y);

    if (velocityMagnitude > maxVelocity) {
      const scaleFactor = maxVelocity / velocityMagnitude;
      this.velocity.x *= scaleFactor;
      this.velocity.y *= scaleFactor;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  private attach = () => {
    const onEnterOrLeave = (event: MouseEvent) => {
      this.exit = event.type === "mouseleave";
      this.target = this.exit ? this.center() : this.target;
      this.passedCenter = false;
    };

    const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
      this.target = { x: clientX - this.offset.x, y: clientY - this.offset.y };
      this.updateOffset();
    };

    this.containerRef!.addEventListener("mouseenter", onEnterOrLeave);
    this.containerRef!.addEventListener("mouseleave", onEnterOrLeave);
    const debouncedMouseMove = debounce(onMouseMove, 4);
    this.containerRef!.addEventListener("mousemove", debouncedMouseMove);

    return () => {
      this.containerRef!.removeEventListener("mouseenter", onEnterOrLeave);
      this.containerRef!.removeEventListener("mouseleave", onEnterOrLeave);
      this.containerRef!.removeEventListener("mousemove", debouncedMouseMove);
    };
  };

  private animate() {
    const frameInterval = 1000 / targetFrameRate;
    let lastFrameTime = performance.now();

    const updateFrame = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;

      if (deltaTime >= frameInterval) {
        lastFrameTime = currentTime;

        const fadeDirection = this.exit ? "out" : "in";
        this.moveTowards(this.target);
        this.adjustOrb("opacity", fadeDirection, opacityMax, opacityStep);
        this.adjustOrb("scale", fadeDirection, scaleMax, scaleStep);
        this.update();
      }

      requestAnimationFrame(updateFrame);
    };

    updateFrame();
  }
}

function debounce(func: Function, delay: number) {
  let timeoutId: number;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}
