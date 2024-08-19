import p5_ from "p5";

declare global {
  var p5: typeof p5_;
}

globalThis.p5 = p5_;
