import { Point } from "../std/common.ts";

export class Frame {
  readonly width: number;
  readonly height: number;
  readonly pixels: number;
  readonly bytes: number;
  readonly uint32array: Uint32Array;
  readonly uint8array: Uint8Array;

  buffer: ArrayBuffer;

  #view: DataView;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = width * height;
    this.bytes = this.pixels * 4;
    this.buffer = new ArrayBuffer(this.bytes);
    this.uint32array = new Uint32Array(this.buffer);
    this.uint8array = new Uint8Array(this.buffer);
    this.#view = new DataView(this.buffer);
  }

  /** iterate over all of the points in this surface */
  *points(): Generator<Point> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield { x, y };
      }
    }
  }

  /** point to index */
  pti(p: Point): number {
    return (p.x + p.y * this.width) * 4;
  }

  /** index to point */
  itp(i: number): Point {
    i -= i % 4;
    i /= 4;
    return { x: i % this.width, y: Math.floor(i / this.width) };
  }

  /** index to row */
  row(i: number): number {
    i -= i % 4;
    i /= 4;
    return i % this.width;
  }

  /** index to col */
  col(i: number): number {
    i -= i % 4;
    i /= 4;
    return Math.floor(i / this.width);
  }

  /** get color at index */
  get(i: number): number {
    return this.#view.getUint32(i);
  }

  /** set color at index */
  set(i: number, c: number) {
    this.#view.setUint32(i, c);
  }

  /** changes the pixel at specified index to whatever the callback returns */
  change(i: number, cb: (c: number) => number) {
    const c = this.#view.getUint32(i);
    this.#view.setUint32(i, cb(c));
  }

  /** applies a function to all pixels */
  map(cb: (c: number, i: number) => number) {
    for (let i = 0; i < this.bytes; i += 4) {
      const c = this.#view.getUint32(i);
      this.#view.setUint32(i, cb(c, i));
    }
  }

  /** fills the buffer with the specified color */
  fill(c: number) {
    this.uint32array.fill(c);
  }

  /** copies the buffer to specified index */
  copy(buffer: ArrayBufferLike, i: number, height = 1) {
    i -= i % 4;

    const width = buffer.byteLength / 4 / height;
    const view = new DataView(buffer);

    if (this.buffer.byteLength < buffer.byteLength + i) {
      console.log("Source buffer is too large to copy to destination");
      throw new RangeError("Source buffer is too large to copy to destination");
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const target = (x + y * this.width) * 4 + i;
        const source = view.getUint32((x + y * width) * 4);

        this.#view.setUint32(target, source);
      }
    }
  }
}
