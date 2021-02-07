import { Pane } from "./deps.ts";
import { Size } from "../std/common.ts";
import { Frame } from "./frame.ts";

export class Surface {
  #width: number;
  #height: number;

  pane: Pane;
  frame: Frame;

  get size(): Size {
    return { width: this.#width, height: this.#height };
  }

  set size({ width, height }) {
    if (this.#width !== width || this.#height !== height) {
      this.pane.resizeFrame(width, height);
      this.frame = new Frame(width, height);
      this.#width = width;
      this.#height = height;
    }
  }

  constructor(width = 0, height = 0) {
    const size = { logical: { width, height } };

    this.pane = new Pane(width, height);
    this.frame = new Frame(width, height);
    this.pane.setInnerSize(size);
    this.pane.setMaxInnerSize(size);
    this.pane.setMinInnerSize(size);

    this.#width = width;
    this.#height = height;
  }

  run(fps = 60) {
    const interval = setInterval(() => {
      for (const event of Pane.Step()) {
        switch (event.type) {
          case "windowEvent":
            switch (event.value.event.type) {
              case "closeRequested":
                clearInterval(interval);
                break;
              case "resized":
                this.resize(event.value.event.value);
                break;
            }
            break;
        }
      }
    }, 1000 / fps);
  }

  draw() {
    this.pane.drawFrame(this.frame.uint8array);
    this.pane.renderFrame();
  }

  resize(size: Size) {
    this.size = size;
    this.pane.resizeFrame(size.width, size.height);
  }
}
