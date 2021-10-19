import { Type } from "../deps.ts";

export class ReferenceType<T> implements Type<T> {
  readonly size = 1;
  readonly store: T[];

  constructor() {
    this.store = [];
  }

  read(_view: DataView, offset: number): T {
    return this.store[offset];
  }

  write(_view: DataView, offset: number, value: T): void {
    this.store[offset] = value;
  }

  push(value: T): number {
    return this.store.push(value) - 1;
  }
}

export const reference = new ReferenceType();
