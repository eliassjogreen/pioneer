import { Mask } from "./entity.ts";

export abstract class Component<V> {
  static index?: number;
  static mask?: Mask;

  abstract value: V;
}

export interface ComponentConstructor<T extends Component<unknown>> {
  index?: number;
  mask?: Mask;

  new (): T;
}
