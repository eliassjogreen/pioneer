import { decode } from "./deps.ts";

const source = decode(
  "AGFzbQEAAAABBgFgAX8BfwMCAQAFAwEAAQcSAgZtZW1vcnkCAAVmbnYxYQAACjMBMQECf0HFu/KIeCECA0AgAiABLQAAc0GTg4AIbCECIAFBAWohASAAQX9qIgANAAsgAgs=",
);
const { instance } = await WebAssembly.instantiate(source);

export function fnv1a(buf: ArrayLike<number> & { byteLength: number }): number {
  new Uint8Array((instance.exports.memory as WebAssembly.Memory).buffer).set(
    buf,
  );
  return (instance.exports.fnv1a as (len: number) => number)(buf.byteLength) >>>
    0;
}
