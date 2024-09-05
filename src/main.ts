import './style.css';

import { p5 } from './p5';

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

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
}, document.querySelector<HTMLDivElement>('#app')!);
