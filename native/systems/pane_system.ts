import { Pane } from "../deps.ts";

import { EntityQueue, System } from "../../engine/mod.ts";
import { has } from "../../std/mod.ts";

import { PaneEvents } from "../components/pane_events.ts";
import { PaneBuffer } from "../components/pane_buffer.ts";

export class PaneSystem extends System {
  readonly frameLength: number;

  #pane: Pane;

  readonly queries = {
    events: has(PaneEvents),
    buffer: has(PaneBuffer)
  };

  constructor(width: number, height: number) {
    super();
    
    this.frameLength = width * height * 4;

    const size = { logical: { width, height } };

    this.#pane = new Pane(width, height);
    this.#pane.setInnerSize(size);
    this.#pane.setMaxInnerSize(size);
    this.#pane.setMinInnerSize(size);
    this.#pane.setResizable(false);
  }

  update(queries: EntityQueue, delta: number) {
    const events = Pane.Step();

    // console.log(queries);

    for (const entity of queries["events"]) {
      entity.components.get(PaneEvents).events = events;
    }

    if (queries["buffer"][0]) {
      const entity = queries["buffer"][0];
      this.#pane.drawFrame(entity.components.get(PaneBuffer).buffer);
      this.#pane.renderFrame();
    }

    for (const event of events) {
      switch (event.type) {
        case "windowEvent":
          switch (event.value.event.type) {
            case "closeRequested":
              Deno.exit();
              break;
            case "resized":
              this.#pane.resizeFrame(
                event.value.event.value.width,
                event.value.event.value.height,
              );
              break;
          }
          break;
      }
    }
  }
}
