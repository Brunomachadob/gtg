import React from 'react';
import { Clock } from 'lucide-react';
import './CountdownTimer.css';

interface CountdownTimerProps {
  timeRemaining: number;
  progressPercentage: number;
  formatTime: (ms: number) => string;
  compact?: boolean;
}

export function CountdownTimer({ timeRemaining, progressPercentage, formatTime, compact = false }: CountdownTimerProps) {
  const size = compact ? 60 : 120;
  const radius = compact ? 22 : 45;
  const strokeWidth = compact ? 4 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className={`countdown-timer ${compact ? 'compact' : ''}`}>
      <div className="countdown-circle">
        <svg className="countdown-svg" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="progress-ring"
          />
        </svg>
        <div className="countdown-content">
          <Clock className="countdown-icon" size={compact ? 12 : 20} />
          <div className="countdown-time">{formatTime(timeRemaining)}</div>
          {!compact && <div className="countdown-label">Next reminder</div>}
        </div>
      </div>
    </div>
  );
}
