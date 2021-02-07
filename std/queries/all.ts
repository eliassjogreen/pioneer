import { Entity, Query } from "../../engine/mod.ts";

export function all(...queries: Query[]): Query {
  return (entity: Entity) => queries.every((query) => query(entity));
}
