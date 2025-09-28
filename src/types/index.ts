export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const EXERCISES = ['Pull Ups', 'Dips', 'Rest'] as const;

export type Exercise = typeof EXERCISES[number];
export type DayOfWeek = typeof DAYS[number];

export interface Config {
  days: Exercise[];
  sets: number;
  reminderIntervalMinutes: number;
}

export interface SessionData {
  [date: string]: number[];
}

export interface Statistics {
  daily: { [date: string]: number };
  weekly: number;
  monthly: number;
  streak: number;
  bonusDays: number;
  averageBonusSets: number;
}

export type PageType = 'today' | 'config' | 'stats';
