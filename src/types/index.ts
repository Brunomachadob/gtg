export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const EXERCISES = ['Pull Ups', 'Dips', 'Rest'] as const;

export type Exercise = typeof EXERCISES[number] | '';

export interface Config {
  days: Exercise[];
  sets: number;
  reminderIntervalMinutes: number;
  // Max reps goals for each exercise
  goals: {
    pullUps: number;
    dips: number;
  };
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
  // Exercise-specific statistics
  exerciseStats: {
    pullUps: {
      daily: { [date: string]: number };
      weekly: number;
      monthly: number;
      streak: number;
      bonusDays: number;
      averageBonusSets: number;
    };
    dips: {
      daily: { [date: string]: number };
      weekly: number;
      monthly: number;
      streak: number;
      bonusDays: number;
      averageBonusSets: number;
    };
  };
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

export type PageType = 'today' | 'stats' | 'about' | 'developer';
