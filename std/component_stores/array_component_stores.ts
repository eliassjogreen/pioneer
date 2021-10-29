import {
  Component,
  ComponentConstructor,
  ComponentStore,
  ComponentStoreConstructor,
  ComponentStores,
  Entity,
  Mask,
} from "../deps.ts";

export class ArrayComponentStores implements ComponentStores {
  #stores: ComponentStore<unknown>[] = [];

  get length(): number {
    return this.#stores.length;
  }

  register<V, A extends []>(
    Component: ComponentConstructor<Component<V>>,
    Store: ComponentStoreConstructor<V, A>,
    ...args: A
  ): void {
    if (this.length >= 62) {
      throw new RangeError("Component limit reached");
    }

    Component.index = this.#stores.push(new Store(Component, ...args)) - 1;
    Component.mask = 1 << Component.index;
  }

  get<V>(
    entity: Entity,
    Component: ComponentConstructor<Component<V>>,
  ): V | undefined {
    return (this.#stores[Component.index!] as ComponentStore<V>)?.get(entity);
  }

  set<V>(
    entity: Entity,
    Component: ComponentConstructor<Component<V>>,
    value: V,
  ): void {
    (this.#stores[Component.index!] as ComponentStore<V>)?.set(entity, value);
  }

  remove<T extends Component<unknown>>(
    entity: Entity,
    Component: ComponentConstructor<T>,
  ): void {
    this.#stores[Component.index!]?.remove(entity);
  }

  clear(entity: Entity): void {
    for (const store of this.#stores) {
      store.remove(entity);
    }
  }

  query(mask: Mask): ComponentStore<unknown>[] {
    const stores = [];
    for (let index = 0; mask !== 0; mask >>>= 1, index++) {
      if ((mask & 1) === 1) {
        stores.push(this.#stores[index]);
      }
    }
    return stores;
  }
}
