import { Component, ComponentConstructor, ComponentStore } from "../deps.ts";

export class ArrayComponentStore<V> implements ComponentStore<V> {
  #components: V[] = [];
  readonly Component: ComponentConstructor<Component<V>>;

  constructor(Component: ComponentConstructor<Component<V>>) {
    this.Component = Component;
  }

  get(entity: number): V | undefined {
    return this.#components[entity];
  }

  set(entity: number, component: V) {
    return this.#components[entity] = component;
  }

  remove(entity: number) {
    delete this.#components[entity];
  }
}
