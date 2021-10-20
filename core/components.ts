import { Type } from "./deps.ts";
import { TypeStore } from "./type_store.ts";

export class Components {
  #stores: TypeStore<unknown>[] = [];

  register(type: Type<unknown>, capacity?: number): number {
    if (this.#stores.length >= 62) {
      throw new RangeError("Component limit reached");
    }

    if (capacity !== undefined) {
      this.resize(capacity);
    }

    const index = this.#stores.push(new TypeStore(type, capacity)) - 1;
    return index;
  }

  query(mask: number): TypeStore<unknown>[] {
    const stores: TypeStore<unknown>[] = [];
    for (let i = 0; mask; i++, mask >>= 1) {
      if ((mask & 1) === 1) {
        stores.push(this.#stores[i]);
      }
    }
    return stores;
  }

  set(entity: number, component: number, value: unknown) {
    this.#stores[component]?.set(entity, value);
  }

  get(entity: number, component: number): unknown {
    return this.#stores[component]?.get(entity);
  }

  // mutable(entity: number, component: number): unknown {
  //   const original = this.get(entity, component) as Record<string, unknown>;
  //   const mutable = {};
  //   if (typeof original === "object") {
  //     for (const property in original) {
  //       if (Object.hasOwn(original, property)) {
  //         Object.defineProperty(mutable, property, {
  //           get: () => {
  //             return original[property];
  //           },
  //           set: (value: unknown) => {
  //             original[property] = value;
  //             this.set(entity, component, original);
  //           },
  //         });
  //       }
  //     }
  //   }
  //   return mutable;
  // }

  mutate<T extends unknown[]>(
    entity: number,
    components: number[],
    mutator: (components: T) => void,
  ) {
    const values = components.map((component) =>
      this.get(entity, component)
    ) as T;
    mutator(values);

    for (let i = 0; i < components.length; i++) {
      this.set(entity, components[i], values[i]);
    }
  }

  remove(entity: number, component: number) {
    this.#stores[component]?.clear(entity);
  }

  clear(entity: number) {
    for (const store of this.#stores) {
      store.clear(entity);
    }
  }

  resize(capacity: number) {
    for (const store of this.#stores) {
      store.capacity = capacity;
    }
  }
}
