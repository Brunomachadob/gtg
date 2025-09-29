import React, { useState } from 'react';
import { Bed, Plus, Target, Clock, Trophy, Edit3 } from 'lucide-react';
import { Config, Exercise } from '../../types';
import { useSession } from '../../hooks/useSession';
import { useMaxReps } from '../../hooks/useMaxReps';
import './Today.css';

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
}

export function Today({ config, todayExercise, countdown }: TodayProps) {
  const [showRepsInput, setShowRepsInput] = useState(false);
  const [newSetReps, setNewSetReps] = useState(0);
  const [showMaxRepsInput, setShowMaxRepsInput] = useState<string | null>(null);
  const [newMaxReps, setNewMaxReps] = useState(0);
  const [newGoalReps, setNewGoalReps] = useState(0);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [newReminderInterval, setNewReminderInterval] = useState(0);
  const [showSetsInput, setShowSetsInput] = useState(false);
  const [newDailySets, setNewDailySets] = useState(0);

  // Get session data for set cards
  const {
    setsDone,
    addSetWithReps
  } = useSession(config.sets, config.reminderIntervalMinutes);

  // Get max reps data
  const { getExerciseData, setCurrentMax, canUpdateMax } = useMaxReps();

  // Calculate completed sets
  const completedSets = setsDone.filter((reps: number) => reps > 0).length;
  const hasReachedMinimum = completedSets >= config.sets;

  // If today is a rest day, show rest message
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

  // If today's exercise is not configured (empty), show setup prompt
  if (!todayExercise || todayExercise.trim() === '') {
    return (
      <div className="today-page">
        <div className="setup-prompt-message">
          <Target className="mx-auto mb-4 text-orange-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Setup Required</h2>
          <p className="text-gray-600 text-center mb-4">
            Your workout schedule isn't configured yet. Set up your weekly exercise routine to get started, or learn more about the Grease the Groove method first.
          </p>
          <div className="setup-buttons">
            <button
              className="setup-button primary"
              onClick={() => window.location.hash = '#config'}
            >
              Configure Schedule
            </button>
            <button
              className="setup-button secondary"
              onClick={() => window.location.hash = '#about'}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddSet = () => {
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

  return (
    <div className="today-page">
      {/* Fixed Header with Progress Cards */}
      <div className="today-header">
        {/* Progress Cards Grid */}
        <div className="progress-cards">
          {/* Set Counter Card - clickable to configure daily sets */}
          <div className="progress-card set-progress sets-card" onClick={handleUpdateSets}>
            <div className="progress-icon">
              <Target className="text-green-600" size={24} />
            </div>
            <div className="exercise-name">{todayExercise}</div>
            <div className="progress-value">
              {completedSets} / {config.sets}{hasReachedMinimum && completedSets > config.sets ? '+' : ''}
            </div>
            <div className="progress-label">tap to configure</div>
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
                <div className="countdown-title">Reminder</div>
                <div className="countdown-value">OFF</div>
                <div className="countdown-label">tap to configure</div>
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
                <div className="countdown-label">tap to configure</div>
              </div>
            ) : (
              <div className="card-countdown-content">
                <div className="countdown-title">Complete</div>
                <div className="countdown-value">--:--</div>
                <div className="countdown-label">tap to configure</div>
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
            <div className="progress-label">
              tap to configure
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
            <div className="progress-label">
              tap to configure
            </div>
            <div className="update-indicator">
              <Edit3 size={16} />
            </div>
          </div>
        </div>

        {/* Add Set Button - Always Visible */}
        <div className="add-set-fixed">
          <button className="add-set-pill" onClick={handleAddSet}>
            <Plus size={18} />
            <span>{hasReachedMinimum ? 'Add Bonus Set' : 'Add Set'}</span>
          </button>
        </div>
      </div>

      {/* Modal overlay for reps input - shown on top when needed */}
      {showRepsInput && (
        <div className="reps-input-modal">
          <div className="reps-input-content">
            <div className="reps-input-label">How many reps?</div>
            <input
              type="number"
              min={1}
              value={newSetReps}
              onChange={e => setNewSetReps(Number(e.target.value))}
              className="reps-input"
              autoFocus
            />
            <div className="reps-input-buttons">
              <button onClick={handleSubmitSet} disabled={newSetReps <= 0}>
                Add Set
              </button>
              <button onClick={handleCancelSet}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for max reps input - shown on top when needed */}
      {showMaxRepsInput && (
        <div className="max-reps-input-modal">
          <div className="max-reps-input-content">
            <div className="max-reps-input-label">Configure {showMaxRepsInput}</div>

            <div className="input-group">
              <div className="max-reps-input-label">Current Max Reps:</div>
              <input
                type="number"
                min={0}
                value={newMaxReps}
                onChange={e => setNewMaxReps(Number(e.target.value))}
                className="max-reps-input"
                placeholder="0"
              />
            </div>

            <div className="input-group">
              <div className="max-reps-input-label">Goal Reps:</div>
              <input
                type="number"
                min={1}
                value={newGoalReps}
                onChange={e => setNewGoalReps(Number(e.target.value))}
                className="max-reps-input"
                placeholder="20"
              />
            </div>

            <div className="max-reps-input-buttons">
              <button onClick={handleSubmitMaxReps} disabled={newGoalReps <= 0}>
                Save Settings
              </button>
              <button onClick={handleCancelMaxReps}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for reminder input - shown on top when needed */}
      {showReminderInput && (
        <div className="reminder-input-modal">
          <div className="reminder-input-content">
            <div className="reminder-input-label">Set Reminder Interval</div>

            <div className="input-group">
              <div className="reminder-input-label">Interval (minutes):</div>
              <input
                type="number"
                min={0}
                value={newReminderInterval}
                onChange={e => setNewReminderInterval(Number(e.target.value))}
                className="reminder-input"
                placeholder="0"
              />
            </div>

            <div className="reminder-input-buttons">
              <button onClick={handleSubmitReminder} disabled={newReminderInterval < 0}>
                Save Reminder
              </button>
              <button onClick={handleCancelReminder}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for sets input - shown on top when needed */}
      {showSetsInput && (
        <div className="sets-input-modal">
          <div className="sets-input-content">
            <div className="sets-input-label">Configure Daily Sets</div>

            <div className="input-group">
              <div className="sets-input-label">Sets per Day:</div>
              <input
                type="number"
                min={1}
                value={newDailySets}
                onChange={e => setNewDailySets(Number(e.target.value))}
                className="sets-input"
                placeholder="0"
              />
            </div>

            <div className="sets-input-buttons">
              <button onClick={handleSubmitSets} disabled={newDailySets <= 0}>
                Save Settings
              </button>
              <button onClick={handleCancelSets}>Cancel</button>
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
                  <div className="set-header">
                    <div className="set-checkmark">✓</div>
                    <div className="set-number">Set {i + 1}</div>
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
