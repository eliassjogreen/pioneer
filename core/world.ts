import { Entity, EntityStore, Mask } from "./entity.ts";
import {
  Component,
  ComponentConstructor,
  ComponentStoreConstructor,
  ComponentStores,
} from "./component.ts";
import { maskOf, QueryResult, QueryStore } from "./query.ts";

export class World {
  #entities: EntityStore;
  #components: ComponentStores;
  #queries: QueryStore;

  constructor(
    entities: EntityStore,
    components: ComponentStores,
    queries: QueryStore,
  ) {
    this.#entities = entities;
    this.#components = components;
    this.#queries = queries;
  }

  readonly entities: {
    readonly length: number;

    spawn: () => Entity;
    kill: (entity: Entity) => void;
    get: (entity: Entity) => number;
    entries: () => [Entity, Mask][];
  } = Object.freeze(Object.defineProperties(
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

  readonly components: {
    readonly length: number;

    register<
      V,
      C extends ComponentConstructor<Component<V>>,
      A extends [],
    >(
      Component: C,
      Store: ComponentStoreConstructor<V, C, A>,
      ...args: A
    ): void;

    has<V>(
      entity: number,
      Component: ComponentConstructor<Component<V>>,
    ): boolean;

    get<V>(
      entity: number,
      Component: ComponentConstructor<Component<V>>,
    ): V | undefined;

    set<V>(
      entity: number,
      Component: ComponentConstructor<Component<V>>,
      value: V,
    ): void;

    remove<T extends Component<unknown>>(
      entity: number,
      Component: ComponentConstructor<T>,
    ): void;

    clear(entity: number): void;
  } = Object.freeze(Object.defineProperties(
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
        entity: number,
        Component: ComponentConstructor<Component<V>>,
      ): boolean => {
        return (this.entities.get(entity) & Component.mask!) ===
          Component.mask!;
      },

      get: <V>(
        entity: number,
        Component: ComponentConstructor<Component<V>>,
      ): V | undefined => {
        if (this.components.has(entity, Component)) {
          return this.#components.get<V>(entity, Component);
        }
      },

      set: <V>(
        entity: number,
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
        entity: number,
        Component: ComponentConstructor<T>,
      ): void => {
        this.#components.remove(entity, Component);
        this.#queries.refresh(
          entity,
          this.#entities.disable(entity, Component.mask!),
        );
      },

      clear: (entity: number): void => {
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

  readonly queries: {
    register(
      query: Mask | ComponentConstructor<Component<unknown>>[],
    ): QueryResult;
    unregister(query: Mask | ComponentConstructor<Component<unknown>>[]): void;
    get(query: Mask | ComponentConstructor<Component<unknown>>[]): QueryResult;
  } = Object.freeze(Object.defineProperties(
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
