import { Entity, EntityQueue, System } from "../../engine/mod.ts";
import { has } from "../../std/mod.ts";
import { EntityScript } from "../components/entity_script.ts";

export class EntityScriptSystem extends System {
  readonly queries = {
    scripted: has(EntityScript)
  };

  start(queries: EntityQueue): void {
    for (const entity of queries["scripted"]) {
      entity.components.get(EntityScript).start?.(entity);
    }
  }
  
  stop(queries: EntityQueue): void {
    for (const entity of queries["scripted"]) {
      entity.components.get(EntityScript).stop?.(entity);
    }
  }

  update(queries: EntityQueue, delta: number): void {
    for (const entity of queries["scripted"]) {
      entity.components.get(EntityScript).update?.(entity, delta);
    }
  }

  added(queries: EntityQueue): void {
    for (const entity of queries["scripted"]) {
      entity.components.get(EntityScript).added?.(entity);
    }
  }
  
  removed(queries: EntityQueue): void {
    for (const entity of queries["scripted"]) {
      entity.components.get(EntityScript).removed?.(entity);
    }
  }

  enter(entity: Entity): void {
    entity.components.get(EntityScript).enter?.(entity);
  }
  
  exit(entity: Entity): void {
    entity.components.get(EntityScript).exit?.(entity);
  }
}
