import { GrowableBuffer } from "./growable_buffer.ts";

export interface Entities {
  readonly length: number;

  spawn(): number;
  kill(entity: number): void;
  get(entity: number): number;
  set(entity: number, mask: number): number;
  enable(entity: number, mask: number): number;
  disable(entity: number, mask: number): number;
  entries(): [number, number][];
}

export class DynamicEntities implements Entities {
  #free: number[] = [];
  #entities: number[] = [];
  #length = 0;

  get length(): number {
    return this.#length;
  }

  spawn(): number {
    const entity = this.#free.shift() ?? this.#entities.length;
    if (entity === this.#entities.length) {
      this.#entities.push(0);
    }
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
    this.#entities[entity] = mask;
    return this.get(entity);
  }

  enable(entity: number, mask: number): number {
    this.#entities[entity] |= mask;
    return this.get(entity);
  }

  disable(entity: number, mask: number): number {
    this.#entities[entity] &= ~mask;
    return this.get(entity);
  }

  entries(): [number, number][] {
    return [...this.#entities.entries()];
  }
}

export class FixedEntities implements Entities {
  #entities: Float64Array;
  #free: number[] = [];
  #length = 0;

  get length(): number {
    return this.#length;
  }

  get capacity() {
    return this.#entities.length;
  }

  constructor(capacity: number) {
    this.#entities = new Float64Array(capacity);

    for (let i = 0; i < capacity; i++) {
      this.#free.push(i);
    }
  }

  spawn(): number {
    const entity = this.#free.shift();
    if (entity === undefined) {
      throw new RangeError("Too many entities");
    }
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
    this.#entities[entity] = mask;
    return this.get(entity);
  }

  enable(entity: number, mask: number): number {
    this.#entities[entity] |= mask;
    return this.get(entity);
  }

  disable(entity: number, mask: number): number {
    this.#entities[entity] &= ~mask;
    return this.get(entity);
  }

  entries(): [number, number][] {
    return [...this.#entities.entries()].filter(([index]) =>
      !this.#free.includes(index)
    );
  }
}

export class GrowableEntities extends GrowableBuffer implements Entities {
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
