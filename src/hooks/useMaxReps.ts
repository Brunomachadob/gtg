import { useState } from 'react';
import { MaxRepsData } from '../types';
import { StorageService } from '../services/StorageService';

export function useMaxReps() {
  const [maxRepsData, setMaxRepsData] = useState<MaxRepsData>(() =>
    StorageService.getMaxRepsData()
  );

  const updateMaxReps = (exercise: string, newMax: number) => {
    StorageService.updateMaxReps(exercise, newMax);
    // Refresh data from storage to get the updated state
    setMaxRepsData(StorageService.getMaxRepsData());
  };

  const setCurrentMax = (exercise: string, maxReps: number) => {
    const data = StorageService.getMaxRepsData();
    const now = new Date().toISOString();

    if (!data[exercise]) {
      data[exercise] = {
        currentMax: 0,
        lastUpdated: '',
        history: []
      };
    }

    // Always update current max (not just when it's higher)
    // Add to history if it's different from current max
    if (maxReps !== data[exercise].currentMax) {
      data[exercise].history.push({
        date: now,
        maxReps: maxReps
      });
    }

    data[exercise].currentMax = maxReps;
    data[exercise].lastUpdated = now;

    StorageService.saveMaxRepsData(data);
    setMaxRepsData(data);
  };

  const getExerciseData = (exercise: string) => {
    return maxRepsData[exercise] || {
      currentMax: 0,
      lastUpdated: '',
      history: []
    };
  };

  // Check if it's been a week since last update
  const canUpdateMax = (exercise: string): boolean => {
    const exerciseData = getExerciseData(exercise);
    if (!exerciseData.lastUpdated) return true;

    const lastUpdate = new Date(exerciseData.lastUpdated);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

    return daysDiff >= 7; // Allow update once per week
  };

  return {
    maxRepsData,
    updateMaxReps,
    setCurrentMax,
    getExerciseData,
    canUpdateMax
  };
}
