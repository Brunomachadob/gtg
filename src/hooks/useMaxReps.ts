import { useState } from 'react';
import { StorageService } from '../services/StorageService';
import { DateService } from '../services/DateService';
import { MaxRepsData } from '../types';

export function useMaxReps() {
  const [maxReps, setMaxReps] = useState<MaxRepsData>(StorageService.getMaxRepsData());

  const setCurrentMax = (exercise: string, maxReps: number) => {
    // Use StorageService.updateMaxReps with forceUpdate=true to allow manual updates
    StorageService.updateMaxReps(exercise, maxReps, true);
    // Refresh local state
    setMaxReps(StorageService.getMaxRepsData());
  };

  const getCurrentMax = (exercise: string): number => {
    return maxReps[exercise]?.currentMax || 0;
  };

  const getLastUpdated = (exercise: string): string | null => {
    const data = maxReps[exercise];
    if (!data?.lastUpdated) return null;

    return new Date(data.lastUpdated).toLocaleDateString();
  };

  const getHistory = (exercise: string) => {
    return maxReps[exercise]?.history || [];
  };

  const getDaysSinceLastUpdate = (exercise: string): number => {
    const data = maxReps[exercise];
    if (!data?.lastUpdated) return 0;

    const lastUpdate = new Date(data.lastUpdated);
    const now = DateService.getCurrentDate();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());

    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExerciseData = (exercise: string) => {
    return maxReps[exercise] || {
      currentMax: 0,
      lastUpdated: '',
      history: []
    };
  };

  return {
    maxReps,
    setCurrentMax,
    getCurrentMax,
    getLastUpdated,
    getHistory,
    getDaysSinceLastUpdate,
    getExerciseData
  };
}
