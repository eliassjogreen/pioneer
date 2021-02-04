import { Scene } from "./scene.ts";

/** The main Engine class that controls scenes, updating etc */
export class Engine {
  #running = false;
  #frame = 0;
  #delta = 0;
  #fps = 0;
  #lastUpdate = 0;
  #interval = 0;

  /** The target ms/frame, 0 if unlimited */
  target: number;

  /** The current Scene */
  scene: Scene | undefined;

  /** Returns true if the Engine is running (has been started) */
  get running(): boolean {
    return this.#running;
  }

  /** Returns the total amount of frames rendered */
  get frame(): number {
    return this.#frame;
  }

  /** Returns the current frames per second rendered */
  get fps(): number {
    return this.#fps;
  }

  /** Returns the time the last update was called */
  get lastUpdate(): number {
    return this.#lastUpdate;
  }

  /** Returns the current delta time */
  get delta(): number {
    return this.#delta;
  }

  constructor({ scene, target = 0 }: Partial<{ scene: Scene, target: number }>) {
    this.scene = scene;
    this.target = target;
  }

  /** Starts the engine, starting the scene and starts the core loop */
  start(): void {
    if (!this.running && this.scene) {
      this.#running = true;

      this.scene.start();

      this.#interval = setInterval(this.update.bind(this), this.target);
    }
  }

  /** Stops the core loop */
  stop(): void {
    if (this.running) {
      this.#running = false;

      if (this.scene) {
        this.scene.stop();
      }

      clearInterval(this.#interval);
    }
  }

  /** Takes a step in the core loop */
  update(): void {
    if (this.scene === undefined) {
      this.stop();
      return;
    }

    const timestamp = performance.now();

    this.#frame++;
    this.#delta = (timestamp - this.lastUpdate) / 1000;
    this.#fps = 1 / this.delta;
    this.#lastUpdate = timestamp;

    this.scene.update(this.delta);
  }
}
