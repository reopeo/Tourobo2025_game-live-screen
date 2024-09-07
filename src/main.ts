import * as ROSLIB from '@tier4/roslibjs-foxglove';
import hexRgb from 'hex-rgb';
import p5 from 'p5';
import { Color, UnivShortName } from './consts';
import { type Match, type Time, Winner } from './msg';

import './style.css';

import BIZUDPGothic_BoldSrc from './assets/BIZUDPGothic-Bold.ttf';
import SUSE_BoldSrc from './assets/SUSE-Bold.ttf';

let BIZUDPGothic_Bold: p5.Font;
let SUSE_Bold: p5.Font;

let match: Match | null = null;
let timeDelta = 0;

let rosConnected = false;
function rosConnect() {
  if (!rosConnected) {
    const ros = new ROSLIB.Ros({ url: `ws://${location.hostname}:8765` });

    ros.on('connection', () => {
      console.log('connected');
      rosConnected = true;
      const matchSub = new ROSLIB.Topic<Match>({
        ros,
        name: '/match/status',
        messageType: 'game_state_interfaces/msg/Match',
      });
      matchSub.subscribe((msg) => {
        match = msg;
      });

      const clockSub = new ROSLIB.Topic<Time>({
        ros,
        name: '/match/clock',
        messageType: 'builtin_interfaces/msg/Time',
      });
      clockSub.subscribe((msg) => {
        timeDelta = rosTimeToMs(msg) - Date.now();
      });
    });

    ros.on('close', () => {
      console.log('closed');
      rosConnected = false;
    });

    ros.on('error', (error) => {
      console.error(error);
      rosConnected = false;
    });
  }
}
rosConnect();
setInterval(rosConnect, 5000);

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
    // 下部
    drawRect(p, Color.white, 0, p.height - 150, p.width, 150);

    if (!match) {
      drawText(
        p,
        Color.black,
        BIZUDPGothic_Bold,
        50,
        p.LEFT,
        p.CENTER,
        'とうロボ2024 - トーナメント表・試合結果は概要欄から！',
        20,
        p.height - 78,
      );
      if (rosConnected) {
        p.fill('green');
      } else {
        p.fill('red');
      }
      p.circle(p.width / 2 - 250 + 20, 20, 40);
      return;
    }

    drawText(
      p,
      Color.black,
      BIZUDPGothic_Bold,
      50,
      p.LEFT,
      p.CENTER,
      `とうロボ2024${match.title ? ` - ${match.title}` : ''} - ${`${match.winner === Winner.RED ? '赤ゾーン側の勝利' : match.winner === Winner.BLUE ? '青ゾーン側の勝利' : isRosTimeZero(match.start_time) ? '試合開始前' : isRosTimeZero(match.end_time) ? '試合中' : '判定中'}`}`,
      20,
      p.height - 100,
    );
    drawText(
      p,
      Color.black,
      BIZUDPGothic_Bold,
      42,
      p.LEFT,
      p.CENTER,
      'トーナメント表・試合結果は概要欄から！',
      20,
      p.height - 40,
    );

    // 赤チーム
    drawRect(p, Color.red, 0, 0, 600, 100);
    drawRect(p, `${Color.white}cc`, 0, 100, 600, 200, 0, 0, 50, 0);
    drawRect(
      p,
      match.red_team.is_auto ? Color.green : Color.yellow,
      600 - 160,
      100,
      160,
      70,
    );
    drawRect(p, Color.white, 600 - 160, 170, 160, 70, 0, 0, 0, 20);
    drawText(
      p,
      Color.white,
      BIZUDPGothic_Bold,
      38,
      p.LEFT,
      p.CENTER,
      `${match.red_team.name}${UnivShortName[match.red_team.university] ? ` (${UnivShortName[match.red_team.university]})` : ''}`,
      20,
      48,
    );
    if (match.red_team.v_goal) {
      drawText(
        p,
        Color.black,
        SUSE_Bold,
        100,
        p.CENTER,
        p.CENTER,
        'V GOAL',
        225,
        150,
      );
      drawText(
        p,
        Color.black,
        SUSE_Bold,
        70,
        p.CENTER,
        p.CENTER,
        `${msToText(rosTimeToMs(match.end_time) - rosTimeToMs(match.start_time))}`,
        225,
        240,
      );
    } else {
      drawText(
        p,
        Color.black,
        SUSE_Bold,
        120,
        p.CENTER,
        p.CENTER,
        `${match.red_team.score}`,
        225,
        180,
      );
    }
    drawText(
      p,
      Color.white,
      BIZUDPGothic_Bold,
      38,
      p.CENTER,
      p.CENTER,
      match.red_team.is_auto ? '自動' : '手動',
      600 - 80,
      133,
    );
    drawText(
      p,
      Color.black,
      BIZUDPGothic_Bold,
      38,
      p.CENTER,
      p.CENTER,
      match.red_team.immigration ? '入国済' : '未入国',
      600 - 80,
      203,
    );

    // 青チーム
    drawRect(p, Color.blue, p.width - 600, 0, 600, 100);
    drawRect(p, `${Color.white}cc`, p.width - 600, 100, 600, 200, 0, 0, 0, 50);
    drawRect(
      p,
      match.blue_team.is_auto ? Color.green : Color.yellow,
      p.width - 600,
      100,
      160,
      70,
    );
    drawRect(p, Color.white, p.width - 600, 170, 160, 70, 0, 0, 20, 0);
    drawText(
      p,
      Color.white,
      BIZUDPGothic_Bold,
      38,
      p.RIGHT,
      p.CENTER,
      `${match.blue_team.name}${UnivShortName[match.blue_team.university] ? ` (${UnivShortName[match.blue_team.university]})` : ''}`,
      p.width - 20,
      48,
    );
    if (match.blue_team.v_goal) {
      drawText(
        p,
        Color.black,
        SUSE_Bold,
        100,
        p.CENTER,
        p.CENTER,
        'V GOAL',
        p.width - 225,
        150,
      );
      drawText(
        p,
        Color.black,
        SUSE_Bold,
        70,
        p.CENTER,
        p.CENTER,
        `${msToText(rosTimeToMs(match.end_time) - rosTimeToMs(match.start_time))}`,
        p.width - 225,
        240,
      );
    } else {
      drawText(
        p,
        Color.black,
        SUSE_Bold,
        120,
        p.CENTER,
        p.CENTER,
        `${match.blue_team.score}`,
        p.width - 225,
        180,
      );
    }
    drawText(
      p,
      Color.white,
      BIZUDPGothic_Bold,
      38,
      p.CENTER,
      p.CENTER,
      match.blue_team.is_auto ? '自動' : '手動',
      p.width - 600 + 80,
      133,
    );
    drawText(
      p,
      Color.black,
      BIZUDPGothic_Bold,
      38,
      p.CENTER,
      p.CENTER,
      match.red_team.immigration ? '入国済' : '未入国',
      p.width - 600 + 80,
      203,
    );

    // 中央タイマーなど
    drawRect(
      p,
      `${Color.black}ee`,
      p.width / 2 - 250,
      0,
      500,
      200,
      0,
      0,
      20,
      20,
    );
    drawText(
      p,
      Color.white,
      SUSE_Bold,
      120,
      p.CENTER,
      p.CENTER,
      isRosTimeZero(match.start_time)
        ? `${msToText(rosTimeToMs(match.start_time))}`
        : !isRosTimeZero(match.end_time)
          ? `${msToText(rosTimeToMs(match.end_time) - rosTimeToMs(match.start_time))}`
          : `${msToText(Date.now() - rosTimeToMs(match.start_time) + timeDelta)}`,
      p.width / 2,
      80,
    );
    // ポール
    drawCircle(
      p,
      match.red_team.type_1_a
        ? Color.red
        : match.blue_team.type_1_b
          ? Color.blue
          : Color.white,
      p.width / 2 + 250 - 40,
      40,
      40,
    );
    drawCircle(
      p,
      match.red_team.type_2
        ? Color.red
        : match.blue_team.type_2
          ? Color.blue
          : Color.white,
      p.width / 2 + 250 - 40,
      100,
      40,
    );
    drawCircle(
      p,
      match.red_team.type_1_b
        ? Color.red
        : match.blue_team.type_1_a
          ? Color.blue
          : Color.white,
      p.width / 2 + 250 - 40,
      160,
      40,
    );

    if (rosConnected) {
      p.fill('green');
    } else {
      p.fill('red');
    }
    p.circle(p.width / 2 - 250 + 20, 20, 40);
  };

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
}, document.querySelector<HTMLDivElement>('#app')!);

