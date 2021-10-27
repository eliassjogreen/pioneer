import { GrowableArrayBuffer } from "../growable_array_buffer.ts";
import { Entities } from "./entities.ts";

export class GrowableEntities extends GrowableArrayBuffer implements Entities {
  #entities: Float64Array = new Float64Array(this.buffer);
  #free: number[] = [];
  #length = 0;

  get length() {
    return this.#length;
  }

  get capacity() {
    return this.#entities.length;
  }

  set capacity(capacity: number) {
    if (capacity > this.capacity) {
      const initial = this.capacity;
      this.grow(Float64Array.BYTES_PER_ELEMENT * capacity);
      for (let i = initial; i < this.capacity; i++) {
        this.#free.push(i);
      }
    }
  }

  constructor(capacity = 32) {
    super(Float64Array.BYTES_PER_ELEMENT * capacity);

    for (let i = 0; i < capacity; i++) {
      this.#free.push(i);
    }
  }

  spawn(): number {
    if (this.#free.length === 0) {
      this.capacity *= 2;
    }
    const entity = this.#free.shift()!;

    this.#entities[entity] = 0;
    this.#length += 1;

    return entity;
  }

  kill(entity: number): void {
    this.#entities[entity] = 0;
    this.#free.push(entity);
    this.#length -= 1;
  }

  get(entity: number): number {
    return this.#entities[entity];
  }

  set(entity: number, mask: number): number {
    const next = entity + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.#entities[entity] = mask;
    return this.get(entity);
  }

  enable(entity: number, mask: number): number {
    const next = entity + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.#entities[entity] |= mask;
    return this.get(entity);
  }

  disable(entity: number, mask: number): number {
    const next = entity + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.#entities[entity] &= ~mask;
    return this.get(entity);
  }

  entries(): [number, number][] {
    return [...this.#entities.entries()].filter(([index]) =>
      !this.#free.includes(index)
    );
  }

  grow(size?: number) {
    super.grow(size);
    this.#entities = new Float64Array(this.buffer);
  }
}
