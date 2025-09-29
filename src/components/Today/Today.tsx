import React, { useState } from 'react';
import { Bed, Plus, Target, Clock, Trophy, Edit3, Calendar, Info, X } from 'lucide-react';
import {Config, Exercise, PageType} from '../../types';
import { useSession } from '../../hooks/useSession';
import { useMaxReps } from '../../hooks/useMaxReps';
import './Today.css';
import {NumberInput} from "../NumberInput/NumberInput.tsx";
import {DateService} from "../../services/DateService.ts";

interface CountdownData {
  reminder: boolean;
  timeRemaining: number;
  countdownProgress: number;
  formatTime: (time: number) => string;
  dismissReminder: () => void;
}

interface TodayProps {
  config: Config;
  todayExercise: Exercise;
  countdown?: CountdownData;
  navigateTo: (page: PageType) => void;
}

export function Today({ config, todayExercise, countdown, navigateTo }: TodayProps) {
  const [showRepsInput, setShowRepsInput] = useState(false);
  const [newSetReps, setNewSetReps] = useState(0);
  const [showMaxRepsInput, setShowMaxRepsInput] = useState<string | null>(null);
  const [newMaxReps, setNewMaxReps] = useState(0);
  const [newGoalReps, setNewGoalReps] = useState(0);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [newReminderInterval, setNewReminderInterval] = useState(0);
  const [showSetsInput, setShowSetsInput] = useState(false);
  const [newDailySets, setNewDailySets] = useState(0);
  const [showScheduleInput, setShowScheduleInput] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState(config.days || []);

  // Get session data for set cards
  const {
    setsDone,
    addSetWithReps,
    removeSet
  } = useSession(config.sets, config.reminderIntervalMinutes);

  // Get max reps data
  const { getExerciseData, setCurrentMax } = useMaxReps();

  // Calculate completed sets
  const completedSets = setsDone.filter((reps: number) => reps > 0).length;
  const hasReachedMinimum = completedSets >= config.sets;

  // If today is a rest day, show a rest message
  if (todayExercise === 'Rest') {
    return (
      <div className="today-page">
        <div className="rest-day-message">
          <Bed className="mx-auto mb-4 text-blue-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Rest Day</h2>
          <p className="text-gray-600 text-center">
            Today is your rest day. Take time to recover and come back stronger tomorrow!
          </p>
        </div>
      </div>
    );
  }

  const handleAddSet = () => {
    // Prevent adding sets if no valid exercise is scheduled for today
    // Use type assertion to handle the case where todayExercise might be empty string
    const exercise = todayExercise as string;
    if (!exercise || exercise === '' || exercise === 'Rest') {
      return;
    }

    // Get the reps from the last completed set to pre-populate the input
    const completedSetsReps = setsDone.filter(reps => reps > 0);
    const lastSetReps = completedSetsReps.length > 0 ? completedSetsReps[completedSetsReps.length - 1] : 0;
    setNewSetReps(lastSetReps);
    setShowRepsInput(true);
  };

  const handleSubmitSet = () => {
    if (newSetReps > 0) {
      addSetWithReps(newSetReps);
    }
    setShowRepsInput(false);
    setNewSetReps(0);
  };

  const handleCancelSet = () => {
    setShowRepsInput(false);
    setNewSetReps(0);
  };

  const handleUpdateMaxReps = (exercise: string) => {
    const exerciseKey = exercise === 'Pull Ups' ? 'pullUps' : 'dips';
    const currentData = getExerciseData(exercise);
    setNewMaxReps(currentData.currentMax);
    setNewGoalReps(config.goals[exerciseKey]);
    setShowMaxRepsInput(exercise);
  };

  const handleSubmitMaxReps = () => {
    if (showMaxRepsInput && newMaxReps >= 0 && newGoalReps > 0) {
      // Update current max
      setCurrentMax(showMaxRepsInput, newMaxReps);

      // Update goal in config
      const exerciseKey = showMaxRepsInput === 'Pull Ups' ? 'pullUps' : 'dips';
      const updatedConfig = {
        ...config,
        goals: {
          ...config.goals,
          [exerciseKey]: newGoalReps
        }
      };
      // We need to get setConfig from props, but it's not currently passed
      // For now, we'll update it via the same pattern used in Config component
      localStorage.setItem('gtg_config', JSON.stringify(updatedConfig));
      window.location.reload(); // Force reload to update config
    }
    setShowMaxRepsInput(null);
    setNewMaxReps(0);
    setNewGoalReps(0);
  };

  const handleCancelMaxReps = () => {
    setShowMaxRepsInput(null);
    setNewMaxReps(0);
    setNewGoalReps(0);
  };

  const handleUpdateReminder = () => {
    setNewReminderInterval(config.reminderIntervalMinutes);
    setShowReminderInput(true);
  };

  const handleSubmitReminder = () => {
    if (newReminderInterval >= 0) {
      // Update reminder interval in config
      const updatedConfig = {
        ...config,
        reminderIntervalMinutes: newReminderInterval
      };
      localStorage.setItem('gtg_config', JSON.stringify(updatedConfig));
      window.location.reload(); // Force reload to update config
    }
    setShowReminderInput(false);
    setNewReminderInterval(0);
  };

  const handleCancelReminder = () => {
    setShowReminderInput(false);
    setNewReminderInterval(0);
  };

  const handleUpdateSets = () => {
    setNewDailySets(config.sets);
    setShowSetsInput(true);
  };

  const handleSubmitSets = () => {
    if (newDailySets > 0) {
      // Update daily sets in config
      const updatedConfig = {
        ...config,
        sets: newDailySets
      };
      localStorage.setItem('gtg_config', JSON.stringify(updatedConfig));
      window.location.reload(); // Force reload to update config
    }
    setShowSetsInput(false);
    setNewDailySets(0);
  };

  const handleCancelSets = () => {
    setShowSetsInput(false);
    setNewDailySets(0);
  };

  const handleUpdateSchedule = () => {
    setScheduleConfig(config.days);
    setShowScheduleInput(true);
  };

  const handleSubmitSchedule = () => {
    if (scheduleConfig.length > 0) {
      // Update schedule in config
      const updatedConfig = {
        ...config,
        days: scheduleConfig
      };
      localStorage.setItem('gtg_config', JSON.stringify(updatedConfig));
      window.location.reload(); // Force reload to update config
    }
    setShowScheduleInput(false);
  };

  const handleCancelSchedule = () => {
    setShowScheduleInput(false);
  };

  // Helper function to get day names
  const getDayNames = () => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  };

  // Helper function to handle schedule changes
  const handleScheduleChange = (dayIndex: number, value: string) => {
    const newSchedule = [...scheduleConfig];
    newSchedule[dayIndex] = value as Exercise;
    setScheduleConfig(newSchedule);
  };

  // If no exercise is scheduled for today (fresh app state), show a setup message
  if ((!todayExercise || (todayExercise as string) === '') && !showScheduleInput) {
    return (
      <div className="today-page">
        <div className="rest-day-message">
          <Calendar className="mx-auto mb-4 text-orange-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Exercise Not Set</h2>
          <p className="text-gray-600 text-center mb-4">
            There's no exercise scheduled for today. Please set up your schedule to start exercising.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="schedule-setup-button"
              onClick={handleUpdateSchedule}
            >
              <Calendar size={20} />
              Set Up Schedule
            </button>
            <button
              className="learn-more-button"
              onClick={() => navigateTo('about')}
            >
              <Info size={20} />
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="today-page">
      {/* Fixed Header with Progress Cards */}
      <div className="today-header">
        {/* Progress Cards Grid */}
        <div className="progress-cards">
            {/* Schedule Configuration Card - clickable to configure schedule */}
            <div className="progress-card schedule-card" onClick={handleUpdateSchedule}>
                <div className="progress-icon">
                    <Calendar className="text-red-600" size={24} />
                </div>
                <div className="exercise-name">Schedule</div>
                <div className="progress-value">
                    {todayExercise} / {getDayNames()[DateService.getCurrentDate().getDay()]}
                </div>
                <div className="update-indicator">
                    <Edit3 size={16} />
                </div>
            </div>

          {/* Set Counter Card - clickable to configure daily sets */}
          <div className="progress-card set-progress sets-card" onClick={handleUpdateSets}>
            <div className="progress-icon">
              <Target className="text-green-600" size={24} />
            </div>
            <div className="exercise-name">Daily sets</div>
            <div className="progress-value">
              {completedSets} / {config.sets}{hasReachedMinimum && completedSets > config.sets ? '+' : ''}
            </div>
            <div className="update-indicator sets-indicator">
              <Edit3 size={16} />
            </div>
          </div>

          {/* Countdown Card - clickable to configure reminder */}
          <div className={`progress-card countdown-progress reminder-card ${countdown?.reminder ? 'reminder-active' : ''}`} onClick={handleUpdateReminder}>
            <div className="progress-icon">
              <Clock className="text-blue-600" size={24} />
            </div>
            {config.reminderIntervalMinutes === 0 ? (
              <div className="card-countdown-content">
                <div className="exercise-name">Reminder</div>
                <div className="countdown-value">OFF</div>
              </div>
            ) : countdown?.reminder ? (
              <div className="card-reminder-content">
                <div className="reminder-title">Time's Up!</div>
                <div className="reminder-message">Ready for your next set</div>
                <button className="dismiss-btn-card" onClick={(e) => {
                  e.stopPropagation();
                  countdown.dismissReminder();
                }}>
                  Dismiss
                </button>
              </div>
            ) : countdown && countdown.timeRemaining > 0 ? (
              <div className="card-countdown-content">
                <div className="countdown-title">Reminder</div>
                <div className="countdown-value">{countdown.formatTime(countdown.timeRemaining)}</div>
              </div>
            ) : (
              <div className="card-countdown-content">
                <div className="countdown-title">Complete</div>
                <div className="countdown-value">--:--</div>
              </div>
            )}
            <div className="update-indicator reminder-indicator">
              <Edit3 size={16} />
            </div>
          </div>

          {/* Pull Ups Max Reps Card */}
          <div className="progress-card max-reps-card pull-ups" onClick={() => handleUpdateMaxReps('Pull Ups')}>
            <div className="progress-icon">
              <Trophy className="text-purple-600" size={24} />
            </div>
            <div className="exercise-name">Pull Ups Max</div>
            <div className="progress-value">
              {getExerciseData('Pull Ups').currentMax} / {config.goals.pullUps}
            </div>
            <div className="update-indicator">
              <Edit3 size={16} />
            </div>
          </div>

          {/* Dips Max Reps Card */}
          <div className="progress-card max-reps-card dips" onClick={() => handleUpdateMaxReps('Dips')}>
            <div className="progress-icon">
              <Trophy className="text-amber-600" size={24} />
            </div>
            <div className="exercise-name">Dips Max</div>
            <div className="progress-value">
              {getExerciseData('Dips').currentMax} / {config.goals.dips}
            </div>
            <div className="update-indicator">
              <Edit3 size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Add Set */}
      <button className="fab-add-set" onClick={handleAddSet}>
        <Plus size={24} />
      </button>

      {/* Modal overlay for reps input - shown on top when needed */}
      {showRepsInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">How many reps?</div>

            <div className="modal-body">
                <NumberInput
                    min={1}
                    value={newSetReps}
                    onChange={setNewSetReps}
                />
            </div>

            <div className="modal-buttons">
              <button className="modal-button modal-button-primary" onClick={handleSubmitSet} disabled={newSetReps <= 0}>
                Add Set
              </button>
              <button className="modal-button modal-button-secondary" onClick={handleCancelSet}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for max reps input - shown on top when needed */}
      {showMaxRepsInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Configure {showMaxRepsInput}</div>

            <div className="modal-body">
              <div className="input-group">
                <div className="modal-input-label">Current Max Reps:</div>
                  <NumberInput
                      min={1}
                      value={newMaxReps}
                      onChange={setNewMaxReps}
                  />
              </div>

              <div className="input-group">
                <div className="modal-input-label">Goal Reps:</div>
                  <NumberInput
                      min={1}
                      value={newGoalReps}
                      onChange={setNewGoalReps}
                  />
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-button modal-button-primary" onClick={handleSubmitMaxReps} disabled={newGoalReps <= 0}>
                Save Settings
              </button>
              <button className="modal-button modal-button-secondary" onClick={handleCancelMaxReps}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for reminder input - shown on top when needed */}
      {showReminderInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Set Reminder Interval</div>

            <div className="modal-body">
              <div className="input-group">
                <div className="modal-input-label">Interval (minutes):</div>
                  <NumberInput
                      min={0}
                      value={newReminderInterval}
                      onChange={setNewReminderInterval}
                  />
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-button modal-button-primary" onClick={handleSubmitReminder} disabled={newReminderInterval < 0}>
                Save Reminder
              </button>
              <button className="modal-button modal-button-secondary" onClick={handleCancelReminder}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for sets input - shown on top when needed */}
      {showSetsInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Configure Daily Sets</div>

            <div className="modal-body">
              <div className="input-group">
                <div className="modal-input-label">Sets per Day:</div>
                  <NumberInput
                      min={1}
                      value={newDailySets}
                      onChange={setNewDailySets}
                  />
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-button modal-button-primary" onClick={handleSubmitSets} disabled={newDailySets <= 0}>
                Save Settings
              </button>
              <button className="modal-button modal-button-secondary" onClick={handleCancelSets}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for schedule input - shown on top when needed */}
      {showScheduleInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Configure Weekly Schedule</div>

            {/* Schedule configuration UI here */}
            <div className="schedule-config-grid">
              {getDayNames().map((dayName, index) => (
                <div key={index} className="schedule-config-item">
                  <div className="schedule-day">{dayName}</div>
                  <div className="schedule-exercise">
                    <select
                      value={scheduleConfig[index] || ''}
                      onChange={e => handleScheduleChange(index, e.target.value)}
                      className="exercise-select"
                    >
                      {!scheduleConfig[index] && (
                        <option value="" disabled>Select Exercise</option>
                      )}
                      <option value="Pull Ups">Pull Ups</option>
                      <option value="Dips">Dips</option>
                      <option value="Rest">Rest</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="modal-button modal-button-primary" onClick={handleSubmitSchedule}>
                Save Schedule
              </button>
              <button className="modal-button modal-button-secondary" onClick={handleCancelSchedule}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Sets Container */}
      <div className="sets-container">
        <div className="sets-grid">
          {/* Show completed sets */}
          {setsDone.map((reps: number, i: number) => {
            if (reps > 0) {
              return (
                <div key={i} className="completed-set-card">
                    <div className="set-remove-container">
                        <button
                            className="set-remove-button"
                            onClick={() => removeSet(i)}
                            title="Remove Set"
                        >
                            <X size={16} />
                        </button>
                    </div>
                  <div className="set-header">
                    <div className="set-checkmark">✓</div>
                    <div className="set-number">Set {i + 1}</div>
                    {/* Remove set button - always visible on mobile, hover to show on desktop */}
                  </div>
                  <div className="set-reps">{reps} reps</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
