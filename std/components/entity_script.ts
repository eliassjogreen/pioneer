import { Component, Entity } from "../../engine/mod.ts";

export class EntityScript extends Component {
  /** A method that is called once the Scene is started */
  start?(self: Entity): void;
  /** A method that is called once the Scene is stopped */
  stop?(self: Entity): void;

  /** A method that is called once every time the Scene updates */
  update?(self: Entity, delta: number): void;

  /** A method that is called once the system is added to a Scene*/
  added?(self: Entity): void;
  /** A method that is called once the system is removed from a Scene*/
  removed?(self: Entity): void;

  /** A method that is called once a new entity that matches a query is added */
  enter?(self: Entity): void;
  /** A method that is called once a new entity that matches a query is removed */
  exit?(self: Entity): void;
}
