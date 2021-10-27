export interface Entities {
  readonly length: number;

  spawn(): number;
  kill(entity: number): void;
  get(entity: number): number;
  set(entity: number, mask: number): number;
  enable(entity: number, mask: number): number;
  disable(entity: number, mask: number): number;
  entries(): [number, number][];
}
