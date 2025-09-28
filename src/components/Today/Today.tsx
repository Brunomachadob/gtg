import React, { useState } from 'react';
import { Bed, Plus, Target, Clock } from 'lucide-react';
import { Config, Exercise } from '../../types';
import { useSession } from '../../hooks/useSession';
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

  // Get session data for set cards
  const {
    setsDone,
    addSetWithReps
  } = useSession(config.sets, config.reminderIntervalMinutes);

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

  const handleAddSet = () => {
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

  return (
    <div className="today-page">
      {/* Fixed Header with Progress Cards */}
      <div className="today-header">
        {/* Progress Cards Grid */}
        <div className="progress-cards">
          {/* Set Counter Card */}
          <div className="progress-card set-progress">
            <div className="progress-icon">
              <Target className="text-green-600" size={24} />
            </div>
            <div className="exercise-name">{todayExercise}</div>
            <div className="progress-value">
              {completedSets} / {config.sets}{hasReachedMinimum && completedSets > config.sets ? '+' : ''}
            </div>
            <div className="progress-label">sets completed</div>
          </div>

          {/* Countdown Card */}
          {countdown && (
            <div className={`progress-card countdown-progress ${countdown.reminder ? 'reminder-active' : ''}`}>
              <div className="progress-icon">
                <Clock className="text-blue-600" size={24} />
              </div>
              {countdown.reminder ? (
                <div className="card-reminder-content">
                  <div className="reminder-title">Time's Up!</div>
                  <div className="reminder-message">Ready for your next set</div>
                  <button className="dismiss-btn-card" onClick={countdown.dismissReminder}>
                    Dismiss
                  </button>
                </div>
              ) : countdown.timeRemaining > 0 ? (
                <div className="card-countdown-content">
                  <div className="countdown-title">Reminder</div>
                  <div className="countdown-value">{countdown.formatTime(countdown.timeRemaining)}</div>
                  <div className="countdown-label">until next set</div>
                </div>
              ) : (
                <div className="card-countdown-content">
                  <div className="countdown-title">Complete</div>
                  <div className="countdown-value">--:--</div>
                  <div className="countdown-label">all sets done</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Completion message below the cards */}
        {hasReachedMinimum && (
          <p className="completion-message">
            {completedSets === config.sets
              ? "Minimum sets completed! 🎉"
              : `Great job! ${completedSets - config.sets} bonus set${completedSets - config.sets > 1 ? 's' : ''}! 🔥`
            }
          </p>
        )}
      </div>

      {/* Scrollable Sets Container */}
      <div className="sets-container">
        <div className="sets-grid">
          {/* Always show + Set button first */}
          <div className="add-set-card">
            {showRepsInput ? (
              <div className="reps-input-container">
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
            ) : (
              <div className="add-set-button" onClick={handleAddSet}>
                <Plus size={24} />
                <span>{hasReachedMinimum ? 'Add Bonus Set' : 'Add Set'}</span>
              </div>
            )}
          </div>

          {/* Show completed sets after the add button */}
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
