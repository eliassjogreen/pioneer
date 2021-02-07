# Pioneer

---

> ⚠️ Work in progress. Expect breaking changes.

---

A work in progress [ECS](https://en.wikipedia.org/wiki/Entity_component_system)
game engine with both browser and
[native support](https://github.com/denosaurs/pane) that works in deno.

## To do

### Rendering and rendering systems

- [ ] 2d - perhaps using [canvas](https://deno.land/x/canvas@v.1.0.5) if
  performant, otherwise a less bloated (wasm?) implementation may be used. will
  probably be deprecated in the future
- [ ] 2d and 3d - webgpu for deno, requires
  [#7977](https://github.com/denoland/deno/pull/7977)
- [ ] 2d and 3d - webgl/webgl2 for browsers

## Maintainers

- Elias Sjögreen ([@eliassjogreen](https://github.com/eliassjogreen))

## Other

### Related

- [pane](https://github.com/denosaurs/pane)
- [Prime Engine](https://gitlab.com/luxoral-prime/engine)
- [ecsy](https://github.com/ecsyjs/ecsy)
- [bevy](https://bevyengine.org/)

### Licence

Copyright 2020, Elias Sjögreen. All rights reserved. MIT license.
