import React from 'react';
import './SetCard.css';

interface SetCardProps {
  setNumber: number;
  reps: number;
  repsInput: number;
  isFlipped: boolean;
  onFlip: () => void;
  onRepsChange: (value: number) => void;
  onMarkDone: () => void;
}

export function SetCard({
  setNumber,
  reps,
  repsInput,
  isFlipped,
  onFlip,
  onRepsChange,
  onMarkDone
}: SetCardProps) {
  const isDone = reps > 0;

  return (
    <div
      className={`set-card${isFlipped ? ' flipped' : ''}${isDone ? ' done' : ''}`}
      onClick={onFlip}
      style={{ cursor: isDone ? 'default' : 'pointer' }}
    >
      <div className="set-card-inner">
        <div className="set-card-front">
          <div>Set {setNumber}</div>
          <div>{isDone ? `${reps} reps` : 'Not done'}</div>
        </div>
        <div className="set-card-back">
          <div>How many reps?</div>
          <input
            type="number"
            min={1}
            value={repsInput}
            onClick={e => e.stopPropagation()}
            onChange={e => onRepsChange(Number(e.target.value))}
            disabled={isDone}
          />
          <button
            onClick={e => { e.stopPropagation(); onMarkDone(); }}
            disabled={isDone || repsInput <= 0}
          >
            Mark as done
          </button>
          <button
            onClick={e => { e.stopPropagation(); onFlip(); }}
            disabled={isDone}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
