import { Entity, Mask } from "./entity.ts";

export interface EntityStore {
  readonly length: number;

  spawn(): Entity;
  kill(entity: Entity): void;
  get(entity: Entity): Mask;
  set(entity: Entity, mask: Mask): Mask;
  enable(entity: Entity, mask: Mask): Mask;
  disable(entity: Entity, mask: Mask): Mask;
  entries(): [Entity, Mask][];
}

export class DefaultEntityStore implements EntityStore {
  #entities: Mask[] = [];
  #free: Entity[] = [];
  #length = 0;

  get length(): number {
    return this.#length;
  }

  spawn(): Entity {
    const entity = this.#free.shift() ?? this.#entities.length;
    if (entity === this.#entities.length) {
      this.#entities.push(0);
    }
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
    return [...this.#entities.entries()];
  }
}
