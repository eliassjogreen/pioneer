import { Component, Engine, Entity, Scene } from "../engine/mod.ts";
import { Watch, WatchSystem } from "../std/mod.ts";

const scene = new Scene("test");
scene.systems.add(new WatchSystem());

const a = new Entity("a");
a.components.add(new Watch());
a.components.add(
  new class TestComponent extends Component {
    value = Math.random();
    static a = 123;
  }(),
);

scene.entities.add(a);

const e = new Engine({ scene });

e.start();

setInterval(() => console.log(e.delta), 500);
