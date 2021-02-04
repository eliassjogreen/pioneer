import { System } from "./system.ts";
import { EntityQueue } from "./entity_queue.ts";
import { Scene } from "./scene.ts";

/** A container for systems */
export class SystemContainer {
  #scene: Scene;
  #systems: Map<string, System>;

  /** Returns the number of systems contained in this class */
  get length(): number {
    return this.#systems.size;
  }

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#systems = new Map();
  }

  /** Queries the system returning all matching entities in a EntityQueue */
  queryQueue(system: System): EntityQueue {
    const queue: EntityQueue = {};

    for (const identifier in system.queries) {
      const query = system.queries[identifier];
      const matches = this.#scene.entities.query(query);
      queue[identifier] = matches;
    }

    return queue;
  }

  /** Checks if this contains an System with the specified system */
  has(name: string): boolean;
  has(system: System): boolean;
  has(systemOrName: System | string): boolean {
    const name = typeof systemOrName === "string"
      ? systemOrName
      : systemOrName.name;

    return this.#systems.has(name);
  }

  /** Returns the specified System from this container */
  get(name: string): System | undefined;
  get(system: System): System | undefined;
  get(systemOrName: System | string): System | undefined {
    const name = typeof systemOrName === "string"
      ? systemOrName
      : systemOrName.name;

    return this.#systems.get(name);
  }

  /** Returns all the Systems in this container */
  all(): System[] {
    return [...this.#systems.values()];
  }

  /** Adds an system to this container */
  add(system: System): void {
    const name = system.name;

    if (!this.has(name)) {
      this.#systems.set(name, system);
      system.added?.(this.queryQueue(system));
    }
  }

  /** Removes an system from this container */
  remove(name: string): boolean;
  remove(system: System): boolean;
  remove(systemOrName: System | string): boolean {
    const name = typeof systemOrName === "string"
      ? systemOrName
      : systemOrName.name;

    if (this.has(name)) {
      const system = this.get(name)!;
      system.removed?.(this.queryQueue(system));
    }

    return this.#systems.delete(name);
  }

  /** Start a system in this container */
  start(name: string): void;
  start(system: System): void;
  start(systemOrName: System | string): void {
    const system = typeof systemOrName === "string"
      ? this.get(systemOrName)
      : systemOrName;

    system?.start?.(this.queryQueue(system));
  }

  /** Stop a system in this container */
  stop(name: string): void;
  stop(system: System): void;
  stop(systemOrName: System | string): void {
    const system = typeof systemOrName === "string"
      ? this.get(systemOrName)
      : systemOrName;

    system?.stop?.(this.queryQueue(system));
  }

  /** Update a system in this container */
  update(name: string, delta: number): void;
  update(system: System, delta: number): void;
  update(systemOrName: System | string, delta: number): void {
    const system = typeof systemOrName === "string"
      ? this.get(systemOrName)
      : systemOrName;

    system?.update?.(this.queryQueue(system), delta);
  }
}
