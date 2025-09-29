import { useState, useEffect } from 'react';
import { Statistics } from '../types';
import { StorageService } from '../services/StorageService';
import { DateService } from '../services/DateService';

export function useStatistics(): Statistics {
  const [stats, setStats] = useState<Statistics>({
    daily: {},
    weekly: 0,
    monthly: 0,
    streak: 0,
    bonusDays: 0,
    averageBonusSets: 0,
    exerciseStats: {
      pullUps: {
        daily: {},
        weekly: 0,
        monthly: 0,
        streak: 0,
        bonusDays: 0,
        averageBonusSets: 0,
      },
      dips: {
        daily: {},
        weekly: 0,
        monthly: 0,
        streak: 0,
        bonusDays: 0,
        averageBonusSets: 0,
      },
    },
  });

  useEffect(() => {
    const sessions = StorageService.getAllSessions();
    const config = StorageService.getConfig();

    // Calculate daily totals
    const daily: { [date: string]: number } = {};
    const pullUpsDaily: { [date: string]: number } = {};
    const dipsDaily: { [date: string]: number } = {};

    Object.entries(sessions).forEach(([date, sets]) => {
      const totalReps = sets.reduce((a: number, b: number) => a + b, 0);
      daily[date] = totalReps;

      // Determine exercise type for this date
      const dateObj = new Date(date);
      const dayIndex = dateObj.getDay();
      const exerciseType = config.days[dayIndex];

      if (exerciseType === 'Pull Ups') {
        pullUpsDaily[date] = totalReps;
      } else if (exerciseType === 'Dips') {
        dipsDaily[date] = totalReps;
      }
    });

    // Helper function to calculate stats for a specific exercise
    const calculateExerciseStats = (exerciseType: 'Pull Ups' | 'Dips', dailyData: { [date: string]: number }) => {
      const now = DateService.getCurrentDate();
      let weekly = 0, monthly = 0;
      let streakCount = 0;
      let bonusDaysCount = 0;
      let totalBonusSets = 0;

      for (let d = 0; d < 31; d++) {
        const dt = new Date(now);
        dt.setDate(now.getDate() - d);
        const key = dt.toISOString().slice(0, 10);
        const dayIndex = dt.getDay();
        const configuredExercise = config.days[dayIndex];

        // Only count stats for days that match this exercise type
        if (configuredExercise === exerciseType) {
          const reps = dailyData[key] || 0;
          const setsArray = sessions[key] || [];
          const completedSets = setsArray.filter(r => r > 0).length;

          if (d < 7) weekly += reps;
          monthly += reps;

          // Check if this day had bonus sets
          if (completedSets > config.sets) {
            bonusDaysCount++;
            totalBonusSets += (completedSets - config.sets);
          }

          // Streak: count consecutive exercise days with all minimum sets done
          if (sessions[key] && setsArray.slice(0, config.sets).every((r: number) => r > 0)) {
            streakCount++;
          } else if (d === 0 && configuredExercise === exerciseType) {
            // If today is this exercise type and not complete, streak is 0
            streakCount = 0;
            break;
          } else {
            // If any previous day of this exercise type breaks the streak, stop counting
            break;
          }
        }
      }

      const averageBonusSets = bonusDaysCount > 0 ? Math.round((totalBonusSets / bonusDaysCount) * 10) / 10 : 0;

      return {
        daily: dailyData,
        weekly,
        monthly,
        streak: streakCount,
        bonusDays: bonusDaysCount,
        averageBonusSets,
      };
    };

    // Calculate overall stats (existing logic)
    const now = DateService.getCurrentDate();
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

      if (completedSets > config.sets) {
        bonusDaysCount++;
        totalBonusSets += (completedSets - config.sets);
      }

      if (sessions[key] && setsArray.slice(0, config.sets).every((r: number) => r > 0)) {
        streakCount++;
      } else if (d === 0) {
        streakCount = 0;
        break;
      } else {
        break;
      }
    }

    const averageBonusSets = bonusDaysCount > 0 ? Math.round((totalBonusSets / bonusDaysCount) * 10) / 10 : 0;

    // Calculate exercise-specific stats
    const pullUpsStats = calculateExerciseStats('Pull Ups', pullUpsDaily);
    const dipsStats = calculateExerciseStats('Dips', dipsDaily);

    setStats({
      daily,
      weekly,
      monthly,
      streak: streakCount,
      bonusDays: bonusDaysCount,
      averageBonusSets,
      exerciseStats: {
        pullUps: pullUpsStats,
        dips: dipsStats,
      },
    });
  }, []);

  return stats;
}
