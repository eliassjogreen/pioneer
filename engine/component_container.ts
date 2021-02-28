import { Component, ComponentConstructor } from "./component.ts";

/** A container for Components */
export class ComponentContainer {
  #components = new Map();

  /** Returns the number of components contained in this class */
  get length(): number {
    return this.#components.size;
  }

  /** Checks if this contains the specified component */
  has<T extends Component>(
    componentOrName: ComponentConstructor<T> | string,
  ): boolean;
  has<T extends Component>(
    componentOrName: ComponentConstructor<T> | string,
  ): boolean {
    const name = typeof componentOrName === "string"
      ? componentOrName
      : componentOrName.name;

    return this.#components.has(name);
  }

  /** Returns a Component of the same name as the specified ComponentConstructor */
  get<T extends Component>(
    componentOrName: ComponentConstructor<T> | string,
  ): T {
    const name = typeof componentOrName === "string"
      ? componentOrName
      : componentOrName.name;

    return this.#components.get(name);
  }

  /** Adds the Component */
  add(component: Component): void {
    if (!this.has(component.name)) {
      this.#components.set(component.name, component);
    }
  }

  /** Removes a Component of the same type as the specified ComponentConstructor */
  remove<T extends Component>(
    componentOrName: ComponentConstructor<T> | string,
  ): boolean {
    const name = typeof componentOrName === "string"
      ? componentOrName
      : componentOrName.name;

    return this.#components.delete(name);
  }
}
