import { Component } from "../../engine/mod.ts";

export class PaneBuffer extends Component {
  buffer: Uint8Array;

  constructor(size: number) {
    super();
    
    this.buffer = new Uint8Array(size);
  }
}
