/// <reference lib="dom" />

import { World } from "../../core/mod.ts";
import { f64, Struct } from "https://deno.land/x/byte_type@0.1.5/mod.ts";
import { reference } from "../../std/util/reference_type.ts";

// Constants
const SPEED_MULTIPLIER = 0.001;
const NUM_ELEMENTS = 50;

// Globals
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const context = canvas.getContext("2d")!;

// World
const world = new World();

// Components
const positionType = new Struct({ x: f64, y: f64 });
const movementComponent = world.components.register(
  new Struct({ velocity: positionType, acceleration: positionType }),
);
const circleComponent = world.components.register(
  new Struct({
    velocity: positionType,
    acceleration: positionType,
    radius: f64,
    position: positionType,
  }),
);
const intersectingComponent = world.components.register(reference);

// Queries
const moving = world.queries.register(
  (1 << movementComponent) | (1 << circleComponent),
);
const circles = world.queries.register(1 << circleComponent);
const intersecting = world.queries.register(1 << intersectingComponent);

// Systems
function movement(delta: number) {
  for (const entity of moving) {
    world.components.mutate(
      entity,
      [movementComponent, circleComponent],
      (
        [movement, circle]: [
          {
            velocity: { x: number; y: number };
            acceleration: { x: number; y: number };
          },
          {
            velocity: { x: number; y: number };
            acceleration: { x: number; y: number };
            radius: number;
            position: { x: number; y: number };
          },
        ],
      ) => {
        circle.position.x += movement.velocity.x * movement.acceleration.x *
          delta * SPEED_MULTIPLIER;
        circle.position.y += movement.velocity.y * movement.acceleration.y *
          delta * SPEED_MULTIPLIER;

        if (movement.acceleration.x > 1) {
          movement.acceleration.x -= delta * SPEED_MULTIPLIER;
        }
        if (movement.acceleration.y > 1) {
          movement.acceleration.y -= delta * SPEED_MULTIPLIER;
        }
        if (movement.acceleration.x < 1) movement.acceleration.x = 1;
        if (movement.acceleration.y < 1) movement.acceleration.y = 1;

        if (circle.position.y + circle.radius < 0) {
          circle.position.y = height + circle.radius;
        }

        if (circle.position.y - circle.radius > height) {
          circle.position.y = -circle.radius;
        }

        if (circle.position.x - circle.radius > width) {
          circle.position.x = 0;
        }

        if (circle.position.x + circle.radius < 0) {
          circle.position.x = width;
        }
      },
    );
  }
}

function intersection() {
  const entities = [...circles.values()];
  for (let i = 0; i < entities.length; i++) {
    const entityA = entities[i];

    if (world.components.has(entityA, 1 << intersectingComponent)) {
      world.components.set(entityA, intersectingComponent, []);
    }

    const circleA = world.components.get(entityA, circleComponent);

    for (let j = i + 1; j < entities.length; j++) {
      const entityB = entities[j];
      const circleB = world.components.get(entityB, circleComponent);

      const intersect = intersects(circleA, circleB);
      if (intersect !== false) {
        if (!world.components.has(entityA, 1 << intersectingComponent)) {
          world.components.set(entityA, intersectingComponent, []);
        }

        world.components.mutate(
          entityA,
          [intersectingComponent],
          ([points]: [unknown[]]) => {
            points.push(intersect);
          },
        );
      }
    }

    if (
      world.components.has(entityA, 1 << intersectingComponent) &&
      (world.components.get(entityA, intersectingComponent) as unknown[])
          .length === 0
    ) {
      world.components.remove(entityA, intersectingComponent);
    }
  }
}

function render() {
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  for (const entity of circles) {
    const circle = world.components.get(entity, circleComponent) as {
      velocity: { x: number; y: number };
      acceleration: { x: number; y: number };
      radius: number;
      position: { x: number; y: number };
    };

    context.beginPath();
    context.arc(
      circle.position.x,
      circle.position.y,
      circle.radius,
      0,
      2 * Math.PI,
      false,
    );
    context.lineWidth = 1;
    context.strokeStyle = "#fff";
    context.stroke();
  }

  for (const entity of intersecting) {
    const intersect = world.components.get(
      entity,
      intersectingComponent,
    ) as number[][];
    for (const points of intersect) {
      context.lineWidth = 2;
      context.strokeStyle = "#ff9";

      context.fillStyle = "rgba(255, 255,255, 0.2)";
      fillCircle(points[0], points[1], 8);
      fillCircle(points[2], points[3], 8);

      context.fillStyle = "#fff";
      fillCircle(points[0], points[1], 3);
      fillCircle(points[2], points[3], 3);

      drawLine(points[0], points[1], points[2], points[3]);
    }
  }
}

// Helper functions
function random(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

// deno-lint-ignore no-explicit-any
function intersects(circleA: any, circleB: any) {
  const dx = circleB.position.x - circleA.position.x;
  const dy = circleB.position.y - circleA.position.y;

  const d = Math.sqrt(dy * dy + dx * dx);

  if (d > circleA.radius + circleB.radius) {
    return false;
  }
  if (d < Math.abs(circleA.radius - circleB.radius)) {
    return false;
  }

  const a = (circleA.radius * circleA.radius -
    circleB.radius * circleB.radius +
    d * d) /
    (2.0 * d);

  const x2 = circleA.position.x + (dx * a) / d;
  const y2 = circleA.position.y + (dy * a) / d;

  const h = Math.sqrt(circleA.radius * circleA.radius - a * a);

  const rx = -dy * (h / d);
  const ry = dx * (h / d);

  const xi = x2 + rx;
  const xiPrime = x2 - rx;
  const yi = y2 + ry;
  const yiPrime = y2 - ry;

  return [xi, yi, xiPrime, yiPrime];
}

function fillCircle(x: number, y: number, radius: number) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.fill();
}

function drawLine(a: number, b: number, c: number, d: number) {
  context.beginPath();
  context.moveTo(a, b);
  context.lineTo(c, d);
  context.stroke();
}

// Spawn
for (let i = 0; i < NUM_ELEMENTS; i++) {
  const entity = world.entities.spawn();

  world.components.set(entity, circleComponent, {
    position: { x: random(0, width), y: random(0, height) },
    radius: random(20, 100),
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
  });
  world.components.set(entity, movementComponent, {
    velocity: { x: random(-20, 20), y: random(-20, 20) },
    acceleration: { x: 0, y: 0 },
  });
}

// Run
function run() {
  const time = performance.now();
  const delta = time - previous;

  movement(delta);
  intersection();
  render();

  previous = time;
  requestAnimationFrame(run);
}

let previous = performance.now();
run();
