import { Component } from "../../engine/mod.ts";
import { Angle, Rad } from "../deps.ts";

export class Arc extends Component {
  radius = 1;
  startAngle: Angle = new Rad();
  endAngle: Angle = new Rad(Rad.turn);
  clockwise = true;
}
