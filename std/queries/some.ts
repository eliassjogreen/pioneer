import { Entity, Query } from "../../engine/mod.ts";

export function some(...queries: Query[]): Query {
  return (entity: Entity) => queries.some((query) => query(entity));
}
