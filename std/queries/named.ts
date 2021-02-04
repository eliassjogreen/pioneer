import { Entity, Query } from "../../engine/mod.ts";

export function named(name: string): Query {
  return (entity: Entity) => entity.name === name;
}
