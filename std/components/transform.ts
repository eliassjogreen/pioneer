import { Component } from "../../engine/mod.ts";
import { Vector2 } from "../vector2.ts";

export class Transform extends Component {
  position = Vector2.zero();
  rotation = 0;
}
