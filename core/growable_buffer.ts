export class GrowableBuffer {
  #buffer: Uint8Array;

  get uint8array(): Uint8Array {
    return this.#buffer;
  }

  get buffer(): ArrayBuffer {
    return this.#buffer.buffer;
  }

  constructor(size = 256) {
    this.#buffer = new Uint8Array(size);
  }

  grow(size = this.#buffer.byteLength * 2) {
    const buffer = new Uint8Array(size);
    buffer.set(this.#buffer);
    this.#buffer = buffer;
  }
}
