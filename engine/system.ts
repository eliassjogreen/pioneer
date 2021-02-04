import { Query } from "./query.ts";
import { EntityQueue } from "./entity_queue.ts";
import { Entity } from "./entity.ts";

/** The class all Systems extend  */
export abstract class System {
  /** This Systems identifying name */
  get name(): string {
    return this.constructor.name;
  }

  /** All of the Entities this system will be querying */
  abstract queries: Record<string, Query>;

  /** A method that is called once the Scene is started */
  start?(entities: EntityQueue): void;
  /** A method that is called once the Scene is stopped */
  stop?(entities: EntityQueue): void;

  /** A method that is called once every time the Scene updates */
  update?(entities: EntityQueue, delta: number): void;

  /** A method that is called once the system is added to a Scene*/
  added?(entities: EntityQueue): void;
  /** A method that is called once the system is removed from a Scene*/
  removed?(entities: EntityQueue): void;

  /** A method that is called once a new entity that matches a query is added */
  enter?(entity: Entity): void;
  /** A method that is called once a new entity that matches a query is removed */
  exit?(entitiy: Entity): void;
}
