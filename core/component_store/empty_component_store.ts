import { Component, ComponentConstructor } from "../component.ts";
import { Entity } from "../entity.ts";
import { ComponentStore } from "./component_store.ts";

export class EmptyComponentStore implements ComponentStore<undefined> {
  readonly Component: ComponentConstructor<Component<undefined>>;

  constructor(Component: ComponentConstructor<Component<undefined>>) {
    this.Component = Component;
  }

  get(_entity: Entity): undefined {
    return undefined;
  }

  set(_entity: Entity, _component: undefined) {}

  remove(_entity: Entity) {}
}
