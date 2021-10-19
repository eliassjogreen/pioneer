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
    mutable: (entity: number, component: number) => {
      const mask = 1 << component;
      if ((this.#entities.get(entity) & mask) === mask) {
        return this.#components.mutable(entity, component);
      }
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

// const w = new World();
// const a = w.components.register(u8);
// const b = w.components.register(u16);
// const c = w.components.register(u32);
// const e1 = w.entities.spawn();
// w.components.set(e1, a, 0);
// w.components.set(e1, b, 0xffff);
// w.components.set(e1, c, 0xffffffff);
// const e2 = w.entities.spawn();
// w.components.set(e2, a, 0);
// w.components.set(e2, b, 0xffff);
// const e3 = w.entities.spawn();
// w.components.set(e3, a, 0);
// // const q: Query = { mask: (1 << a) | (1 << b) | (1 << c), entities: new Set() };
// const q1 = w.queries.register((1 << a) | (1 << b) | (1 << c));
// const q2 = w.queries.register((1 << a) | (1 << b));
// const q3 = w.queries.register((1 << a));
// // for (const store of w.components.query(0b111)) {
// //   console.log(store?.get(e));
// // }
