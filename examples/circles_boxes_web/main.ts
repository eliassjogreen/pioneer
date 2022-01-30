/// <reference lib="dom" />

import {
  Component,
  TypedArrayComponent,
  TypedArrayComponentStore,
  World,
} from "../../core/mod.ts";

// Constants
const NUM_ELEMENTS = 250;
const SPEED_MULTIPLIER = 0.3;
const SHAPE_SIZE = 50;
const SHAPE_HALF_SIZE = SHAPE_SIZE / 2;

// Globals
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const context = canvas.getContext("2d")!;

// World
const world = new World();

// Components
class PositionComponent extends TypedArrayComponent<{ x: number; y: number }> {
  static TypedArray = Float64Array;
  static elements = 2;

  static write(buffer: Float64Array, value: { x: number; y: number }) {
    buffer[0] = value.x;
    buffer[1] = value.y;
  }

  static read(buffer: Float64Array): { x: number; y: number } {
    return {
      x: buffer[0],
      y: buffer[1],
    };
  }

  value = { x: 0, y: 0 };
}

class VelocityComponent extends TypedArrayComponent<{ x: number; y: number }> {
  static TypedArray = Float64Array;
  static elements = 2;

  static write(buffer: Float64Array, value: { x: number; y: number }) {
    buffer[0] = value.x;
    buffer[1] = value.y;
  }

  static read(buffer: Float64Array): { x: number; y: number } {
    return {
      x: buffer[0],
      y: buffer[1],
    };
  }

  value = { x: 0, y: 0 };
}

class ShapeComponent extends TypedArrayComponent<number> {
  static TypedArray = Uint8Array;
  static elements = 1;

  static write(buffer: Uint8Array, value: number) {
    buffer[0] = value;
  }

  static read(buffer: Uint8Array): number {
    return buffer[0];
  }

  value = 0;
}

class RenderableComponent extends Component<undefined> {
  value = undefined;
}

world.components.register(PositionComponent, TypedArrayComponentStore);
world.components.register(VelocityComponent, TypedArrayComponentStore);
world.components.register(ShapeComponent, TypedArrayComponentStore);
world.components.register(RenderableComponent, EmptyComponentStore);

// Queries
const moving = world.queries.register([VelocityComponent, ShapeComponent]);
const renderables = world.queries.register([
  RenderableComponent,
  ShapeComponent,
]);

// Systems
function movement(delta: number) {
  for (const entity of moving) {
    const velocity = world.components.get(entity, VelocityComponent)!;
    const position = world.components.get(entity, PositionComponent)!;

    position.x += velocity.x * delta;
    position.y += velocity.y * delta;

    if (position.x > width + SHAPE_HALF_SIZE) {
      position.x = -SHAPE_HALF_SIZE;
    }
    if (position.x < -SHAPE_HALF_SIZE) {
      position.x = width +
        SHAPE_HALF_SIZE;
    }
    if (position.y > height + SHAPE_HALF_SIZE) {
      position.y = -SHAPE_HALF_SIZE;
    }
    if (position.y < -SHAPE_HALF_SIZE) {
      position.y = height + SHAPE_HALF_SIZE;
    }

    world.components.set(entity, VelocityComponent, velocity);
    world.components.set(entity, PositionComponent, position);
  }
}

function render() {
  context.fillStyle = "#d4d4d4";
  context.fillRect(0, 0, width, height);

  for (const entity of renderables) {
    const shape = world.components.get(entity, ShapeComponent)!;
    const position = world.components.get(entity, PositionComponent)!;

    if (shape === 0) {
      context.beginPath();
      context.arc(
        position.x,
        position.y,
        SHAPE_HALF_SIZE,
        0,
        2 * Math.PI,
        false,
      );
      context.fillStyle = "#39c495";
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = "#0b845b";
      context.stroke();
    } else {
      context.beginPath();
      context.rect(
        position.x - SHAPE_HALF_SIZE,
        position.y - SHAPE_HALF_SIZE,
        SHAPE_SIZE,
        SHAPE_SIZE,
      );
      context.fillStyle = "#e2736e";
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = "#b74843";
      context.stroke();
    }
  }
}

// Spawn
for (let i = 0; i < NUM_ELEMENTS; i++) {
  const entity = world.entities.spawn();

  world.components.set(entity, PositionComponent, {
    x: Math.random() * width,
    y: Math.random() * height,
  });
  world.components.set(entity, VelocityComponent, {
    x: SPEED_MULTIPLIER * (2 * Math.random() - 1),
    y: SPEED_MULTIPLIER * (2 * Math.random() - 1),
  });
  world.components.set(entity, ShapeComponent, Math.round(Math.random()));
  world.components.set(entity, RenderableComponent, new RenderableComponent());
}

// Run
function run() {
  const time = performance.now();
  const delta = time - previous;

  movement(delta);
  render();

  previous = time;
  requestAnimationFrame(run);
}

let previous = performance.now();
run();
