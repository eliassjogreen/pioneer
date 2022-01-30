import { Component, ComponentConstructor } from "../component.ts";
import { Entity } from "../entity.ts";
import { ComponentStore } from "./component_store.ts";

export class ArrayComponentStore<V> implements ComponentStore<V> {
  #components: V[] = [];
  readonly Component: ComponentConstructor<Component<V>>;

  constructor(Component: ComponentConstructor<Component<V>>) {
    this.Component = Component;
  }

  get(entity: Entity): V | undefined {
    return this.#components[entity];
  }

  set(entity: Entity, component: V) {
    return this.#components[entity] = component;
  }

  remove(entity: Entity) {
    delete this.#components[entity];
  }
}
