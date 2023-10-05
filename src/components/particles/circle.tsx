export class Circle {
  private x: number;
  private y: number;
  private translateX = 0;
  private translateY = 0;
  private size: number;
  private alpha = 0;
  private targetAlpha: number;
  private scaleFactor: number;
  private dx: number;
  private dy: number;
  private magnetism: number;

  constructor(canvasContainer: HTMLDivElement) {
    const { width, height } = canvasContainer.getBoundingClientRect();
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
    this.size = Math.random() * 1.4 + 0.1;
    this.scaleFactor = (1 / this.size) * 2.5;
    this.targetAlpha = Math.random() * 0.5 + 0.1 / this.scaleFactor;
    this.dx = ((Math.random() - 0.5) * 0.2) / this.scaleFactor;
    this.dy = ((Math.random() - 0.5) * 0.2) / this.scaleFactor;
    this.magnetism = 0.1 + (Math.random() * 4) / this.scaleFactor;
  }

  draw(context: CanvasRenderingContext2D, dpr: number) {
    context.translate(this.translateX, this.translateY);
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    context.fill();
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  getClosestEdge(width: number, height: number) {
    return Math.min(
      this.x + this.translateX - this.size,
      width - this.x - this.translateX - this.size,
      this.y + this.translateY - this.size,
      height - this.y - this.translateY - this.size,
    );
  }

  inBounds(width: number, height: number) {
    return (
      this.x < -this.size ||
      this.x > width + this.size ||
      this.y < -this.size ||
      this.y > height + this.size
    );
  }

  animateMotion(
    remapClosestEdge: number,
    ease: number,
    mouse: { x: number; y: number },
    staticity: number,
  ) {
    if (remapClosestEdge > 1) {
      this.alpha += 0.02;
      this.alpha = Math.min(this.alpha, this.targetAlpha);
    } else {
      this.alpha = this.targetAlpha * remapClosestEdge;
    }

    this.x += this.dx * this.scaleFactor;
    this.y += this.dy * this.scaleFactor;

    this.translateX +=
      (mouse.x / (staticity / this.magnetism) - this.translateX) / ease;
    this.translateY +=
      (mouse.y / (staticity / this.magnetism) - this.translateY) / ease;
  }
}
