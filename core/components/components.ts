import { Component, ComponentConstructor } from "./component.ts";
import {
  ComponentStore,
  ComponentStoreConstructor,
} from "./component_store.ts";

export class Components {
  #stores: ComponentStore<unknown>[] = [];

  register<
    V,
    T extends Component<V>,
    C extends ComponentConstructor<T>,
    S extends ComponentStoreConstructor<T, C, V, A>,
    // deno-lint-ignore no-explicit-any
    A extends any[],
  >(
    Component: C,
    Store: S,
    ...args: A
  ) {
    if (this.#stores.length >= 62) {
      throw new RangeError("Component limit reached");
    }

    Component.index = this.#stores.push(new Store(Component, ...args)) - 1;
    Component.mask = 1 << Component.index;
  }

  // query(mask: number): ComponentStore<unknown>[] {
  //   const stores: ComponentStore<unknown>[] = [];
  //   for (let i = 0; mask; i++, mask >>= 1) {
  //     if ((mask & 1) === 1) {
  //       stores.push(this.#stores[i]);
  //     }
  //   }
  //   return stores;
  // }

  get<V>(
    entity: number,
    Component: ComponentConstructor<Component<V>>,
  ): V | undefined {
    return (this.#stores[Component.index!] as ComponentStore<V>)?.get(entity);
  }

  set<V>(
    entity: number,
    Component: ComponentConstructor<Component<V>>,
    value: V,
  ) {
    (this.#stores[Component.index!] as ComponentStore<V>)?.set(entity, value);
  }

  remove<T extends Component<unknown>>(
    entity: number,
    Component: ComponentConstructor<T>,
  ) {
    this.#stores[Component.index!]?.remove(entity);
  }

  clear(entity: number) {
    for (const store of this.#stores) {
      store.remove(entity);
    }
  }
}
