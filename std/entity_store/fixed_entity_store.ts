import { Entity, EntityStore, Mask } from "../deps.ts";

export class FixedEntityStore implements EntityStore {
  #entities: Float64Array;
  #free: Entity[] = [];
  #length = 0;

  get length(): number {
    return this.#length;
  }

  get capacity(): number {
    return this.#entities.length;
  }

  constructor(capacity: number) {
    this.#entities = new Float64Array(capacity);

    for (let i = 0; i < capacity; i++) {
      this.#free.push(i);
    }
  }

  spawn(): Entity {
    const entity = this.#free.shift();
    if (entity === undefined) {
      throw new RangeError("Too many entities");
    }
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
    this.#entities[entity] = mask;
    return this.get(entity);
  }

  enable(entity: Entity, mask: Mask): Mask {
    this.#entities[entity] |= mask;
    return this.get(entity);
  }

  disable(entity: Entity, mask: Mask): Mask {
    this.#entities[entity] &= ~mask;
    return this.get(entity);
  }

  entries(): [Entity, Mask][] {
    return [...this.#entities.entries()].filter(([index]) =>
      !this.#free.includes(index)
    );
  }
}
