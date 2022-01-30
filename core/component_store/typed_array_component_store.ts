import { Component, ComponentConstructor } from "../component.ts";
import { Entity } from "../entity.ts";
import { GrowableArrayBuffer } from "../growable_array_buffer.ts";
import { ComponentStore } from "./component_store.ts";

export type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | BigInt64ArrayConstructor
  | BigUint64ArrayConstructor;

export interface TypedArrayComponentConstructor<
  V,
  T extends TypedArrayConstructor,
> extends ComponentConstructor<TypedArrayComponent<V>> {
  readonly elements: number;
  readonly byteLength: number;
  readonly TypedArray: T;
  write(buffer: T["prototype"], value: V): void;
  read(buffer: T["prototype"]): V;
}

export abstract class TypedArrayComponent<V> extends Component<V> {
  static elements: number;
  static TypedArray: TypedArrayConstructor = Uint8Array;
  static get byteLength(): number {
    return this.elements * this.TypedArray.BYTES_PER_ELEMENT;
  }
}

export class TypedArrayComponentStore<V, T extends TypedArrayConstructor>
  extends GrowableArrayBuffer
  implements ComponentStore<V> {
  readonly Component: TypedArrayComponentConstructor<V, T>;

  #view = new DataView(this.buffer);
  #length = 0;

  get view() {
    return this.#view;
  }

  get length() {
    return this.#length;
  }

  get capacity() {
    return this.buffer.byteLength / this.Component.byteLength;
  }

  set capacity(capacity: number) {
    if (capacity > this.capacity) {
      this.grow(this.Component.byteLength * capacity);
    }
  }

  constructor(Component: TypedArrayComponentConstructor<V, T>, capacity = 32) {
    super(Component.byteLength * capacity);
    this.Component = Component;
  }

  push(value: V): number {
    const length = this.length;
    if (this.capacity <= length) {
      this.grow();
    }

    this.Component.write(
      new this.Component.TypedArray(
        this.buffer,
        this.Component.byteLength * length,
        this.Component.elements,
      ),
      value,
    );
    this.#length += 1;

    return length;
  }

  get(entity: Entity): V | undefined {
    if (entity < this.capacity) {
      return this.Component.read(
        new this.Component.TypedArray(
          this.buffer,
          this.Component.byteLength * entity,
          this.Component.elements,
        ),
      );
    }
  }

  set(entity: Entity, value: V) {
    const next = entity + 1;
    if (this.capacity < next) {
      this.capacity = next;
      this.#length = next;
    }

    this.Component.write(
      new this.Component.TypedArray(
        this.buffer,
        this.Component.byteLength * entity,
        this.Component.elements,
      ),
      value,
    );
  }

  remove(entity: Entity) {
    const start = this.Component.byteLength * entity;
    const end = this.Component.byteLength + start;
    this.uint8array.fill(0, start, end);
  }

  grow(size?: number) {
    super.grow(size);
    this.#view = new DataView(this.buffer);
  }
}
