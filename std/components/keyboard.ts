import { Component } from "../../engine/mod.ts";

export class Keyboard extends Component {
  pressed: Set<string> = new Set();
  justPressed: Set<string> = new Set();
  justReleased: Set<string> = new Set();
}
