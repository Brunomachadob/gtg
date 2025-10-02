import React, { useState } from 'react';
import { Bed, Plus, Clock, Edit3, Calendar, Info, Target, X } from 'lucide-react';
import { Card } from '../Card/Card';
import { Exercise, PageType} from '../../types';
import { useSession } from '../../hooks/useSession';
import { useMaxReps } from '../../hooks/useMaxReps';
import { useConfig } from '../../hooks/useConfig';
import {NumberInput} from "../NumberInput/NumberInput.tsx";
import {DateService} from "../../services/DateService.ts";
import './Today.css';

interface TodayProps {
  navigateTo: (page: PageType) => void;
}

export function Today({ navigateTo }: TodayProps) {
  const { config, setConfig } = useConfig();

  // Get session data for countdown integration
  const todayIdx = DateService.getCurrentDate().getDay();
  const todayExercise = config.days[todayIdx];
  const isRestDay = todayExercise === 'Rest';
  const isMissingTodayExercise = !todayExercise || (todayExercise as string) === '';

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
    dailySets,
    addSetWithReps,
    removeSet,
    reminderState,
    dismissReminder,
  } = useSession(config.sets, todayExercise, config.reminderIntervalMinutes);

  // Get max reps data
  const { getExerciseData, setCurrentMax } = useMaxReps();

  // Calculate completed sets
  const completedSets = dailySets.sets.filter((reps: number) => reps > 0).length;
  const totalReps = dailySets.sets.reduce((acc: number, reps: number) => acc + reps, 0);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddSet = (e: React.MouseEvent) => {
    // Prevent adding sets if no valid exercise is scheduled for today or if it's a rest day
    // Use type assertion to handle the case where todayExercise might be empty string
    e.stopPropagation();
    const exercise = todayExercise as string;
    if (!exercise || exercise === '' || exercise === 'Rest') {
      return;
    }

    // Get the reps from the last completed set to pre-populate the input
    const completedSetsReps = dailySets.sets.filter(reps => reps > 0);
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
      // Update current max using centralized service
      setCurrentMax(showMaxRepsInput, newMaxReps);

      // Update goal in config using the hook
      const exerciseKey = showMaxRepsInput === 'Pull Ups' ? 'pullUps' : 'dips';
      const updatedConfig = {
        ...config,
        goals: {
          ...config.goals,
          [exerciseKey]: newGoalReps
        }
      };
      setConfig(updatedConfig);
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
      // Update reminder interval using the config hook
      const updatedConfig = {
        ...config,
        reminderIntervalMinutes: newReminderInterval
      };
      setConfig(updatedConfig);
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
      // Update daily sets using the config hook
      const updatedConfig = {
        ...config,
        sets: newDailySets
      };
      setConfig(updatedConfig);
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
      // Update schedule using the config hook
      const updatedConfig = {
        ...config,
        days: scheduleConfig
      };
      setConfig(updatedConfig);
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

  const alternateSetsGrid = isRestDay ? (
    <div className="empty-sets-message">
      <p className="empty-subtitle">Today is your rest day. Take time to recover and come back stronger tomorrow!</p>
    </div>
  ) : isMissingTodayExercise ? (
    <div className="empty-sets-message">
      <p>Exercise Not Set</p>
      <p className="empty-subtitle">There's no exercise scheduled for today. Please set up your schedule to start exercising.</p>
      <div className="flex justify-center empty-sets-buttons-container">
        <button
          className="schedule-setup-button modal-button modal-button-primary"
          onClick={handleUpdateSchedule}
        >
          <Calendar size={20} />
          Set Up Schedule
        </button>
        <button
          className="schedule-setup-button modal-button modal-button-secondary"
          onClick={() => navigateTo('about')}
        >
          <Info size={20} />
          Learn More
        </button>
      </div>
    </div>
  ) : totalReps == 0 ? (
    <div className="empty-sets-message">
      <p>No sets completed yet today</p>
      <p className="empty-subtitle">Tap the "Add Set" button above to get started</p>
    </div>
  ) : null;

  return (
    <div className="today-page">
      {/* Today Section */}
      <div className="today-section">
        <Card title="Today" onClick={handleUpdateSchedule} icon={Edit3} className="today-card exercise-stat-card">
          <div className="today-exercise exercise-main-number">{todayExercise}</div>
          <div className="exercise-details">
            <div className="exercise-detail">
              <div className="exercise-detail-label">Sets</div>
              <div className="exercise-detail-value">{completedSets} / {config.sets}</div>
            </div>
            <div className="exercise-detail">
              <div className="exercise-detail-label">Reps</div>
              <div className="exercise-detail-value">{totalReps}</div>
            </div>
          </div>
          {/* Add Set Button */}
          {!isMissingTodayExercise && !isRestDay &&
            <button
              className="add-set-button"
              onClick={handleAddSet}
            >
              <Plus size={20}/>
              Add Set
            </button>
          }

          {alternateSetsGrid ||  (
            <div className="sets-grid">
              {/* Show completed sets */}
              {
                dailySets.sets.map((reps: number, i: number) => {
                  if (reps === 0) return null;

                  return (
                    <div key={i} className="completed-set-card" onClick={(e: React.MouseEvent) => {e.stopPropagation()}}>
                      <div className="set-number">Set {i + 1}</div>
                      <div className="set-reps">{reps} reps</div>
                      <button
                        className="set-remove-button"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          removeSet(i);
                        }}
                        title="Remove Set"
                      >
                        <X size={16}/>
                      </button>
                    </div>
                  );
              })
              }

              {/* Empty state when no sets */}
              {totalReps === 0 && (
                <div className="empty-sets-message">
                  <Target className="empty-icon" size={32} />
                  <p>No sets completed yet today</p>
                  <p className="empty-subtitle">Tap the "Add Set" button above to get started</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="exercise-stats-grid">
        {/* Timer Card */}
        <Card
          title="Timer"
          onClick={() => handleUpdateReminder()}
          icon={Edit3}
          className="exercise-stat-card timer-card"
        >
          {
            config.reminderIntervalMinutes === 0 ? (
              <div className="timer-display">
                OFF
              </div>
            ) : reminderState.status === 'alert' ? (
              <div className="exercise-details">
                <div className="exercise-detail">
                  <div className="exercise-detail-value">Time's Up!</div>
                  <div className="exercise-detail-label">Ready for your next set</div>
                </div>
                <button className="reminder-dismiss-button modal-button modal-button-secondary" onClick={(e) => {
                  e.stopPropagation();
                  dismissReminder();
                }}>
                  Dismiss
                </button>
              </div>
            ) : reminderState.remainingTime && reminderState.remainingTime > 0 ? (
              <div className="timer-display">{formatTime(reminderState.remainingTime)}</div>
            ) : (
              <div className="exercise-detail-label">All sets completed!</div>
            )
          }
        </Card>

        {/* Dips Card */}
        <Card
          title="Dips"
          onClick={() => handleUpdateMaxReps('Dips')}
          icon={Edit3}
          className="exercise-stat-card"
        >
          <div className="exercise-details">
            <div className="exercise-detail">
              <div className="exercise-detail-label">Max</div>
              <div className="exercise-detail-value">{getExerciseData('Dips').currentMax}</div>
            </div>
            <div className="exercise-detail">
              <div className="exercise-detail-label">Goal</div>
              <div className="exercise-detail-value">{config.goals.dips}</div>
            </div>
          </div>
        </Card>

        {/* Pull-ups Card */}
        <Card
          title="Pull-ups"
          onClick={() => handleUpdateMaxReps('Pull Ups')}
          icon={Edit3}
          className="exercise-stat-card"
        >
          <div className="exercise-details">
            <div className="exercise-detail">
              <div className="exercise-detail-label">Max</div>
              <div className="exercise-detail-value">{getExerciseData('Pull Ups').currentMax}</div>
            </div>
            <div className="exercise-detail">
              <div className="exercise-detail-label">Goal</div>
              <div className="exercise-detail-value">{config.goals.pullUps}</div>
            </div>
          </div>
        </Card>
      </div>

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

            <div className="modal-body">
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
    </div>
  );
}
