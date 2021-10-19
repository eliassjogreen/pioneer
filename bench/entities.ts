import { bench, runBenchmarks } from "./deps.ts";
import {
  DynamicEntities,
  FixedEntities,
  GrowableEntities,
} from "../core/entities.ts";

const count = 100000;
const runs = 100;

bench({
  name: "DynamicEntities.spawn",
  func: (timer) => {
    const entities = new DynamicEntities();

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "DynamicEntities.spawn x 2",
  func: (timer) => {
    const entities = new DynamicEntities();

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.spawn();
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "DynamicEntities.kill",
  func: (timer) => {
    const entities = new DynamicEntities();
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.kill(i);
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "DynamicEntities.kill -> DynamicEntities.spawn",
  func: (timer) => {
    const entities = new DynamicEntities();
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.kill(i);
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "FixedEntities.spawn",
  func: (timer) => {
    const entities = new FixedEntities(count);

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "FixedEntities.kill",
  func: (timer) => {
    const entities = new FixedEntities(count);
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.kill(i);
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "FixedEntities.kill -> FixedEntities.spawn",
  func: (timer) => {
    const entities = new FixedEntities(count);
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.kill(i);
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "GrowableEntities.spawn",
  func: (timer) => {
    const entities = new GrowableEntities(count);

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "GrowableEntities.spawn x 2",
  func: (timer) => {
    const entities = new GrowableEntities(count);

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.spawn();
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "GrowableEntities.kill",
  func: (timer) => {
    const entities = new GrowableEntities(count);
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.kill(i);
    }
    timer.stop();
  },
  runs,
});

bench({
  name: "GrowableEntities.kill -> GrowableEntities.spawn",
  func: (timer) => {
    const entities = new GrowableEntities(count);
    for (let i = 0; i < count; i++) {
      entities.spawn();
    }

    timer.start();
    for (let i = 0; i < count; i++) {
      entities.kill(i);
      entities.spawn();
    }
    timer.stop();
  },
  runs,
});

runBenchmarks();
