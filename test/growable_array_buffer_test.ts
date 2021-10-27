import { assertEquals } from "./deps.ts";
import {
  GrowableArrayBuffer,
} from "../core/growable_array_buffer.ts";

const inital = 8;

Deno.test({
  name: "GrowableArrayBuffer.grow",
  fn(): void {
    const buffer = new GrowableArrayBuffer(inital);

    assertEquals(buffer.buffer.byteLength, inital);
    assertEquals(buffer.uint8array.byteLength, inital);

    buffer.grow();

    assertEquals(buffer.buffer.byteLength, inital * 2);
    assertEquals(buffer.uint8array.byteLength, inital * 2);
  },
});

Deno.test({
  name: "GrowableArrayBuffer.uint8array",
  fn(): void {
    const buffer = new GrowableArrayBuffer(inital);

    assertEquals(buffer.uint8array[0], 0);
    buffer.uint8array[0] = 255;
    assertEquals(buffer.uint8array[0], 255);

    buffer.grow();
    
    assertEquals(buffer.uint8array[0], 255);
    buffer.uint8array[0] = 0;
    assertEquals(buffer.uint8array[0], 0);
  },
});
