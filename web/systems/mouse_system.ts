import { EntityQueue, System } from "../../engine/mod.ts";
import { Mouse } from "../../std/components/mouse.ts";
import { has, Point } from "../../std/mod.ts";

export class MouseInputSystem extends System {
  #element: HTMLElement;

  #position: Point;
  #buttons: Set<number>;
  #left: boolean;
  #middle: boolean;
  #right: boolean;

  public queries = {
    "all": has(Mouse),
  };

  // deno-lint-ignore no-undef
  constructor(element: HTMLElement = document.body) {
    super();

    this.#element = element;

    this.#position = { x: 0, y: 0 };
    this.#buttons = new Set();
    this.#left = false;
    this.#middle = false;
    this.#right = false;

    this.#element.addEventListener("mousemove", (event: MouseEvent) => {
      this.#position.x = event.clientX - this.#element.offsetLeft;
      this.#position.y = event.clientY - this.#element.offsetTop;
    });
    this.#element.addEventListener("mousedown", (event: MouseEvent) => {
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
    });
    this.#element.addEventListener("mouseup", (event: MouseEvent) => {
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
    });
  }

  update(queries: EntityQueue, delta: number): void {
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
