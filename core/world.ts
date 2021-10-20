import { Components } from "./components.ts";
import { Type } from "./deps.ts";
import { Entities, GrowableEntities } from "./entities.ts";
import { Queries } from "./queries.ts";

export class World {
  #entities: Entities = new GrowableEntities();
  #components: Components = new Components();
  #queries: Queries = new Queries();

  // spawn(components: [number, unknown][]): number {
  //   const entity = this.entities.spawn();
  //   let mask = 0;
  //   for (const [component, value] of components) {
  //     mask |= 1 << component;
  //     this.components.stores[component].set(entity, value);
  //   }
  //   this.entities.set(entity, mask);
  //   return entity;
  // }

  entities = {
    spawn: () => {
      return this.#entities.spawn();
    },
    kill: (entity: number) => {
      this.#entities.kill(entity);
      this.#queries.killed(entity);
      this.#components.clear(entity);
    },
    get: (entity: number) => {
      return this.#entities.get(entity);
    },
    entries: () => {
      return this.#entities.entries();
    },
  };

  components = {
    register: (type: Type<unknown>) => {
      return this.#components.register(type, this.#entities.length);
    },
    set: (entity: number, component: number, value: unknown) => {
      this.#components.set(entity, component, value);
      this.#queries.update(
        entity,
        this.#entities.enable(entity, 1 << component),
      );
    },
    get: (entity: number, component: number) => {
      const mask = 1 << component;
      if ((this.#entities.get(entity) & mask) === mask) {
        return this.#components.get(entity, component);
      }
    },
    // mutable: (entity: number, component: number) => {
    //   const mask = 1 << component;
    //   if ((this.#entities.get(entity) & mask) === mask) {
    //     return this.#components.mutable(entity, component);
    //   }
    // },
    mutate: <T extends unknown[]>(
      entity: number,
      components: number[],
      mutator: (components: T) => void,
    ) => {
      this.#components.mutate(entity, components, mutator);
    },
    remove: (entity: number, component: number) => {
      this.#components.remove(entity, component);
      this.#queries.update(
        entity,
        this.#entities.disable(entity, 1 << component),
      );
    },
  };

  queries = {
    register: (query: number) => {
      const entities = this.#queries.register(query);

      for (const [entity, mask] of this.#entities.entries()) {
        this.#queries.update(entity, mask, query);
      }

      return entities;
    },
    unregister: (query: number) => {
      this.#queries.unregister(query);
    },
  };
}
