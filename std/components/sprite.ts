import { Component } from "../../engine/mod.ts";

export class Sprite extends Component {
  data: Uint8ClampedArray;
  width: number;
  height: number;

  constructor(data: Uint8ClampedArray, width: number, height: number) {
    super();

    this.data = data;
    this.width = width;
    this.height = height;
  }
}
