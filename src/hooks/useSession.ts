import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { DateService } from '../services/DateService';
import { DailySets, Exercise, ReminderState } from "../types";

export function useSession(sets: number, todayExercise: Exercise, reminderIntervalMinutes: number) {
  const todayKey = DateService.getCurrentDateString();

  const [dailySets, setDailySets] = useState<DailySets>(() => {
    return StorageService.getDailySets(todayKey) || {
      exercise: todayExercise,
      sets: Array(sets).fill(0),
    };
  });

  const areThereMoreSetsToDo = () => dailySets.sets.some(r => r === 0);

  const [reminderState, setReminderState] = useState<ReminderState>({
    intervalId: null,
    remindAt: null,
    remainingTime: null,
    status: 'off',
  });

  useEffect(() => {
    StorageService.saveDailySets(todayKey, dailySets);
  }, [dailySets, todayKey, todayExercise]);

  useEffect(() => {

    if (reminderIntervalMinutes === 0) {
      if (reminderState.intervalId) clearInterval(reminderState.intervalId);

      setReminderState({
        status: 'off',
        intervalId: null,
        remindAt: null,
        remainingTime: null,
      });
    } else if (areThereMoreSetsToDo()) {
      if (reminderState.intervalId) clearInterval(reminderState.intervalId);
      if (reminderState.status === 'alert') return;

      const remindAt = Date.now() + (reminderIntervalMinutes * 60 * 1000);

      const intervalId = setInterval(() => {
        setReminderState(currentState => {
          if (!currentState.remindAt) return currentState;

          const remainingTime = Math.max(0, currentState.remindAt - Date.now());

          if (remainingTime <= 0) {
            clearInterval(intervalId);
            showDesktopNotification();
            return {
              ...currentState,
              status: 'alert',
              remindAt: null,
              remainingTime: null,
              intervalId: null
            };
          } else {
            return {
              ...currentState,
              remainingTime,
            };
          }
        });
      }, 1000);

      setReminderState({
        intervalId,
        status: "running",
        remindAt,
        remainingTime: reminderIntervalMinutes * 60 * 1000,
      });

      return () => clearInterval(intervalId);
    } else {
      if (reminderState.intervalId) clearInterval(reminderState.intervalId);

      setReminderState({
        intervalId: null,
        status: 'complete',
        remindAt: null,
        remainingTime: null,
      });
    }
  }, [reminderIntervalMinutes, dailySets, reminderState.status]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notifications enabled for Grease the Groove');
        } else {
          console.log('Notifications denied');
        }
      }).catch((error) => {
        console.error('Error requesting notification permission:', error);
      });
    }
  }, []);

  const showDesktopNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('Grease the Groove Reminder', {
        body: 'Time for your next set! Click to open the app.',
        icon: '/favicon.ico', // You can add a custom icon
        badge: '/favicon.ico',
        tag: 'gtg-reminder', // Prevents duplicate notifications
        requireInteraction: true, // Keeps notification until user interacts
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds if not interacted with
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  };

  const dismissReminder = () => {
    // Set next reminder only if not disabled
    if (reminderIntervalMinutes !== 0 && areThereMoreSetsToDo()) {
      setReminderState(currentState => {
        return {
          ...currentState,
          status: "running",
        };
      });
    }
  };

  // Direct method to add a set with specific reps
  const addSetWithReps = (reps: number) => {
    const firstEmptyIndex = dailySets.sets.findIndex(r => r === 0);
    let updatedSets;

    if (firstEmptyIndex !== -1) {
      // Add to existing empty slot
      updatedSets = [...dailySets.sets];
      updatedSets[firstEmptyIndex] = reps;
    } else {
      // All slots filled, add a new set beyond the minimum
      updatedSets = [...dailySets.sets, reps];
    }

    setDailySets({
      ...dailySets,
      sets: updatedSets
    });
  };

  // Remove a specific set by index
  const removeSet = (idx: number) => {
    if (idx < 0 || idx >= dailySets.sets.length || dailySets.sets[idx] === 0) return;

    const updated = [...dailySets.sets];
    updated[idx] = 0; // Reset the set to 0 (empty)
    setDailySets({
      ...dailySets,
      sets: updated
    });
  };

  return {
    dailySets,
    reminderState,
    dismissReminder,
    addSetWithReps,
    removeSet
  };
}
