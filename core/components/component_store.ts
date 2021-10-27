import { Component, ComponentConstructor } from "./component.ts";

export interface ComponentStoreConstructor<
  T extends Component<V>,
  C extends ComponentConstructor<T>,
  V,
  // deno-lint-ignore no-explicit-any
  A extends any[],
> {
  new (
    Component: C,
    ...args: A
  ): ComponentStore<V>;
}

export interface ComponentStore<V> {
  get(entity: number): V | undefined;
  set(entity: number, value: V): void;
  remove(entity: number): void;
}
