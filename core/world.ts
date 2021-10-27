import { Component, ComponentConstructor } from "./components/component.ts";
import { Components } from "./components/components.ts";
import { ComponentStoreConstructor } from "./components/component_store.ts";
import { Entities } from "./entities/entities.ts";
import { GrowableEntities } from "./entities/growable_entities.ts";
import { Queries } from "./queries.ts";

export class World {
  #entities: Entities;
  #components: Components = new Components();
  #queries: Queries = new Queries();

  constructor(entities: Entities = new GrowableEntities()) {
    this.#entities = entities;
  }

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
    register: <
      V,
      T extends Component<V>,
      C extends ComponentConstructor<T>,
      S extends ComponentStoreConstructor<T, C, V, A>,
      // deno-lint-ignore no-explicit-any
      A extends any[],
    >(
      Component: C,
      Store: S,
      ...args: A
    ) => {
      this.#components.register(Component, Store, ...args);
    },
    set: <V>(
      entity: number,
      Component: ComponentConstructor<Component<V>>,
      value: V,
    ) => {
      this.#components.set(entity, Component, value);
      this.#queries.update(
        entity,
        this.#entities.enable(
          entity,
          Component.mask!,
        ),
      );
    },
    get: <V>(
      entity: number,
      Component: ComponentConstructor<Component<V>>,
    ) => {
      if (this.components.has(entity, Component)) {
        return this.#components.get<V>(entity, Component);
      }
    },
    has: <T extends Component<unknown>>(
      entity: number,
      Component: ComponentConstructor<T>,
    ) => {
      return (this.#entities.get(entity) & Component.mask!) === Component.mask!;
    },
    remove: <T extends Component<unknown>>(
      entity: number,
      Component: ComponentConstructor<T>,
    ) => {
      this.#components.remove(entity, Component);
      this.#queries.update(
        entity,
        this.#entities.disable(entity, Component.mask!),
      );
    },
  };

  queries = {
    register: (
      query: number | ComponentConstructor<Component<unknown>>[],
    ) => {
      if (typeof query !== "number") {
        let mask = 0;
        for (const Component of query) {
          mask |= Component.mask!;
        }
        query = mask;
      }

      const entities = this.#queries.register(query);

      for (const [entity, mask] of this.#entities.entries()) {
        this.#queries.update(entity, mask, query);
      }

      return entities;
    },
    unregister: (
      query: number | ComponentConstructor<Component<unknown>>[],
    ) => {
      if (typeof query !== "number") {
        let mask = 0;
        for (const Component of query) {
          mask |= Component.mask!;
        }
        query = mask;
      }

      this.#queries.unregister(query);
    },
  };
}
