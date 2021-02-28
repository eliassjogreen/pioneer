import { Entity } from "./entity.ts";
import { Query } from "./query.ts";
import { Scene } from "./scene.ts";

/** A container for entities */
export class EntityContainer {
  #scene: Scene;
  #entities: Map<string, Entity>;

  /** Returns the number of entities contained in this class */
  get length(): number {
    return this.#entities.size;
  }

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#entities = new Map();
  }

  /** Checks if this contains an Entity with the specified name */
  has(entityOrName: string | Entity): boolean {
    const name = typeof entityOrName === "string"
      ? entityOrName
      : entityOrName.name;

    return this.#entities.has(name);
  }

  /** Returns the specified Entity from this container */
  get(entityOrName: string | Entity): Entity | undefined {
    const name = typeof entityOrName === "string"
      ? entityOrName
      : entityOrName.name;

    return this.#entities.get(name);
  }

  /** Returns all Entities that matches the specified query */
  query(query: Query): Entity[] {
    const entities = [];

    for (const [, entity] of this.#entities) {
      if (query(entity)) {
        entities.push(entity);
      }
    }

    return entities;
  }

  /** Adds an entity to this container */
  add(entity: Entity): void {
    if (!this.has(entity)) {
      this.#entities.set(entity.name, entity);

      for (const system of this.#scene.systems.all()) {
        const matches = this.#scene.systems.queryQueue(system);

        for (const query in matches) {
          const entities = matches[query];

          if (entities.some((value) => value.name === entity.name)) {
            system.enter?.(entity);
          }
        }
      }
    }
  }

  /** Removes an entity from this container */
  remove(entityOrName: string | Entity): boolean {
    const name = typeof entityOrName === "string"
      ? entityOrName
      : entityOrName.name;
    const entity = typeof entityOrName === "string"
      ? this.get(entityOrName)
      : entityOrName;

    if (entity) {
      for (const system of this.#scene.systems.all()) {
        const matches = this.#scene.systems.queryQueue(system);

        for (const query in matches) {
          const entities = matches[query];

          if (entities.some((value) => value.name === name)) {
            system.exit?.(entity);
          }
        }
      }
    }

    return this.#entities.delete(name);
  }
}
