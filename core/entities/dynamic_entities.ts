import { Entities } from "./entities.ts";

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
