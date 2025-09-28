import { Config, SessionData, DAYS } from '../types';

const CONFIG_KEY = 'gtg_config';
const SESSION_KEY_PREFIX = 'gtg_sessions_';

export class StorageService {
  static getConfig(): Config {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const config = JSON.parse(saved);
      // Add default reminderIntervalMinutes if it doesn't exist (for backward compatibility)
      return {
        ...config,
        reminderIntervalMinutes: config.reminderIntervalMinutes ?? 0
      };
    }
    return {
      days: DAYS.map(() => 'Pull Ups'),
      sets: 5,
      reminderIntervalMinutes: 0,
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
}
