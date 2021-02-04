import {
  Component,
  ComponentConstructor,
  Entity,
  Query,
} from "../../engine/mod.ts";

export function has(name: string): Query;
export function has<T extends Component>(component: ComponentConstructor<T>): Query;
export function has<T extends Component>(componentOrName: ComponentConstructor<T> | string): Query {
  return (entity: Entity) => entity.components.has(componentOrName);
}
