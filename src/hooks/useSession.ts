import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { DateService } from '../services/DateService';
import { DailySets, Exercise } from "../types";

export function useSession(sets: number, todayExercise: Exercise, reminderIntervalMinutes: number) {
  const todayKey = DateService.getCurrentDateString();
  const REMINDER_INTERVAL = reminderIntervalMinutes * 60 * 1000; // Convert minutes to milliseconds
  const isReminderDisabled = reminderIntervalMinutes === 0;

  const [dailySets, setDailySets] = useState<DailySets>(() => {
    return StorageService.getDailySets(todayKey) || {
      exercise: todayExercise,
      sets: Array(sets).fill(0),
    };
  });

  const [reminder, setReminder] = useState(false);
  const [nextReminderTime, setNextReminderTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    StorageService.saveDailySets(todayKey, dailySets);
  }, [dailySets, todayKey, todayExercise]);

  useEffect(() => {
    if (!isReminderDisabled && dailySets.sets.some(r => r === 0) && !reminder && !nextReminderTime) {
      const reminderTime = Date.now() + REMINDER_INTERVAL;
      setNextReminderTime(reminderTime);
    }
  }, [dailySets, reminder, nextReminderTime, isReminderDisabled, REMINDER_INTERVAL]);

  // Reset timer when interval configuration changes
  useEffect(() => {
    if (isReminderDisabled) {
      // Disable reminders completely
      setReminder(false);
      setNextReminderTime(null);
      setTimeRemaining(0);
    } else if (nextReminderTime && !reminder) {
      // If there's an active timer and no current reminder, reset it with the new interval
      const reminderTime = Date.now() + REMINDER_INTERVAL;
      setNextReminderTime(reminderTime);
    }
  }, [REMINDER_INTERVAL, isReminderDisabled]); // Reset when the interval changes

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

  // Countdown timer effect
  useEffect(() => {
    if (!nextReminderTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, nextReminderTime - now);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setReminder(true);
        setNextReminderTime(null);
        clearInterval(timer);

        // Show desktop notification
        showDesktopNotification();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextReminderTime]);

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
    setReminder(false);
    // Set next reminder only if not disabled
    if (!isReminderDisabled && dailySets.sets.some(r => r === 0)) {
      const reminderTime = Date.now() + REMINDER_INTERVAL;
      setNextReminderTime(reminderTime);
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
    setReminder(false);
    setNextReminderTime(null);
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

    // If we now have incomplete sets and reminders are enabled, start the timer
    if (!isReminderDisabled && updated.some(r => r === 0) && !reminder && !nextReminderTime) {
      const reminderTime = Date.now() + REMINDER_INTERVAL;
      setNextReminderTime(reminderTime);
    }
  };

  return {
    dailySets,
    reminder,
    timeRemaining,
    dismissReminder,
    addSetWithReps,
    removeSet
  };
}
