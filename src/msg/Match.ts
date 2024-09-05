import type { Team, Time } from '.';

export const Winner = {
  RED: 0,
  BLUE: 1,
  UNKNOWN: 2,
} as const;

export interface Match {
  id: string;
  title: string;

  start_time: Time;
  end_time: Time;

  red_team: Team;
  blue_team: Team;

  winner: (typeof Winner)[keyof typeof Winner];
}
