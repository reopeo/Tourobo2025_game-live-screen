import "./style.css";

import { p5 } from "./p5";
import * as ROSLIB from "@tier4/roslibjs-foxglove";

let count = 0;

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(1920, 1080);
    p.textSize(100);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = () => {
    p.clear();
    p.text(count.toString(), p.width / 2, p.height / 2);
    count++;
  };
}, document.querySelector<HTMLDivElement>("#app")!);
