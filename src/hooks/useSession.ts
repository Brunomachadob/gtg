import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

export function useSession(sets: number, reminderIntervalMinutes: number) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const REMINDER_INTERVAL = reminderIntervalMinutes * 60 * 1000; // Convert minutes to milliseconds

  const [setsDone, setSetsDone] = useState<number[]>(() => {
    const saved = StorageService.getSessionData(todayKey);
    return saved.length > 0 ? saved : Array(sets).fill(0);
  });

  const [repsInputs, setRepsInputs] = useState<number[]>(() => Array(sets).fill(0));
  const [flipped, setFlipped] = useState<boolean[]>(() => Array(sets).fill(false));
  const [reminder, setReminder] = useState(false);
  const [nextReminderTime, setNextReminderTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    StorageService.saveSessionData(todayKey, setsDone);
  }, [setsDone, todayKey]);

  useEffect(() => {
    if (setsDone.some(r => r === 0) && !reminder && !nextReminderTime) {
      const reminderTime = Date.now() + REMINDER_INTERVAL;
      setNextReminderTime(reminderTime);
    }
  }, [setsDone, reminder, nextReminderTime]);

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

  const markSetDone = (idx: number) => {
    if (setsDone[idx] > 0 || repsInputs[idx] <= 0) return;
    const updated = [...setsDone];
    updated[idx] = repsInputs[idx];
    setSetsDone(updated);

    const flipUpd = [...flipped];
    flipUpd[idx] = false;
    setFlipped(flipUpd);
    setReminder(false);
    setNextReminderTime(null);
  };

  const flipCard = (idx: number) => {
    if (setsDone[idx] > 0) return;
    const updated = [...flipped];
    updated[idx] = !updated[idx];
    setFlipped(updated);
  };

  const updateReps = (idx: number, value: number) => {
    const updated = [...repsInputs];
    updated[idx] = value;
    setRepsInputs(updated);
  };

  const dismissReminder = () => {
    setReminder(false);
    // Set next reminder
    if (setsDone.some(r => r === 0)) {
      const reminderTime = Date.now() + REMINDER_INTERVAL;
      setNextReminderTime(reminderTime);
    }
  };

  // Direct method to add a set with specific reps
  const addSetWithReps = (reps: number) => {
    const firstEmptyIndex = setsDone.findIndex(r => r === 0);
    if (firstEmptyIndex !== -1) {
      // Add to existing empty slot
      const updated = [...setsDone];
      updated[firstEmptyIndex] = reps;
      setSetsDone(updated);
    } else {
      // All slots filled, add a new set beyond the minimum
      const updated = [...setsDone, reps];
      setSetsDone(updated);
    }
    setReminder(false);
    setNextReminderTime(null);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!nextReminderTime) return 0;
    const totalTime = REMINDER_INTERVAL;
    const elapsed = totalTime - timeRemaining;
    return Math.min(100, (elapsed / totalTime) * 100);
  };

  return {
    setsDone,
    repsInputs,
    flipped,
    reminder,
    timeRemaining,
    progressPercentage: getProgressPercentage(),
    formatTime,
    markSetDone,
    flipCard,
    updateReps,
    dismissReminder,
    addSetWithReps
  };
}
