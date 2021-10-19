import { Type } from "./deps.ts";
import { GrowableBuffer } from "./growable_buffer.ts";

export class TypeStore<C> extends GrowableBuffer {
  readonly type: Type<C>;

  #view = new DataView(this.buffer);
  #length = 0;

  get view() {
    return this.#view;
  }

  get length() {
    return this.#length;
  }

  get capacity() {
    return this.buffer.byteLength / this.type.size;
  }

  set capacity(capacity: number) {
    if (capacity > this.capacity) {
      this.grow(this.type.size * capacity);
    }
  }

  constructor(type: Type<C>, capacity = 32) {
    super(type.size * capacity);
    this.type = type;
  }

  push(value: C): number {
    const length = this.length;
    if (this.capacity <= length) {
      this.grow();
    }

    this.type.write(this.view, this.type.size * length, value);
    this.#length += 1;

    return length;
  }

  set(index: number, value: C): number {
    const next = index + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.type.write(this.view, this.type.size * index, value);

    return index;
  }

  clear(index: number) {
    const start = this.type.size * index;
    const end = start + this.type.size;
    this.uint8array.fill(0, start, end);
  }

  get(index: number): C | undefined {
    if (index < this.capacity) {
      return this.type.read(this.view, this.type.size * index);
    }
  }

  grow(size?: number) {
    super.grow(size);
    this.#view = new DataView(this.buffer);
  }
}
