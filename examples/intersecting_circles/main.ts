/// <reference lib="dom" />

import { Component, World } from "../../core/mod.ts";
import { f64, Struct } from "https://deno.land/x/byte_type@0.1.5/mod.ts";
import {
  TypeComponent,
  TypeComponentStore,
} from "../../core/components/type_component_store.ts";
import { MapComponentStore } from "../../core/components/map_component_store.ts";
import { ArrayComponentStore } from "../../core/components/array_component_store.ts";

// Constants
const SPEED_MULTIPLIER = 0.001;
const NUM_ELEMENTS = 250;

// Globals
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const context = canvas.getContext("2d")!;

// World
const world = new World();

// Components
class PositionComponent extends TypeComponent<{ x: number; y: number }> {
  static type = new Struct({ x: f64, y: f64 });
  value = { x: 0, y: 0 };
}

class VelocityComponent extends TypeComponent<{ x: number; y: number }> {
  static type = new Struct({ x: f64, y: f64 });
  value = { x: 0, y: 0 };
}

class AccelerationComponent extends TypeComponent<{ x: number; y: number }> {
  static type = new Struct({ x: f64, y: f64 });
  value = { x: 0, y: 0 };
}

class CircleComponent extends TypeComponent<{ radius: number }> {
  static type = new Struct({ radius: f64 });
  value = { radius: 0 };
}

class IntersectionComponent
  extends Component<[number, number, number, number][]> {
  value: [number, number, number, number][] = [];
}

world.components.register(PositionComponent, TypeComponentStore);
world.components.register(VelocityComponent, TypeComponentStore);
world.components.register(AccelerationComponent, TypeComponentStore);
world.components.register(CircleComponent, TypeComponentStore);
world.components.register(IntersectionComponent, ArrayComponentStore);

// Queries
const moving = world.queries.register([
  VelocityComponent,
  AccelerationComponent,
  PositionComponent,
  CircleComponent,
]);
const circles = world.queries.register([CircleComponent, PositionComponent]);
const intersecting = world.queries.register([IntersectionComponent]);

// Systems
function movement(delta: number) {
  for (const entity of moving) {
    const position = world.components.get(entity, PositionComponent)!;
    const velocity = world.components.get(entity, VelocityComponent)!;
    const acceleration = world.components.get(entity, AccelerationComponent)!;
    const circle = world.components.get(entity, CircleComponent)!;

    position.x += velocity.x * acceleration.x *
      delta * SPEED_MULTIPLIER;
    position.y += velocity.y * acceleration.y *
      delta * SPEED_MULTIPLIER;

    if (acceleration.x > 1) {
      acceleration.x -= delta * SPEED_MULTIPLIER;
    }
    if (acceleration.y > 1) {
      acceleration.y -= delta * SPEED_MULTIPLIER;
    }

    if (acceleration.x < 1) {
      acceleration.x = 1;
    }
    if (acceleration.y < 1) {
      acceleration.y = 1;
    }

    if (position.y + circle.radius < 0) {
      position.y = height + circle.radius;
    }
    if (position.y - circle.radius > height) {
      position.y = -circle.radius;
    }

    if (position.x - circle.radius > width) {
      position.x = 0;
    }
    if (position.x + circle.radius < 0) {
      position.x = width;
    }

    world.components.set(entity, PositionComponent, position);
    world.components.set(entity, AccelerationComponent, acceleration);
  }
}

function intersection() {
  const entities = [...circles.values()];
  for (let i = 0; i < entities.length; i++) {
    const entityA = entities[i];

    if (world.components.has(entityA, IntersectionComponent)) {
      world.components.set(entityA, IntersectionComponent, []);
    }

    const circleA = world.components.get(entityA, CircleComponent)!;
    const positionA = world.components.get(entityA, PositionComponent)!;

    for (let j = i + 1; j < entities.length; j++) {
      const entityB = entities[j];
      const circleB = world.components.get(entityB, CircleComponent)!;
      const positionB = world.components.get(entityB, PositionComponent)!;

      const intersect = intersects(circleA, positionA, circleB, positionB);
      if (intersect !== undefined) {
        if (!world.components.has(entityA, IntersectionComponent)) {
          world.components.set(entityA, IntersectionComponent, []);
        }

        const points = world.components.get(entityA, IntersectionComponent)!;
        points.push(intersect);
        world.components.set(entityA, IntersectionComponent, points);
      }
    }

    if (
      world.components.has(entityA, IntersectionComponent) &&
      (world.components.get(entityA, IntersectionComponent) as [])
          .length === 0
    ) {
      world.components.remove(entityA, IntersectionComponent);
    }
  }
}

function render() {
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  for (const entity of circles) {
    const circle = world.components.get(entity, CircleComponent)!;
    const position = world.components.get(entity, PositionComponent)!;

    context.beginPath();
    context.arc(
      position.x,
      position.y,
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
      IntersectionComponent,
    )!;
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

function intersects(
  circleA: { radius: number },
  positionA: { x: number; y: number },
  circleB: { radius: number },
  positionB: { x: number; y: number },
): [number, number, number, number] | undefined {
  const dx = positionB.x - positionA.x;
  const dy = positionB.y - positionA.y;

  const d = Math.sqrt(dy * dy + dx * dx);

  if (d > circleA.radius + circleB.radius) {
    return;
  }
  if (d < Math.abs(circleA.radius - circleB.radius)) {
    return;
  }

  const a = (circleA.radius * circleA.radius -
    circleB.radius * circleB.radius +
    d * d) /
    (2.0 * d);

  const x2 = positionA.x + (dx * a) / d;
  const y2 = positionA.y + (dy * a) / d;

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

  world.components.set(entity, PositionComponent, {
    x: Math.random() * width,
    y: Math.random() * height,
  });
  world.components.set(entity, VelocityComponent, {
    x: random(-20, 20),
    y: random(-20, 20),
  });
  world.components.set(entity, AccelerationComponent, {
    x: 0,
    y: 0,
  });
  world.components.set(entity, CircleComponent, {
    radius: random(20, 100),
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
