import { Config, MaxRepsData, DAYS, Exercise, DailySets } from '../types';
import { DateService } from './DateService';

const GTG_PREFIX = 'gtg_';

const CONFIG_KEY = `${GTG_PREFIX}config`;
const SETS_KEY_PREFIX = `${GTG_PREFIX}sets_`;
const MAX_REPS_KEY = `${GTG_PREFIX}max_reps`;
const MOCK_DATE_KEY = `${GTG_PREFIX}dev_mock_date`;

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

  static clearDailySets(date: string) {
    localStorage.removeItem(SETS_KEY_PREFIX + date)
  }

  static saveDailySets(date: string, dailySets: DailySets) {
    localStorage.setItem(SETS_KEY_PREFIX + date, JSON.stringify(dailySets))
  }

  static getDailySets(date: string): DailySets | null {
    const saved = localStorage.getItem(SETS_KEY_PREFIX + date);
    return saved ? JSON.parse(saved) : null;
  }

  static getAllDailySets(): {[date: string]: DailySets} {
    const allSets: {[date: string]: DailySets} = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(SETS_KEY_PREFIX)) {
        const date = key.replace(SETS_KEY_PREFIX, '');
        allSets[date] = JSON.parse(localStorage.getItem(key) || '[]');
      }
    }

    return allSets;
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

  static clearAllData(): void {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
          if (key.startsWith(GTG_PREFIX)) {
              localStorage.removeItem(key);
          }
      });
  }

  static updateMaxReps(exercise: string, newMax: number, forceUpdate: boolean = false): void {
    const data = this.getMaxRepsData();
    const now = DateService.getCurrentDate().toISOString();

    if (!data[exercise]) {
      data[exercise] = {
        currentMax: 0,
        lastUpdated: '',
        history: []
      };
    }

    // Update if it's actually a new max or if forced
    if (newMax > data[exercise].currentMax || forceUpdate) {
      // Add to history if this is a new max
      if (newMax > data[exercise].currentMax) {
        data[exercise].history.push({
          date: now,
          maxReps: newMax
        });
      }

      // Update current max and last updated
      data[exercise].currentMax = newMax;
      data[exercise].lastUpdated = now;

      this.saveMaxRepsData(data);
    }
  }

    static setMockDate(date: Date) {
        localStorage.setItem(MOCK_DATE_KEY, date.toISOString());
    }

    static getMockDate(): Date | null {
        const mockDateString = localStorage.getItem(MOCK_DATE_KEY);
        return mockDateString && new Date(mockDateString) || null;
    }

    static clearMockDate() {
        localStorage.removeItem(MOCK_DATE_KEY);
    }
}
