/// <reference lib="dom" />

import { World } from "../../core/mod.ts";
import { f64, Struct, u8 } from "https://deno.land/x/byte_type@0.1.5/mod.ts";
import { empty } from "../../std/util/empty_type.ts";

// Constants
const NUM_ELEMENTS = 50;
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
const positionComponent = world.components.register(
  new Struct({ x: f64, y: f64 }),
);
const velocityComponent = world.components.register(
  new Struct({ x: f64, y: f64 }),
);
const shapeComponent = world.components.register(u8);
const renderableComponent = world.components.register(empty);

// Queries
const moving = world.queries.register(
  (1 << velocityComponent) | (1 << positionComponent),
);
const renderables = world.queries.register(
  (1 << renderableComponent) | (1 << shapeComponent),
);

// Systems
function move(delta: number) {
  for (const entity of moving) {
    const velocity = world.components.mutable(
      entity,
      velocityComponent,
    ) as {
      x: number;
      y: number;
    };
    const position = world.components.mutable(
      entity,
      positionComponent,
    ) as {
      x: number;
      y: number;
    };

    position.x += velocity.x * delta;
    position.y += velocity.y * delta;

    if (position.x > width + SHAPE_HALF_SIZE) position.x = -SHAPE_HALF_SIZE;
    if (position.x < -SHAPE_HALF_SIZE) position.x = width + SHAPE_HALF_SIZE;
    if (position.y > height + SHAPE_HALF_SIZE) position.y = -SHAPE_HALF_SIZE;
    if (position.y < -SHAPE_HALF_SIZE) position.y = height + SHAPE_HALF_SIZE;
  }
}

function render() {
  context.fillStyle = "#d4d4d4";
  context.fillRect(0, 0, width, height);

  for (const entity of renderables) {
    const shape = world.components.get(entity, shapeComponent) as number;
    const position = world.components.get(entity, positionComponent) as {
      x: number;
      y: number;
    };

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

// Helper functions
function getRandomVelocity() {
  return {
    x: SPEED_MULTIPLIER * (2 * Math.random() - 1),
    y: SPEED_MULTIPLIER * (2 * Math.random() - 1),
  };
}

function getRandomPosition() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  };
}

function getRandomShape() {
  return Math.round(Math.random());
}

// Spawn
for (let i = 0; i < NUM_ELEMENTS; i++) {
  const entity = world.entities.spawn();
  world.components.set(entity, positionComponent, getRandomPosition());
  world.components.set(entity, velocityComponent, getRandomVelocity());
  world.components.set(entity, shapeComponent, getRandomShape());
  world.components.set(entity, renderableComponent, null);
}

// Run
function run() {
  const time = performance.now();
  const delta = time - previous;

  move(delta);
  render();

  previous = time;
  requestAnimationFrame(run);
}

let previous = performance.now();
run();
