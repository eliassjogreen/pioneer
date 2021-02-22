import { Component } from "../../engine/mod.ts";
import { Point2 } from "../deps.ts";

export class Touch extends Component {
  touches: Map<number, Point2> = new Map();
  changed: Map<number, Point2> = new Map();
}
