import { Component } from "./component.ts";
import { ComponentStore } from "./component_store.ts";

export class EmptyComponentStore<V extends Component<undefined>>
  implements ComponentStore<V> {
  get(_entity: number): undefined {
    return undefined;
  }

  set(_entity: number, _component: V) {}

  remove(_entity: number) {}
}
