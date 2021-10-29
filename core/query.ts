import { Component, ComponentConstructor } from "./component.ts";
import { Entity, Mask } from "./entity.ts";

export type QueryResult = Set<Entity>;

export interface QueryStore {
  readonly length: number;

  register(query: Mask): QueryResult;
  unregister(query: Mask): void;
  get(query: Mask): QueryResult;

  removed(entity: Entity): void;
  update(entity: Entity, mask: Mask, query: Mask): void;
  refresh(entity: Entity, mask: Mask): void;
}

export function maskOf(
  components: ComponentConstructor<Component<unknown>>[],
): number {
  let mask = 0;
  for (const Component of components) {
    mask |= Component.mask!;
  }
  return mask;
}
