import React from 'react';
import { Calendar, Moon, Clock, Code, RotateCcw, Hash } from 'lucide-react';
import { Config, DAYS, EXERCISES } from '../../types';
import { isDevelopment } from '../../utils/environment';
import { StorageService } from '../../services/StorageService';
import './Config.css';

interface ConfigProps {
  config: Config;
  setConfig: (config: Config) => void;
}

export function Config({ config, setConfig }: ConfigProps) {
  const updateDay = (dayIndex: number, exercise: string) => {
    const days = [...config.days];
    days[dayIndex] = exercise as any;
    setConfig({ ...config, days });
  };

  const updateSets = (sets: number) => {
    setConfig({ ...config, sets });
  };

  const resetTodaysSets = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    localStorage.removeItem(`gtg_sessions_${todayKey}`);
    alert('Today\'s sets have been reset!');
    // Force a page refresh to update the session state
    window.location.reload();
  };

  return (
    <div className="config-page">
      <div className="config-section">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-600" size={20} />
          <h3 className="mb-0">Exercise Schedule</h3>
        </div>
        <div className="days-grid">
          {DAYS.map((day: string, i: number) => (
            <div key={day} className={`day-card ${config.days[i] === 'Rest' ? 'rest-day' : ''}`}>
              <div className="day-name">
                {config.days[i] === 'Rest' && <Moon className="inline mr-1" size={16} />}
                {day}
              </div>
              <select
                value={config.days[i]}
                onChange={e => updateDay(i, e.target.value)}
                className="exercise-select"
              >
                {EXERCISES.map((ex: string) => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="text-green-600" size={20} />
          <h3 className="mb-0">Sets Configuration</h3>
        </div>
        <div className="sets-config">
          <label htmlFor="sets-input">Sets per day: </label>
          <input
            id="sets-input"
            type="number"
            min={1}
            max={20}
            value={config.sets}
            onChange={e => updateSets(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="config-section">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-purple-600" size={20} />
          <h3 className="mb-0">Reminder Settings</h3>
        </div>
        <div className="sets-config">
          <label htmlFor="reminder-input">Reminder interval (minutes): </label>
          <input
            id="reminder-input"
            type="number"
            min={1}
            max={240}
            value={config.reminderIntervalMinutes}
            onChange={e => setConfig({ ...config, reminderIntervalMinutes: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Developer Section - Only visible in development mode */}
      {isDevelopment() && (
        <div className="config-section developer-section">
          <div className="flex items-center gap-2 mb-4">
            <Code className="text-red-600" size={20} />
            <h3 className="mb-0">Developer</h3>
            <span className="dev-badge">DEV</span>
          </div>
          <div className="developer-controls">
            <button
              className="reset-button"
              onClick={resetTodaysSets}
              title="Reset all sets for today"
            >
              <RotateCcw size={16} />
              Reset Today's Sets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
