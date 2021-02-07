import { Point } from "./common.ts";

export class Vector2 implements Point {
  x: number;
  y: number;

  constructor();
  constructor(target: Vector2);
  constructor(x: number, y: number);
  constructor(xOrTarget?: number | Vector2, yOrNone?: number) {
    if (xOrTarget) {
      const { x, y } = typeof xOrTarget === "number"
        ? { x: xOrTarget, y: yOrNone! }
        : xOrTarget;

      this.x = x;
      this.y = y;
    } else {
      this.x = 0;
      this.y = 0;
    }
  }

  static negativeInfinity(): Vector2 {
    return new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
  }

  static positiveInfinity(): Vector2 {
    return new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  static up(): Vector2 {
    return new Vector2(0, 1);
  }

  static down(): Vector2 {
    return new Vector2(0, -1);
  }

  static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  static right(): Vector2 {
    return new Vector2(1, 0);
  }

  clone(): Vector2 {
    return new Vector2(this);
  }

  mag(): number {
    return Math.hypot(this.x, this.y);
  }

  mag2(): number {
    return this.x ** 2 + this.y ** 2;
  }

  normal(): Vector2 {
    return this.div(this.mag());
  }

  normalize(): Vector2 {
    return this.set(this.normal());
  }

  angle(): number {
    return Math.atan2(this.x, this.y);
  }

  clamp(length: number): Vector2 {
    return this.set(this.normal().mul(length));
  }

  dot(other: Vector2): number {
    const { x, y } = this.mul(other);
    return x + y;
  }

  cross(other: Vector2): number {
    const { x, y } = this.mul(other);
    return x - y;
  }

  set(target: Vector2): Vector2;
  set(x: number, y: number): Vector2;
  set(xOrTarget: number | Vector2, yOrNone?: number): Vector2 {
    const { x, y } = typeof xOrTarget === "number"
      ? { x: xOrTarget, y: yOrNone! }
      : xOrTarget;

    this.x = x;
    this.y = y;

    return this;
  }

  add(other: number): Vector2;
  add(other: Vector2): Vector2;
  add(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x + x, this.y + y);
  }

  sub(other: number): Vector2;
  sub(other: Vector2): Vector2;
  sub(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x - x, this.y - y);
  }

  mul(other: number): Vector2;
  mul(other: Vector2): Vector2;
  mul(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x * x, this.y * y);
  }

  div(other: number): Vector2;
  div(other: Vector2): Vector2;
  div(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x / x, this.y / y);
  }

  eq(other: Vector2): boolean;
  eq(x: number, y: number): boolean;
  eq(xOrOther: Vector2 | number, yOrNone?: number): boolean {
    const { x, y } = typeof xOrOther === "number"
      ? { x: xOrOther, y: yOrNone! }
      : xOrOther;

    return this.x === x && this.y === y;
  }
}
