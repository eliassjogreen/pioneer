import {
  Component,
  ComponentConstructor,
  Entity,
  Query,
} from "../../engine/mod.ts";

export function lacks(name: string): Query;
export function lacks<T extends Component>(
  component: ComponentConstructor<T>,
): Query;
export function lacks<T extends Component>(
  componentOrName: ComponentConstructor<T> | string,
): Query {
  return (entity: Entity) => !entity.components.has(componentOrName);
}
