import { Component } from "../../engine/mod.ts";
import { Point2 } from "../deps.ts";

export class Mouse extends Component {
  position: Point2 = { x: 0, y: 0 };

  buttons: Set<number> = new Set();
  left = false;
  middle = false;
  right = false;
}
