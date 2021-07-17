import { Component } from "../../engine/mod.ts";
import { Vector2 } from "../deps.ts";

export class Mouse extends Component {
  position: Vector2 = Vector2.zero();

  buttons: Set<number> = new Set();
  left = false;
  middle = false;
  right = false;
}
