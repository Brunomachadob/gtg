import { useState, useEffect } from 'react';
import { Statistics } from '../types';
import { StorageService } from '../services/StorageService';

export function useStatistics(): Statistics {
  const [stats, setStats] = useState<Statistics>({
    daily: {},
    weekly: 0,
    monthly: 0,
    streak: 0,
    bonusDays: 0,
    averageBonusSets: 0,
  });

  useEffect(() => {
    const sessions = StorageService.getAllSessions();
    const config = StorageService.getConfig();

    // Calculate daily totals
    const daily: { [date: string]: number } = {};
    Object.entries(sessions).forEach(([date, sets]) => {
      daily[date] = sets.reduce((a: number, b: number) => a + b, 0);
    });

    // Calculate weekly, monthly totals, bonus days, and average bonus sets
    const now = new Date();
    let weekly = 0, monthly = 0;
    let streakCount = 0;
    let bonusDaysCount = 0;
    let totalBonusSets = 0;

    for (let d = 0; d < 31; d++) {
      const dt = new Date(now);
      dt.setDate(now.getDate() - d);
      const key = dt.toISOString().slice(0, 10);
      const reps = daily[key] || 0;
      const setsArray = sessions[key] || [];
      const completedSets = setsArray.filter(r => r > 0).length;

      if (d < 7) weekly += reps;
      monthly += reps;

      // Check if this day had bonus sets (more than the configured minimum)
      if (completedSets > config.sets) {
        bonusDaysCount++;
        totalBonusSets += (completedSets - config.sets);
      }

      // Streak: count consecutive days with all minimum sets done
      if (sessions[key] && setsArray.slice(0, config.sets).every((r: number) => r > 0)) {
        streakCount++;
      } else if (d === 0) {
        // If today is not complete, streak is 0
        streakCount = 0;
        break;
      } else {
        // If any previous day breaks the streak, stop counting
        break;
      }
    }

    // Calculate average bonus sets (avoid division by zero)
    const averageBonusSets = bonusDaysCount > 0 ? Math.round((totalBonusSets / bonusDaysCount) * 10) / 10 : 0;

    setStats({ daily, weekly, monthly, streak: streakCount, bonusDays: bonusDaysCount, averageBonusSets });
  }, []);

  return stats;
}
