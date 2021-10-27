import { ComponentStore } from "./component_store.ts";

export class MapComponentStore<V> implements ComponentStore<V> {
  #components: Map<number, V> = new Map();

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
