/** An abstract class all Components extend */
export abstract class Component {
  /** This Components identifying name */
  get name(): string {
    return this.constructor.name;
  }
}

/** The constructor for all Components */
export interface ComponentConstructor<T extends Component> {
  // deno-lint-ignore no-explicit-any
  new (...args: any[]): T;
}
