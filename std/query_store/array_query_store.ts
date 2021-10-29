import { Entity, Mask, QueryResult, QueryStore } from "../deps.ts";

export class ArrayQueryStore implements QueryStore {
  #queries: QueryResult[] = [];

  get length(): number {
    return this.#queries.filter((query) => query !== undefined).length;
  }

  register(query: Mask): QueryResult {
    return this.#queries[query] = new Set();
  }

  unregister(query: Mask): void {
    delete this.#queries[query];
  }

  get(query: Mask): QueryResult {
    return this.#queries[query];
  }

  removed(entity: Entity): void {
    for (const query of this.#queries) {
      if (query !== undefined) {
        query.delete(entity);
      }
    }
  }

  update(entity: Entity, mask: Mask, query: Mask): void {
    if ((mask & query) === query) {
      this.#queries[query].add(entity);
    } else {
      this.#queries[query].delete(entity);
    }
  }

  refresh(entity: Entity, mask: Mask): void {
    for (let query = 0; query < this.#queries.length; query++) {
      if (this.#queries[query] !== undefined) {
        if ((mask & query) === query) {
          this.#queries[query].add(entity);
        } else {
          this.#queries[query].delete(entity);
        }
      }
    }
  }
}
