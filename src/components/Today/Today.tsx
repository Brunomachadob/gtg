import React, { useState } from 'react';
import { Bed, Plus } from 'lucide-react';
import { Config } from '../../types';
import { useSession } from '../../hooks/useSession';
import './Today.css';

interface TodayProps {
  config: Config;
}

export function Today({ config }: TodayProps) {
  const todayIdx = new Date().getDay();
  const todayExercise = config.days[todayIdx];
  const [showRepsInput, setShowRepsInput] = useState(false);
  const [newSetReps, setNewSetReps] = useState(0);

  // Get session data for set cards (countdown is handled in header)
  const {
    setsDone,
    repsInputs,
    flipped,
    markSetDone,
    flipCard,
    updateReps,
    addSetWithReps
  } = useSession(config.sets, config.reminderIntervalMinutes);

  // Ensure setsDone array length matches config.sets
  const normalizedSetsDone = setsDone.slice(0, config.sets);
  while (normalizedSetsDone.length < config.sets) {
    normalizedSetsDone.push(0);
  }

  // Calculate completed sets
  const completedSets = setsDone.filter((reps: number) => reps > 0).length;
  const progressPercentage = Math.min((completedSets / config.sets) * 100, 100); // Cap at 100%
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
      {/* Progress Counter */}
      <div className="progress-counter">
        <div
          key={`progress-${completedSets}-${config.sets}`}
          className="progress-bubble"
          style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties}
        >
          <span className="progress-text">
            {completedSets} / {config.sets}{hasReachedMinimum && completedSets > config.sets ? '+' : ''} sets
          </span>
        </div>
      </div>

      {/* Completion message right below the counter */}
      {hasReachedMinimum && (
        <p className="completion-message">
          {completedSets === config.sets
            ? "Minimum sets completed! 🎉"
            : `Great job! ${completedSets - config.sets} bonus set${completedSets - config.sets > 1 ? 's' : ''}! 🔥`
          }
        </p>
      )}

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
  );
}
