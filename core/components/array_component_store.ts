import { ComponentStore } from "./component_store.ts";

export class ArrayComponentStore<V> implements ComponentStore<V> {
  #components: V[] = [];

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
