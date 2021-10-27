import { Entities } from "./entities.ts";

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
