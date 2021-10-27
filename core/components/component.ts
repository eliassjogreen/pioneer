export abstract class Component<V> {
  static index?: number;
  static mask?: number;

  abstract value: V;
}

export interface ComponentConstructor<T extends Component<unknown>> {
  index?: number;
  mask?: number;

  new (): T;
}
