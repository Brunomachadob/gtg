import React from 'react';
import { Calendar, Moon, Code, RotateCcw, Hash } from 'lucide-react';
import { type Config, DAYS, EXERCISES } from '../../types';
import { isDevelopment } from '../../utils/environment';
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
          <h3 className="mb-0">Schedule</h3>
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
                className={`exercise-select ${config.days[i] === '' ? 'unconfigured' : ''}`}
              >
                <option value="" disabled>Select exercise...</option>
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
          <h3 className="mb-0">Configurations</h3>
        </div>
        <div className="sets-reminder-config">
          <div className="config-item">
            <div className="config-item-row">
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
          <div className="config-item">
            <div className="config-item-row">
              <label>Reminder Interval (minutes)</label>
              <input
                type="number"
                min={0}
                max={240}
                value={config.reminderIntervalMinutes}
                onChange={e => setConfig({ ...config, reminderIntervalMinutes: Number(e.target.value) })}
              />
            </div>
            <div className="config-help-text">
              {config.reminderIntervalMinutes === 0
                ? "Reminders are disabled. Set to a positive number to enable."
                : `You'll get a reminder every ${config.reminderIntervalMinutes} minute${config.reminderIntervalMinutes > 1 ? 's' : ''}.`
              }
            </div>
          </div>
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
