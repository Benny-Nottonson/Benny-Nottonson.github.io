import { Circle } from "./circle";

const staticity = 50;
const ease = 50;

export class Background {
  private canvasRef: HTMLCanvasElement;
  private containerRef: HTMLDivElement;
  private circles: Circle[] = [];
  private context: CanvasRenderingContext2D;
  private dpr = window.devicePixelRatio || 1;
  private mouse = { x: 0, y: 0 };
  private particleCount: number;

  constructor(
    canvasRef: HTMLCanvasElement,
    containerRef: HTMLDivElement,
    quantity: number,
  ) {
    this.canvasRef = canvasRef;
    this.containerRef = containerRef;
    this.particleCount = quantity;
    this.context = this.canvasRef.getContext("2d")!;
    this.attach();
    this.canvasRef.style.filter = "url(#liquid)";
  }

  private resizeCanvas = () => {
    const { width, height } = document.body.getBoundingClientRect();
    const dpr = this.dpr;
    this.canvasRef.width = width * dpr * 3;
    this.canvasRef.height = height * dpr * 3;
    this.context.scale(dpr, dpr);
  };

  private onMouseMove = (event: MouseEvent) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  };

  private drawCircle = (circle: Circle, update = false) => {
    circle.draw(this.context, this.dpr);
    if (!update) {
      this.circles.push(circle);
    }
  };

  private clearContext = () => {
    this.context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
  };

  private drawParticles = () => {
    this.clearContext();
    for (let i = 0; i < this.particleCount; i++) {
      this.drawCircle(new Circle(this.containerRef));
    }
  };

  private remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;

  private animate = () => {
    this.clearContext();
    const { width, height } = this.canvasRef.getBoundingClientRect();
    this.circles = this.circles.filter((circle) => {
      const closestEdge = circle.getClosestEdge(width, height);
      const remapClosestEdge = parseFloat(
        this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      circle.animateMotion(remapClosestEdge, ease, this.mouse, staticity);
      if (circle.inBounds(width, height)) {
        this.drawCircle(new Circle(this.containerRef));
        return false;
      } else {
        circle.draw(this.context, this.dpr);
        return true;
      }
    });
    window.requestAnimationFrame(this.animate);
  };

  private initCanvas = () => {
    this.resizeCanvas();
    this.drawParticles();
    this.animate();
  };

  private attach = () => {
    this.initCanvas();
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.resizeCanvas);
  };
}
