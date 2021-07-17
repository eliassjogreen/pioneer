import { Component } from "../../engine/mod.ts";
import { Vector2 } from "../deps.ts";

export class Touch extends Component {
  touches: Map<number, Vector2> = new Map();
  changed: Map<number, Vector2> = new Map();
}
