import { EntityContainer } from "./entity_container.ts";
import { SystemContainer } from "./system_container.ts";

export class Scene {
  /** A scene identifier name */
  public readonly name: string;

  /** All of this Scenes entities */
  entities: EntityContainer;
  /** All of this Scenes systems */
  systems: SystemContainer;

  constructor(name: string) {
    this.name = name;
    this.entities = new EntityContainer(this);
    this.systems = new SystemContainer(this);
  }

  /** A method for starting all of this Scenes systems on all of this Scenes Entities */
  start(): void {
    for (const system of this.systems.all()) {
      this.systems.start(system);
    }
  }

  /** A method for stopping all of this Scenes systems on all of this Scenes Entities */
  stop(): void {
    for (const system of this.systems.all()) {
      this.systems.stop(system);
    }
  }

  /** A method for updating all of this Scenes systems on all of this Scenes Entities */
  update(delta: number): void {
    for (const system of this.systems.all()) {
      this.systems.update(system, delta);
    }
  }
}
