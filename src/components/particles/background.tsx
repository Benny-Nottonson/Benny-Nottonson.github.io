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
    this.canvasRef.style.filter = "url(#liquid)";
    this.attach();
  }

  private resizeCanvas = () => {
    const { width, height } = document.body.getBoundingClientRect();
    this.canvasRef.width = width * this.dpr * 3;
    this.canvasRef.height = height * this.dpr * 3;
    this.context.scale(this.dpr, this.dpr);
    return this;
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
      const circle = new Circle(this.containerRef);
      this.drawCircle(circle);
    }
    return this;
  };

  private animate = () => {
    this.clearContext();
    const { width, height } = this.canvasRef.getBoundingClientRect();
    this.circles = this.circles.map((circle) => {
      const closestEdge = circle.getClosestEdge(width, height);
      const remapClosestEdge = parseFloat((closestEdge / 20).toFixed(2));
      circle.animateMotion(remapClosestEdge, ease, this.mouse, staticity);
      circle.inBounds(width, height)
        ? this.drawCircle(new Circle(this.containerRef), true)
        : circle.draw(this.context, this.dpr);
      return circle;
    });
    window.requestAnimationFrame(this.animate);
  };

  private initCanvas = () => {
    this.resizeCanvas().drawParticles().animate();
  };

  private attach = () => {
    this.initCanvas();
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", () => {
      window.requestAnimationFrame(this.resizeCanvas);
    });
  };
}