function fillWithHex(p: p5, color: string) {
  const { red, green, blue, alpha } = hexRgb(color);
  p.fill(red, green, blue, 255 * alpha);
}

function drawRect(
  p: p5,
  color: string,
  x: number,
  y: number,
  w: number,
  h: number,
  tl?: number,
  tr?: number,
  br?: number,
  bl?: number,
) {
  fillWithHex(p, color);
  p.rect(x, y, w, h, tl, tr, br, bl);
}

function drawCircle(p: p5, color: string, x: number, y: number, d: number) {
  fillWithHex(p, color);
  p.circle(x, y, d);
}

function drawText(
  p: p5,
  color: string,
  font: p5.Font,
  size: number,
  horizAlign: p5.HORIZ_ALIGN,
  vertAlign: p5.VERT_ALIGN,
  str: string,
  x: number,
  y: number,
) {
  fillWithHex(p, color);
  p.textFont(font, size);
  p.textAlign(horizAlign, vertAlign);
  p.text(str, x, y);
}

function rosTimeToMs(time: Time) {
  return time.sec * 1000 + (time.nanosec ?? time.nsec ?? 0) / 1000000;
}

function isRosTimeZero(time: Time) {
  return time.sec === 0 && (time.nanosec ?? time.nsec ?? 0) === 0;
}

function msToText(ms: number) {
  const sec = Math.floor(ms / 1000);
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
}
