import {
  Component,
  ComponentConstructor,
  ComponentStore,
  GrowableArrayBuffer,
  Type,
} from "../deps.ts";

export interface TypeComponentConstructor<V>
  extends ComponentConstructor<TypeComponent<V>> {
  type: Type<V>;
}

export abstract class TypeComponent<V> extends Component<V> {
  static type: Type<unknown>;
}

export class TypeComponentStore<V> extends GrowableArrayBuffer
  implements ComponentStore<V> {
  readonly Component: TypeComponentConstructor<V>;

  #view = new DataView(this.buffer);
  #length = 0;

  get view() {
    return this.#view;
  }

  get length() {
    return this.#length;
  }

  get capacity() {
    return this.buffer.byteLength / this.Component.type.size;
  }

  set capacity(capacity: number) {
    if (capacity > this.capacity) {
      this.grow(this.Component.type.size * capacity);
    }
  }

  constructor(Component: TypeComponentConstructor<V>, capacity = 32) {
    super(Component.type.size * capacity);
    this.Component = Component;
  }

  push(value: V): number {
    const length = this.length;
    if (this.capacity <= length) {
      this.grow();
    }

    this.Component.type.write(
      this.view,
      this.Component.type.size * length,
      value,
    );
    this.#length += 1;

    return length;
  }

  get(index: number): V | undefined {
    if (index < this.capacity) {
      return this.Component.type.read(
        this.view,
        this.Component.type.size * index,
      );
    }
  }

  set(index: number, value: V) {
    const next = index + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.Component.type.write(
      this.view,
      this.Component.type.size * index,
      value,
    );
  }

  remove(index: number) {
    const start = this.Component.type.size * index;
    const end = start + this.Component.type.size;
    this.uint8array.fill(0, start, end);
  }

  grow(size?: number) {
    super.grow(size);
    this.#view = new DataView(this.buffer);
  }
}