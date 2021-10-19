export class Queries {
  #queries: Record<number, Set<number>> = {};

  register(query: number) {
    this.#queries[query] = new Set();
    return this.#queries[query];
  }

  unregister(mask: number) {
    delete this.#queries[mask];
  }

  killed(entity: number) {
    for (const mask in this.#queries) {
      this.#queries[mask].delete(entity);
    }
  }

  update(entity: number, mask: number, query?: number) {
    if (query !== undefined) {
      if ((mask & query) === query) {
        this.#queries[query].add(entity);
      } else {
        this.#queries[query].delete(entity);
      }
    } else {
      for (const query in this.#queries) {
        this.update(entity, mask, parseInt(query));
      }
    }
  }
}
