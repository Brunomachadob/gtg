import { Statistics, Stats } from '../types';
import { StorageService } from '../services/StorageService';
import { DateService } from '../services/DateService';

export function useStatistics(): Statistics {
  type StatsKeys = 'pullUps' | 'dips' | 'total';

  const updateAverageBonusSets = (stats: Statistics, key: StatsKeys) => {
    if (stats[key].bonusDays > 0) {
      stats[key].averageBonusSets = Math.round((stats[key].bonusSets / stats[key].bonusDays) * 10) / 10;
    }
  }

  const exerciseToStatKey = (exercise: 'Pull Ups' | 'Dips'): StatsKeys => {
    switch (exercise) {
      case 'Pull Ups': return 'pullUps';
      case "Dips": return 'dips';
    }
  }

  const now = DateService.getCurrentDate();
  const allDailySets = StorageService.getAllDailySets();
  const config = StorageService.getConfig();

  const startStats: Stats = {
    weekly: 0,
    monthly: 0,
    streak: 0,
    bonusDays: 0,
    bonusSets: 0,
    averageBonusSets: 0
  };

  const stats: Statistics = {
    total: {
      ...startStats
    },
    pullUps: {
      ...startStats
    },
    dips: {
      ...startStats
    },
    overtime: []
  };

  for (let day = 0; day < 31; day++) {
    const dt = new Date(now);
    dt.setDate(now.getDate() - day);
    const dateStr = dt.toISOString().slice(0, 10);

    const dailySet = allDailySets[dateStr];
    const exercise = dailySet?.exercise || ''

    const setsArray = dailySet?.sets || [];
    const reps = setsArray.reduce((a, b) => a + b, 0);
    const completedSets = setsArray.filter(r => r > 0).length;

    // We need the data in the correct order for the overtime chart
    stats.overtime.unshift({
      date: dateStr,
      dayMonth: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pullUps: exercise == 'Pull Ups' ? reps : 0,
      dips: exercise == 'Dips' ? reps : 0,
    })

    if (exercise == '' || exercise == 'Rest') {
      continue;
    }

    if (day < 7) {
      stats.total.weekly += reps;
      stats[exerciseToStatKey(exercise)].weekly += reps;
    }

    stats.total.monthly += reps;
    stats[exerciseToStatKey(exercise)].monthly += reps;

    if (completedSets > config.sets) {
      stats.total.streak++;
      stats[exerciseToStatKey(exercise)].streak++;

      stats.total.bonusDays++;
      stats[exerciseToStatKey(exercise)].bonusDays++;

      stats.total.bonusSets += (completedSets - config.sets);
      stats[exerciseToStatKey(exercise)].bonusSets += (completedSets - config.sets);
    } else if (completedSets == config.sets) {
      stats.total.streak++;
      stats[exerciseToStatKey(exercise)].streak++;
    }
  }

  updateAverageBonusSets(stats, 'total');
  updateAverageBonusSets(stats, 'pullUps');
  updateAverageBonusSets(stats, 'dips');

  return stats;
}
