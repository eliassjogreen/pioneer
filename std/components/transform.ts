import { Component } from "../../engine/mod.ts";
import { Vector2 } from "../deps.ts";

export class Transform extends Component {
  position = Vector2.zero();
  rotation = 0;
}
