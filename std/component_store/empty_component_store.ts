import { Component, ComponentConstructor, ComponentStore } from "../deps.ts";

export class EmptyComponentStore implements ComponentStore<undefined> {
  readonly Component: ComponentConstructor<Component<undefined>>;

  constructor(Component: ComponentConstructor<Component<undefined>>) {
    this.Component = Component;
  }

  get(_entity: number): undefined {
    return undefined;
  }

  set(_entity: number, _component: undefined) {}

  remove(_entity: number) {}
}
