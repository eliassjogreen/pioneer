import {
  Engine,
  Entity,
  EntityScript,
  EntityScriptSystem,
  PaneBuffer,
  PaneEvents,
  PaneSystem,
  Scene,
} from "./deps.ts";

const scene = new Scene("main");

const entity = new Entity("test_entity");
entity.components.add(new PaneEvents());
const buffer = new PaneBuffer(500 * 500 * 4);
entity.components.add(buffer);
const script = new EntityScript();

script.update = (self, delta) => {
  self.components.get(PaneBuffer).buffer = self.components.get(PaneBuffer)
    .buffer.map(() => Math.random() * 255);
};
entity.components.add(script);

scene.entities.add(entity);

scene.systems.add(new PaneSystem(500, 500));
scene.systems.add(new EntityScriptSystem());

const engine = new Engine({ scene, target: 100 });

engine.start();
