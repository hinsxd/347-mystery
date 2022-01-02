import { TWO_PI } from "./consts";
import { getCoordOnCircle, clamp } from "./utils";

export class Circle {
  rollingPointRadius: number;
  rollAngle: number;
  radius: number;

  private centerDistanceFromOrigin: number;
  private m: number;
  private n: number;
  private startAngle: number;
  private ctx: CanvasRenderingContext2D;

  constructor(
    outerRadius: number,
    startAngle: number,
    rollAngle: number,
    distanceFromCircumference: number,
    m: number,
    n: number,
    ctx: CanvasRenderingContext2D
  ) {
    const radius = (outerRadius * n) / m;
    const centerDistanceFromOrigin = outerRadius * (1 - n / m);

    const rollingPointRadius =
      radius * (1 - clamp(distanceFromCircumference, 0, 1));

    this.m = m;
    this.n = n;
    this.startAngle = startAngle;
    this.radius = radius;
    this.centerDistanceFromOrigin = centerDistanceFromOrigin;

    this.rollAngle = rollAngle;

    this.rollingPointRadius = rollingPointRadius;
    this.ctx = ctx;
  }

  get rollingPointCoords(): [number, number][] {
    return Array.from({ length: this.n })
      .fill(0)
      .map((_, i) =>
        getCoordOnCircle(
          this.centerCoord,
          this.rollingPointRadius,
          this.selfRollAngle + (TWO_PI / this.n) * i
        )
      );
  }

  get centerCoord(): [number, number] {
    return getCoordOnCircle(
      [0, 0],
      this.centerDistanceFromOrigin,
      this.startAngle + this.rollAngle
    );
  }
  get selfRollAngle() {
    return -(this.rollAngle * (this.m / this.n - 1));
  }

  draw(showSmallCircleCircumference: boolean = false) {
    // Dots on circle

    const rollingPoints = this.rollingPointCoords;
    rollingPoints.forEach((coord) => {
      this.ctx.beginPath();
      this.ctx.arc(...coord, 12, 0, TWO_PI, true);
      this.ctx.fillStyle = "#ff0000";
      this.ctx.fill();
    });

    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.moveTo(...rollingPoints[0]);
    rollingPoints.forEach((coord) => {
      this.ctx.lineTo(...coord);
    });
    this.ctx.lineTo(...rollingPoints[0]);
    this.ctx.stroke();

    // Circumference
    if (showSmallCircleCircumference) {
      this.ctx.strokeStyle = "#a0a0a0";
      this.ctx.beginPath();
      this.ctx.arc(...this.centerCoord, this.radius, 0, TWO_PI, true);
      this.ctx.stroke();
    }
  }
}
