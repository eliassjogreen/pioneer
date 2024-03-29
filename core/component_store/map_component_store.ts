import { Component, ComponentConstructor } from "../component.ts";
import { Entity } from "../entity.ts";
import { ComponentStore } from "./component_store.ts";

export class MapComponentStore<V> implements ComponentStore<V> {
  #components: Map<number, V> = new Map();
  readonly Component: ComponentConstructor<Component<V>>;

  constructor(Component: ComponentConstructor<Component<V>>) {
    this.Component = Component;
  }

  get(entity: Entity): V | undefined {
    return this.#components.get(entity);
  }

  set(entity: Entity, component: V) {
    this.#components.set(entity, component);
  }

  remove(entity: Entity) {
    this.#components.delete(entity);
  }
}
