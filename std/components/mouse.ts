import { Component } from "../../engine/mod.ts";
import { Point } from "../common.ts";

export class Mouse extends Component {
  position: Point = { x: 0, y: 0 };

  buttons: Set<number> = new Set();
  left = false;
  middle = false;
  right = false;
}
