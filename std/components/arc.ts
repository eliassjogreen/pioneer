import { Component } from "../../engine/mod.ts";

export class Arc extends Component {
  radius = 1;
  startAngle = 0;
  endAngle = 2 * Math.PI;
  clockwise = true;
}
