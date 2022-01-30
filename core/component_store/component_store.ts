import { Component, ComponentConstructor } from "../component.ts";
import { Entity } from "../entity.ts";

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
