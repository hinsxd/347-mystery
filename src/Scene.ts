import { areCoprimes } from "./areCoprimes";
import { Circle } from "./Circle";
import { TWO_PI } from "./consts";

export class Scene {
  m: number;
  n: number;
  showSmallCircleCircumference: boolean;
  distanceFromCircumference: number;
  ctx: CanvasRenderingContext2D;
  rollAngle: number;
  rotation: number;

  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  constructor(params: {
    m: number;
    n: number;
    showSmallCircleCircumference: boolean;
    distanceFromCircumference: number;
    rollAngle?: number;
    rotation?: number;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
  }) {
    const {
      m,
      n,
      showSmallCircleCircumference,
      distanceFromCircumference,
      rollAngle = 0,
      rotation = 0,
      width,
      height,
      canvas,
    } = params;

    const ctx = canvas.getContext?.("2d");
    if (!ctx) {
      throw new Error("Canvas not found");
    }

    this.m = m;
    this.n = n;
    this.showSmallCircleCircumference = showSmallCircleCircumference;
    this.distanceFromCircumference = distanceFromCircumference;
    this.ctx = ctx;
    this.rollAngle = rollAngle;
    this.rotation = rotation;
    this.canvas = canvas;
    this.width = width;
    this.height = height;

    this.setup();
  }

  setup() {
    const getPixelRatio = (context: any) => {
      const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    };
    const ratio = getPixelRatio(this.ctx);

    this.canvas.width = this.width * ratio;
    this.canvas.height = this.height * ratio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Use math coordinate, e.g. positive y goes up
    this.ctx.transform(1, 0, 0, -1, 0, this.canvasSize);
    this.ctx.translate(this.canvasSize / 2, this.canvasSize / 2);
    this.ctx.lineWidth = 6;
  }
  drawBackground() {
    this.ctx.save();

    // ========= CIRCLE =========
    this.ctx.strokeStyle = "#aaaaaa";

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.outerRadius, 0, TWO_PI, true);
    this.ctx.stroke();
    // ========= CIRCLE =========
    this.ctx.restore();
  }

  get canvasSize() {
    return this.canvas.height;
  }

  get outerRadius() {
    return this.canvasSize / 2 - 10;
  }

  drawStar(pointIndex: number = 0) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#dddddd";

    const tempCircle = new Circle(
      this.outerRadius,
      0,
      this.rollAngle,
      this.distanceFromCircumference,
      this.m,
      this.n,
      this.ctx
    );

    for (let angle = 0; angle < TWO_PI * this.m; angle += 0.1) {
      tempCircle.rollAngle = angle;
      if (angle === 0) {
        this.ctx.moveTo(...tempCircle.rollingPointCoords[pointIndex]);
      } else {
        this.ctx.lineTo(...tempCircle.rollingPointCoords[pointIndex]);
      }
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  draw() {
    // Change the origin to center
    this.ctx.clearRect(
      -this.canvasSize / 2,
      -this.canvasSize / 2,
      this.canvasSize,
      this.canvasSize
    );
    this.drawBackground();

    for (let i = 0; i < (!areCoprimes(this.m, this.n) ? this.n : 1); i++) {
      this.drawStar(i);
    }

    const circles: Circle[] = [];

    for (let i = 0; i < this.m - this.n; i++) {
      const circle = new Circle(
        this.outerRadius,
        (TWO_PI / (this.m - this.n)) * i,
        this.rollAngle,
        this.distanceFromCircumference,
        this.m,
        this.n,
        this.ctx
      );
      circles.push(circle);
    }
    circles.forEach((circle) => {
      circle.draw(this.showSmallCircleCircumference);
    });

    this.ctx.save();
    this.ctx.strokeStyle = "#0000ff99";

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const nextCircle = circles[(i + 1) % circles.length];
      for (let j = 0; j < circle.rollingPointCoords.length; j++) {
        this.ctx.beginPath();
        this.ctx.moveTo(...circle.rollingPointCoords[j]);
        this.ctx.lineTo(...nextCircle.rollingPointCoords[j]);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  rotate(angle: number) {
    this.ctx.rotate(angle);
  }
  roll(angle: number) {
    this.rollAngle += angle;
  }
}
