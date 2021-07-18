import { Component } from "../../engine/mod.ts";

export class Watch extends Component {
  exclude: Set<string> = new Set(["Watch"]);
  state: Map<string, number> = new Map();
  changed = false;
  changes: Set<Component> = new Set();
}
