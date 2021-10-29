import { Entity, EntityStore, Mask } from "../deps.ts";

export class DynamicEntityStore implements EntityStore {
  #free: Entity[] = [];
  #entities: Mask[] = [];
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
