import { Entity } from "./entity.ts";

/** A function predicate that returns true if entity matches query */
export type Query = (entity: Entity) => boolean;
