import { Entity, EntityStore, GrowableArrayBuffer, Mask } from "../deps.ts";

export class GrowableEntityStore extends GrowableArrayBuffer
  implements EntityStore {
  #entities: Float64Array = new Float64Array(this.buffer);
  #free: number[] = [];
  #length = 0;

  get length(): number {
    return this.#length;
  }

  get capacity(): number {
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

  spawn(): Entity {
    if (this.#free.length === 0) {
      this.capacity *= 2;
    }
    const entity = this.#free.shift()!;

    this.#entities[entity] = 0;
    this.#length += 1;

    return entity;
  }

  kill(entity: Entity): void {
    this.#entities[entity] = 0;
    this.#free.push(entity);
    this.#length -= 1;
  }

  get(entity: Entity): Mask {
    return this.#entities[entity];
  }

  set(entity: Entity, mask: Mask): Mask {
    const next = entity + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.#entities[entity] = mask;
    return this.get(entity);
  }

  enable(entity: Entity, mask: Mask): Mask {
    const next = entity + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.#entities[entity] |= mask;
    return this.get(entity);
  }

  disable(entity: Entity, mask: Mask): Mask {
    const next = entity + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.#entities[entity] &= ~mask;
    return this.get(entity);
  }

  entries(): [Entity, Mask][] {
    return [...this.#entities.entries()].filter(([index]) =>
      !this.#free.includes(index)
    );
  }

  grow(size?: number): void {
    super.grow(size);
    this.#entities = new Float64Array(this.buffer);
  }
}
