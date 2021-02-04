import { ComponentContainer } from "./component_container.ts";

/** The Entity class containing Components and a name */
export class Entity {
  /** This Entities name (basically an identifier) */
  name: string;
  /** The Components this Entity contains */
  components: ComponentContainer;

  constructor(name: string) {
    this.name = name;
    this.components = new ComponentContainer();
  }
}
