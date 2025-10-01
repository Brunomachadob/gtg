import React, { useState } from 'react';
import { Bed, Plus, Target, Clock, ChevronUp, ChevronDown, Edit3, Calendar, Info, X } from 'lucide-react';
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
    reminder,
    dismissReminder,
    timeRemaining,
  } = useSession(config.sets, todayExercise, config.reminderIntervalMinutes);

  // Get max reps data
  const { getExerciseData, setCurrentMax } = useMaxReps();

  // Calculate completed sets
  const completedSets = dailySets.sets.filter((reps: number) => reps > 0).length;
  const totalReps = dailySets.sets.reduce((acc: number, reps: number) => acc + reps, 0);
  const hasReachedMinimum = completedSets >= config.sets;

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddSet = () => {
    // Prevent adding sets if no valid exercise is scheduled for today or if it's a rest day
    // Use type assertion to handle the case where todayExercise might be empty string
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
      <Bed className="empty-icon" size={48} />
      <p>Rest Day</p>
      <p className="empty-subtitle">Today is your rest day. Take time to recover and come back stronger tomorrow!</p>
    </div>
  ) : !todayExercise || (todayExercise as string) === '' ? (
    <div className="empty-sets-message">
      <Calendar className="empty-icon" size={48} />
      <p>Exercise Not Set</p>
      <p className="empty-subtitle">There's no exercise scheduled for today. Please set up your schedule to start exercising.</p>
      <div className="flex justify-center empty-sets-buttons-container">
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
  ) : null;

  return (
    <div className="today-page">
      {/* Primary Header with Most Important Cards */}
      <div className="today-header">
        <div className="progress-cards primary">
          {/* Today's Exercise - Most Important */}
          <Card
            color="blue"
            title="Today"
            onClick={handleUpdateSchedule}
            icon={<Calendar size={24} />}
            leftIcon={<Edit3 size={16} />}
          >
            <div className="progress-value">{todayExercise}</div>
          </Card>


          {/* Daily Progress - Second Most Important */}
          <Card
            color="orange"
            title="Progress"
            onClick={handleUpdateSets}
            icon={<Target size={24} />}
            leftIcon={<Edit3 size={16} />}
          >
            <div className="progress-value">
              Sets: {completedSets} / {config.sets}{hasReachedMinimum && completedSets > config.sets ? '+' : ''}
            </div>
            <div className="progress-value">
              Reps: {totalReps}
            </div>
          </Card>
        </div>
      </div>

      {/* Sets Container - Main content area */}
      <div className="sets-container">
        <div className="sets-header">
          <h3>Today's Sets</h3>
        </div>

        {/* Add Set Button - now a pill below the header, disabled on rest days */}
        <button
          className={`add-set-pill ${isRestDay ? 'disabled' : ''}`}
          onClick={handleAddSet}
          disabled={isRestDay}
        >
          <Plus size={20} />
          <span>Add Set</span>
        </button>

        <div className="sets-grid">
          {/* Show rest day message when it's a rest day */}
          {alternateSetsGrid ||  (
            <>
              {/* Show completed sets */}
              {dailySets.sets.map((reps: number, i: number) => {
                if (reps > 0) {
                  return (
                    <div key={i} className="completed-set-card">
                      <div className="set-header">
                        <div className="set-checkmark">✓</div>
                        <div className="set-content">
                          <div className="set-number">Set {i + 1}</div>
                          <div className="set-reps">{reps} reps</div>
                        </div>
                      </div>
                      <div className="set-remove-container">
                        <button
                          className="set-remove-button"
                          onClick={() => removeSet(i)}
                          title="Remove Set"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}

              {/* Empty state when no sets */}
              {dailySets.sets.filter(reps => reps > 0).length === 0 && (
                <div className="empty-sets-message">
                  <Target className="empty-icon" size={32} />
                  <p>No sets completed yet today</p>
                  <p className="empty-subtitle">Tap the "Add Set" button above to get started</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Secondary Controls - Below Main Content */}
      <div className="secondary-controls">
        <div className="section-header">
          <h3>Settings</h3>
        </div>

        <div className="progress-cards secondary">
          {/* Reminder Card */}
          <Card
            color="purple"
            title="Reminder"
            onClick={handleUpdateReminder}
            icon={<Clock size={20} />}
            leftIcon={<Edit3 size={16} />}
          >
            {
              config.reminderIntervalMinutes === 0 ? (
                <div className="progress-value">OFF</div>
              ) : reminder ? (
                <div className="card-reminder-content">
                  <div className="reminder-title">Time's Up!</div>
                  <div className="reminder-message">Ready for your next set</div>
                  <button className="dismiss-btn-card" onClick={(e) => {
                    e.stopPropagation();
                    dismissReminder();
                  }}>
                    Dismiss
                  </button>
                </div>
              ) : timeRemaining > 0 ? (
                <div className="progress-value">{formatTime(timeRemaining)}</div>
              ) : (
                <div className="progress-value">Ready</div>
              )
            }
          </Card>


          {/* Pull Ups Max */}
          <Card
            color="red"
            title="Pull Ups Max"
            onClick={() => handleUpdateMaxReps('Pull Ups')}
            icon={<ChevronUp size={20} />}
            leftIcon={<Edit3 size={16} />}
          >
            <div className="progress-value">{getExerciseData('Pull Ups').currentMax} / {config.goals.pullUps}</div>
          </Card>

          {/* Dips Max */}
          <Card
            color="green"
            title="Pull Ups Max"
            onClick={() => handleUpdateMaxReps('Dips')}
            icon={<ChevronUp size={20} />}
            leftIcon={<Edit3 size={16} />}
          >
            <div className="progress-value">{getExerciseData('Dips').currentMax} / {config.goals.dips}</div>
          </Card>
        </div>
      </div>

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
    </div>
  );
}
