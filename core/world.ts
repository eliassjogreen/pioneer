import { DefaultEntityStore, Entity, EntityStore, Mask } from "./entity.ts";
import {
  Component,
  ComponentConstructor,
  ComponentStoreConstructor,
  ComponentStores,
  DefaultComponentStores,
} from "./component.ts";
import { DefaultQueryStore, maskOf, QueryResult, QueryStore } from "./query.ts";

export class World {
  #entities: EntityStore;
  #components: ComponentStores;
  #queries: QueryStore;

  constructor(
    entities: EntityStore = new DefaultEntityStore(),
    components: ComponentStores = new DefaultComponentStores(),
    queries: QueryStore = new DefaultQueryStore(),
  ) {
    this.#entities = entities;
    this.#components = components;
    this.#queries = queries;
  }

  readonly entities = Object.freeze(Object.defineProperties(
    {
      length: 0,

      spawn: (): Entity => {
        return this.#entities.spawn();
      },

      kill: (entity: Entity): void => {
        this.#entities.kill(entity);
        this.#queries.removed(entity);
        this.components.clear(entity);
      },

      get: (entity: Entity): number => {
        return this.#entities.get(entity);
      },

      entries: (): [Entity, Mask][] => {
        return this.#entities.entries();
      },
    },
    {
      length: {
        get: (): number => {
          return this.#entities.length;
        },
      },
    },
  ));

  readonly components = Object.freeze(Object.defineProperties(
    {
      length: 0,

      register: <
        V,
        C extends ComponentConstructor<Component<V>>,
        A extends [],
      >(
        Component: C,
        Store: ComponentStoreConstructor<V, C, A>,
        ...args: A
      ): void => {
        this.#components.register(Component, Store, ...args);
      },

      has: <V>(
        entity: Entity,
        Component: ComponentConstructor<Component<V>>,
      ): boolean => {
        return (this.entities.get(entity) & Component.mask!) ===
          Component.mask!;
      },

      get: <V>(
        entity: Entity,
        Component: ComponentConstructor<Component<V>>,
      ): V | undefined => {
        if (this.components.has(entity, Component)) {
          return this.#components.get<V>(entity, Component);
        }
      },

      set: <V>(
        entity: Entity,
        Component: ComponentConstructor<Component<V>>,
        value: V,
      ): void => {
        this.#components.set(entity, Component, value);
        this.#queries.refresh(
          entity,
          this.#entities.enable(entity, Component.mask!),
        );
      },

      remove: <T extends Component<unknown>>(
        entity: Entity,
        Component: ComponentConstructor<T>,
      ): void => {
        this.#components.remove(entity, Component);
        this.#queries.refresh(
          entity,
          this.#entities.disable(entity, Component.mask!),
        );
      },

      clear: (entity: Entity): void => {
        this.#components.clear(entity);
        this.#queries.refresh(entity, 0);
      },
    },
    {
      length: {
        get: (): number => {
          return this.#components.length;
        },
      },
    },
  ));

  readonly queries = Object.freeze(Object.defineProperties(
    {
      length: 0,

      register: (
        query: Mask | ComponentConstructor<Component<unknown>>[],
      ): QueryResult => {
        query = typeof query === "number" ? query : maskOf(query);

        const entities = this.#queries.register(query);

        for (const [entity, mask] of this.#entities.entries()) {
          this.#queries.update(entity, mask, query);
        }

        return entities;
      },

      unregister: (
        query: Mask | ComponentConstructor<Component<unknown>>[],
      ): void => {
        query = typeof query === "number" ? query : maskOf(query);

        this.#queries.unregister(query);
      },

      get: (
        query: Mask | ComponentConstructor<Component<unknown>>[],
      ): QueryResult => {
        query = typeof query === "number" ? query : maskOf(query);

        return this.#queries.get(query);
      },
    },
    {
      length: {
        get: (): number => {
          return this.#queries.length;
        },
      },
    },
  ));
}
