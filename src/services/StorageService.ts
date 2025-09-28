import { Config, SessionData, MaxRepsData, DAYS, Exercise } from '../types';

const CONFIG_KEY = 'gtg_config';
const SESSION_KEY_PREFIX = 'gtg_sessions_';
const MAX_REPS_KEY = 'gtg_max_reps';

export class StorageService {
  static getConfig(): Config {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const config = JSON.parse(saved);
      // Add defaults for backward compatibility
      return {
        ...config,
        reminderIntervalMinutes: config.reminderIntervalMinutes ?? 0,
        goals: config.goals ?? {
          pullUps: 20,
          dips: 30
        }
      };
    }
    return {
      days: DAYS.map(() => '' as Exercise), // Empty schedule initially
      sets: 5,
      reminderIntervalMinutes: 0,
      goals: {
        pullUps: 20,
        dips: 30
      }
    };
  }

  static saveConfig(config: Config): void {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  static getSessionData(date: string): number[] {
    const saved = localStorage.getItem(SESSION_KEY_PREFIX + date);
    return saved ? JSON.parse(saved) : [];
  }

  static saveSessionData(date: string, data: number[]): void {
    localStorage.setItem(SESSION_KEY_PREFIX + date, JSON.stringify(data));
  }

  static getAllSessions(): SessionData {
    const sessions: SessionData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(SESSION_KEY_PREFIX)) {
        const date = key.replace(SESSION_KEY_PREFIX, '');
        sessions[date] = JSON.parse(localStorage.getItem(key) || '[]');
      }
    }
    return sessions;
  }

  static getMaxRepsData(): MaxRepsData {
    const saved = localStorage.getItem(MAX_REPS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      'Pull Ups': {
        currentMax: 0,
        lastUpdated: '',
        history: []
      },
      'Dips': {
        currentMax: 0,
        lastUpdated: '',
        history: []
      }
    };
  }

  static saveMaxRepsData(data: MaxRepsData): void {
    localStorage.setItem(MAX_REPS_KEY, JSON.stringify(data));
  }

  static updateMaxReps(exercise: string, newMax: number): void {
    const data = this.getMaxRepsData();
    const now = new Date().toISOString();

    if (!data[exercise]) {
      data[exercise] = {
        currentMax: 0,
        lastUpdated: '',
        history: []
      };
    }

    // Only update if it's actually a new max
    if (newMax > data[exercise].currentMax) {
      // Add to history
      data[exercise].history.push({
        date: now,
        maxReps: newMax
      });

      // Update current max
      data[exercise].currentMax = newMax;
      data[exercise].lastUpdated = now;

      this.saveMaxRepsData(data);
    }
  }
}
