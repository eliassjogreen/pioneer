import { Component, ComponentConstructor, ComponentStore, Entity } from "../deps.ts";

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
