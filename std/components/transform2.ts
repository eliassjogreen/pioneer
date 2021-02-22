import { Component } from "../../engine/mod.ts";
import { Angle, Rad, Vector2 } from "../deps.ts";

export class Transform2 extends Component {
  position: Vector2 = Vector2.zero();
  rotation: Angle = new Rad();
}
