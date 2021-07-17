/// <reference lib="dom" />

import { EntityQueue, System } from "../../engine/mod.ts";
import { Keyboard } from "../../std/components/keyboard.ts";
import { has } from "../../std/mod.ts";

export class KeyboardSystem extends System {
  #element: HTMLElement;

  #pressed: Set<string>;
  #justPressed: Set<string>;
  #justReleased: Set<string>;

  queries = {
    "all": has(Keyboard),
  };

  constructor(preventDefault = true, element: HTMLElement = document.body) {
    super();

    this.#element = element;

    this.#pressed = new Set();
    this.#justPressed = new Set();
    this.#justReleased = new Set();

    this.#element.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      this.#justPressed.add(event.key);
      this.#pressed.add(event.key);

      if (preventDefault) {
        event.preventDefault();
      }
    });

    this.#element.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      this.#justReleased.add(event.key);
      this.#pressed.delete(event.key);

      if (preventDefault) {
        event.preventDefault();
      }
    });
  }

  update(queries: EntityQueue, _delta: number): void {
    for (const entity of queries["all"]) {
      const component = entity.components.get(Keyboard);

      component.pressed = this.#pressed;
      component.justPressed = new Set(this.#justPressed);
      component.justReleased = new Set(this.#justReleased);
    }

    this.#justPressed.clear();
    this.#justReleased.clear();
  }
}
