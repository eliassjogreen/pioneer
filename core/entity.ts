export type Entity = number;
export type Mask = number;

export interface EntityStore {
  readonly length: number;

  spawn(): Entity;
  kill(entity: Entity): void;
  get(entity: Entity): Mask;
  set(entity: Entity, mask: Mask): Mask;
  enable(entity: Entity, mask: Mask): Mask;
  disable(entity: Entity, mask: Mask): Mask;
  entries(): [Entity, Mask][];
}
