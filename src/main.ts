import hexRgb from 'hex-rgb';
import { p5 } from './p5';

import './style.css';

import BIZUDPGothic_BoldSrc from './assets/BIZUDPGothic-Bold.ttf';
import SUSE_BoldSrc from './assets/SUSE-Bold.ttf';

let BIZUDPGothic_Bold: p5.Font;
let SUSE_Bold: p5.Font;

let count = 0;

const colors = {
  red: '#e03131',
  blue: '#1971c2',
  yellow: '#f08c00',
  green: '#2f9e44',
  white: '#ffffff',
  black: '#141414',
} as const;

new p5((p: p5) => {
  p.preload = () => {
    BIZUDPGothic_Bold = p.loadFont(BIZUDPGothic_BoldSrc);
    SUSE_Bold = p.loadFont(SUSE_BoldSrc);
  };

  p.setup = () => {
    p.createCanvas(1920, 1080);
  };

  p.draw = () => {
    p.clear();
    p.strokeWeight(0);

    // 赤チーム
    drawRect(p, 0, 0, 600, 100, colors.red);
    drawRect(p, 0, 100, 600, 200, `${colors.white}cc`, [0, 0, 80, 0]);
    drawRect(p, 600 - 160, 100, 160, 80, colors.yellow, [0, 0, 0, 20]); // yellow 8
    drawText(p, 'R.U.R (農工大)', 20, 50, {
      size: 40,
      horizAlign: p.LEFT,
      vertAlign: p.CENTER,
      color: colors.white,
      font: BIZUDPGothic_Bold,
    });
    drawText(p, '15', 250, 200 - 20, {
      size: 120,
      horizAlign: p.CENTER,
      vertAlign: p.CENTER,
      color: colors.black,
      font: SUSE_Bold,
    });
    drawText(p, '手動', 600 - 80, 136, {
      size: 50,
      horizAlign: p.CENTER,
      vertAlign: p.CENTER,
      color: colors.white,
      font: BIZUDPGothic_Bold,
    });

    // 青チーム
    drawRect(p, p.width - 600, 0, 600, 100, colors.blue);
    drawRect(
      p,
      p.width - 600,
      100,
      600,
      200,
      `${colors.white}cc`,
      [0, 0, 0, 80],
    );
    drawRect(p, p.width - 600, 100, 160, 80, colors.green, [0, 0, 20, 0]);
    drawText(p, 'R.U.R (農工大)', p.width - 20, 50, {
      size: 40,
      horizAlign: p.RIGHT,
      vertAlign: p.CENTER,
      color: colors.white,
      font: BIZUDPGothic_Bold,
    });
    drawText(p, '30', p.width - 250, 200 - 20, {
      size: 120,
      horizAlign: p.CENTER,
      vertAlign: p.CENTER,
      color: colors.black,
      font: SUSE_Bold,
    });
    drawText(p, '自動', p.width - 600 + 80, 136, {
      size: 50,
      horizAlign: p.CENTER,
      vertAlign: p.CENTER,
      color: colors.white,
      font: BIZUDPGothic_Bold,
    });

    // 中央タイマーなど
    drawRect(
      p,
      p.width / 2 - 250,
      0,
      500,
      200,
      `${colors.black}ee`,
      [0, 0, 20, 20],
    );
    drawText(p, '1:23', p.width / 2, 100 - 20, {
      size: 120,
      horizAlign: p.CENTER,
      vertAlign: p.CENTER,
      color: colors.white,
      font: SUSE_Bold,
    });
    // ポール
    drawCircle(p, p.width / 2 + 250 - 40, 40, 20, colors.red);
    drawCircle(p, p.width / 2 + 250 - 40, 100, 20, colors.blue);
    drawCircle(p, p.width / 2 + 250 - 40, 160, 20, colors.red);

    // 下部インフォメーション
    drawRect(p, 0, p.height - 150, p.width, 150, colors.white);
    drawText(p, '予選 第1試合 試合中', 20, p.height - 75, {
      size: 50,
      horizAlign: p.LEFT,
      vertAlign: p.CENTER,
      color: colors.black,
      font: BIZUDPGothic_Bold,
    });
    count++;
  };

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
}, document.querySelector<HTMLDivElement>('#app')!);

function drawRect(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  br?: [number, number, number, number],
) {
  const { red, green, blue, alpha } = hexRgb(color);
  p.fill(red, green, blue, 255 * alpha);
  if (br) {
    p.rect(x, y, w, h, ...br);
  } else {
    p.rect(x, y, w, h);
  }
}

function drawCircle(p: p5, x: number, y: number, r: number, color: string) {
  const { red, green, blue, alpha } = hexRgb(color);
  p.fill(red, green, blue, 255 * alpha);
  p.circle(x, y, r * 2);
}

function drawText(
  p: p5,
  text: string,
  x: number,
  y: number,
  options: {
    size: number;
    horizAlign: p5.HORIZ_ALIGN;
    vertAlign: p5.VERT_ALIGN;
    color: string;
    font: p5.Font;
  },
) {
  const { red, green, blue, alpha } = hexRgb(options.color);
  p.textSize(options.size);
  p.textAlign(options.horizAlign, options.vertAlign);
  p.fill(red, green, blue, 255 * alpha);
  p.textFont(options.font);
  p.text(text, x, y);
}
