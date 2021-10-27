import { Type } from "../deps.ts";
import { GrowableArrayBuffer } from "../growable_array_buffer.ts";
import { Component, ComponentConstructor } from "./component.ts";
import { ComponentStore } from "./component_store.ts";

export interface TypeComponentConstructor<V>
  extends ComponentConstructor<TypeComponent<V>> {
  type: Type<V>;
}

export abstract class TypeComponent<V> extends Component<V> {
  static type: Type<unknown>;
}

export class TypeComponentStore<V> extends GrowableArrayBuffer
  implements ComponentStore<V> {
  readonly type: Type<V>;

  #view = new DataView(this.buffer);
  #length = 0;

  get view() {
    return this.#view;
  }

  get length() {
    return this.#length;
  }

  get capacity() {
    return this.buffer.byteLength / this.type.size;
  }

  set capacity(capacity: number) {
    if (capacity > this.capacity) {
      this.grow(this.type.size * capacity);
    }
  }

  constructor(Component: TypeComponentConstructor<V>, capacity = 32) {
    super(Component.type.size * capacity);
    this.type = Component.type;
  }

  push(value: V): number {
    const length = this.length;
    if (this.capacity <= length) {
      this.grow();
    }

    this.type.write(this.view, this.type.size * length, value);
    this.#length += 1;

    return length;
  }

  get(index: number): V | undefined {
    if (index < this.capacity) {
      return this.type.read(this.view, this.type.size * index);
    }
  }

  set(index: number, value: V) {
    const next = index + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.type.write(this.view, this.type.size * index, value);
  }

  remove(index: number) {
    const start = this.type.size * index;
    const end = start + this.type.size;
    this.uint8array.fill(0, start, end);
  }

  grow(size?: number) {
    super.grow(size);
    this.#view = new DataView(this.buffer);
  }
}
