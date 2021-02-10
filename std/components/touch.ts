import { Component } from "../../engine/mod.ts";
import { Point } from "../common.ts";

export class Touch extends Component {
  touches: Map<number, Point> = new Map();
  changed: Map<number, Point> = new Map();
}
