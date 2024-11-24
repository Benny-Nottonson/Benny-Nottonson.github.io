type Position = { x: number; y: number };

export class Circle {
  private static readonly TWO_PI = Math.PI * 2;
  private readonly size: number;
  private readonly magnetism: number;
  private readonly targetAlpha: number;
  private readonly position: Position;
  private readonly velocity: Position;
  private readonly translate: Position = { x: 0, y: 0 };
  private alpha = 0;

  constructor({ clientWidth, clientHeight }: { clientWidth: number; clientHeight: number }) {
    const size = Math.random() * 1.4 + 0.1;
    const scaleFactor = 2.5 / size;
    const velocity = (Math.random() - 0.1) * 0.2 * scaleFactor;

    this.size = size;
    this.magnetism = 0.1 + (Math.random() * 4) / scaleFactor;
    this.targetAlpha = (Math.random() * 0.5 + 0.1) / scaleFactor;
    this.position = { 
      x: Math.random() * clientWidth,
      y: Math.random() * clientHeight 
    };
    this.velocity = { x: velocity, y: velocity };
  }

  public update(width: number, height: number, mouse: Position, context: CanvasRenderingContext2D): this {
    const pos = { x: this.position.x + this.translate.x, y: this.position.y + this.translate.y };

    if (pos.x + this.size < 0 || pos.x - this.size > width || pos.y + this.size < 0 || pos.y - this.size > height) {
      return new Circle({ clientWidth: width, clientHeight: height }) as this;
    }

    const edge = Math.min(pos.x - this.size, width - pos.x - this.size, pos.y - this.size, height - pos.y - this.size);
    const offset = 50 / this.magnetism;
    
    this.alpha = edge > 1 ? Math.min(this.alpha + 0.02, this.targetAlpha) : this.targetAlpha * edge;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.translate.x += (mouse.x / offset - this.translate.x) * 0.02;
    this.translate.y += (mouse.y / offset - this.translate.y) * 0.02;

    this.draw(context);
    return this;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { x, y } = { x: this.position.x + this.translate.x, y: this.position.y + this.translate.y };
    
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Circle.TWO_PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
  }
}
