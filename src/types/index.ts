export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const EXERCISES = ['Pull Ups', 'Dips', 'Rest'] as const;
export type Exercise = typeof EXERCISES[number] | '';

export type PageType = 'today' | 'stats' | 'about' | 'developer';

export interface Config {
  days: Exercise[];
  sets: number;
  reminderIntervalMinutes: number;
  goals: {
    pullUps: number;
    dips: number;
  };
}

export interface DailySets {
  exercise: Exercise;
  sets: number[];
}

export interface Stats {
  weekly: number;
  monthly: number;
  streak: number;
  bonusDays: number;
  bonusSets: number;
  averageBonusSets: number;
}

export interface Statistics {
  total: Stats;
  pullUps: Stats;
  dips: Stats;
  overtime: Array<{
    date: string,
    pullUps: number,
    dips: number,
    dayMonth: string,
  }>
}

export interface MaxRepsData {
  [exercise: string]: {
    currentMax: number;
    lastUpdated: string; // ISO date string
    history: {
      date: string;
      maxReps: number;
    }[];
  };
}


