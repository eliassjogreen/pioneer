import { Component, ComponentConstructor, ComponentStore } from "../deps.ts";

export class MapComponentStore<V> implements ComponentStore<V> {
  #components: Map<number, V> = new Map();
  readonly Component: ComponentConstructor<Component<V>>;

  constructor(Component: ComponentConstructor<Component<V>>) {
    this.Component = Component;
  }

  get(entity: number): V | undefined {
    return this.#components.get(entity);
  }

  set(entity: number, component: V) {
    this.#components.set(entity, component);
  }

  remove(entity: number) {
    this.#components.delete(entity);
  }
}
