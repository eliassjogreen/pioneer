import { Component, Entity, EntityQueue, System } from "../../engine/mod.ts";
import { fnv1a, has, Watch } from "../../std/mod.ts";

const encoder = new TextEncoder();

export class WatchSystem extends System {
  queries = {
    watch: has(Watch),
  };

  #hash(component: Component): number {
    return fnv1a(
      encoder.encode(
        (Object.getOwnPropertyNames(component).map((name) =>
          // deno-lint-ignore no-explicit-any
          `${name}:${JSON.stringify((component as any)[name])}`
        ).join()),
      ),
    );
  }

  #check(entity: Entity) {
    const watch = entity.components.get(Watch);

    watch.changed = false;
    watch.changes.clear();

    for (const component of entity.components) {
      if (watch.exclude.has(component.name)) continue;

      const prev = watch.state.get(component.name);
      const curr = this.#hash(component);

      if (prev !== curr) {
        watch.changed = true;
        watch.changes.add(component);
        watch.state.set(component.name, curr);
      }
    }
  }

  update(queries: EntityQueue, _delta: number) {
    for (const entity of queries["watch"]) {
      this.#check(entity);
    }
  }

  enter(entity: Entity) {
    this.#check(entity);
  }
}
