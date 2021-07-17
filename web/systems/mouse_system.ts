/// <reference lib="dom" />

import { EntityQueue, System } from "../../engine/mod.ts";
import { Mouse } from "../../std/components/mouse.ts";
import { has, Vector2 } from "../../std/mod.ts";

export class MouseInputSystem extends System {
  #element: HTMLElement;

  #position: Vector2;
  #buttons: Set<number>;
  #left: boolean;
  #middle: boolean;
  #right: boolean;

  queries = {
    "all": has(Mouse),
  };

  // deno-lint-ignore no-undef
  constructor(preventDefault = true, element: HTMLElement = document.body) {
    super();

    this.#element = element;

    this.#position = Vector2.zero();
    this.#buttons = new Set();
    this.#left = false;
    this.#middle = false;
    this.#right = false;

    this.#element.addEventListener("mousemove", (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      this.#position.x = event.clientX - this.#element.offsetLeft;
      this.#position.y = event.clientY - this.#element.offsetTop;

      if (preventDefault) {
        event.preventDefault();
      }
    });

    this.#element.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      switch (event.button) {
        case 0:
          this.#left = true;
          break;
        case 1:
          this.#middle = true;
          break;
        case 2:
          this.#right = true;
          break;
      }

      this.#buttons.add(event.button);

      if (preventDefault) {
        event.preventDefault();
      }
    });

    this.#element.addEventListener("mouseup", (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      switch (event.button) {
        case 0:
          this.#left = false;
          break;
        case 1:
          this.#middle = false;
          break;
        case 2:
          this.#right = false;
          break;
      }

      this.#buttons.delete(event.button);

      if (preventDefault) {
        event.preventDefault();
      }
    });
  }

  update(queries: EntityQueue, _delta: number): void {
    for (const entity of queries["all"]) {
      const component = entity.components.get(Mouse);

      component.position = this.#position;
      component.buttons = this.#buttons;
      component.left = this.#left;
      component.middle = this.#middle;
      component.right = this.#right;
    }
  }
}
