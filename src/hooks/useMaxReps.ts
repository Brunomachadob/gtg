import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { DateService } from '../services/DateService';
import { MaxRepsData } from '../types';

export function useMaxReps() {
  const [maxReps, setMaxReps] = useState<MaxRepsData>({});

  useEffect(() => {
    setMaxReps(StorageService.getMaxRepsData());
  }, []);

  const setCurrentMax = (exercise: string, maxReps: number) => {
    const data = StorageService.getMaxRepsData();
    const now = DateService.getCurrentDate().toISOString();

    if (!data[exercise]) {
      data[exercise] = {
        currentMax: 0,
        lastUpdated: '',
        history: []
      };
    }

    // Add to history if this is a new max
    if (maxReps > data[exercise].currentMax) {
      data[exercise].history.push({
        date: now,
        maxReps: maxReps
      });
    }

    data[exercise].currentMax = maxReps;
    data[exercise].lastUpdated = now;

    StorageService.saveMaxRepsData(data);
    setMaxReps(data);
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
