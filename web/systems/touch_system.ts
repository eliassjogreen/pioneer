/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { EntityQueue, System } from "../../engine/mod.ts";
import { Touch } from "../../std/components/touch.ts";
import { has, Vector2 } from "../../std/mod.ts";

export class TouchInputSystem extends System {
  #element: HTMLElement;

  #touches: Map<number, Vector2>;
  #changed: Map<number, Vector2>;

  public readonly queries = {
    "all": has(Touch),
  };

  // deno-lint-ignore no-undef
  constructor(element: HTMLElement = document.body) {
    super();

    this.#element = element;

    this.#touches = new Map();
    this.#changed = new Map();

    this.#element.addEventListener("touchstart", this.onTouchEvent.bind(this));
    this.#element.addEventListener("touchend", this.onTouchEvent.bind(this));
    this.#element.addEventListener("touchmove", this.onTouchEvent.bind(this));
  }

  private onTouchEvent(event: TouchEvent): void {
    this.#touches.clear();

    for (const touch of event.touches) {
      this.#touches.set(
        touch.identifier,
        new Vector2(
          touch.clientX - this.#element.offsetLeft,
          touch.clientY - this.#element.offsetTop,
        ),
      );
    }

    for (const touch of event.changedTouches) {
      this.#changed.set(
        touch.identifier,
        new Vector2(
          touch.clientX - this.#element.offsetLeft,
          touch.clientY - this.#element.offsetTop,
        ),
      );
    }
  }

  public update(entities: EntityQueue, _delta: number): void {
    for (const entity of entities["all"]) {
      entity.components.get(Touch).touches = this.#touches;
      entity.components.get(Touch).changed = this.#changed;
    }
  }
}
