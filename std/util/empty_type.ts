import { Type } from "../../core/deps.ts";

export class EmptyType implements Type<null> {
  size = 0;

  read(_view: DataView, _offset: number): null {
    return null;
  }

  write(_view: DataView, _offset: number, _value: null): void {}
}

export const empty = new EmptyType();
