import { Entity, Mask } from "./entity.ts";

export abstract class Component<V> {
  static index?: number;
  static mask?: Mask;

  abstract value: V;
}

export interface ComponentConstructor<T extends Component<unknown>> {
  index?: number;
  mask?: Mask;

  new (): T;
}

export interface ComponentStoreConstructor<
  V,
  C extends ComponentConstructor<Component<V>>,
  A extends [],
> {
  new (
    Component: C,
    ...args: A
  ): ComponentStore<V>;
}

export interface ComponentStore<V> {
  readonly Component: ComponentConstructor<Component<V>>;

  get(entity: Entity): V | undefined;
  set(entity: Entity, value: V): void;
  remove(entity: Entity): void;
}

export interface ComponentStores {
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

  get<V>(
    entity: Entity,
    Component: ComponentConstructor<Component<V>>,
  ): V | undefined;

  set<V>(
    entity: Entity,
    Component: ComponentConstructor<Component<V>>,
    value: V,
  ): void;

  remove<T extends Component<unknown>>(
    entity: Entity,
    Component: ComponentConstructor<T>,
  ): void;

  clear(entity: Entity): void;

  query(mask: Mask): ComponentStore<unknown>[];
}
