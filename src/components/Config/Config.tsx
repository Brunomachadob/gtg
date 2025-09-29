import React from 'react';
import { Calendar, Moon } from 'lucide-react';
import { type Config, DAYS, EXERCISES } from '../../types';
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
                className="exercise-select"
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
    </div>
  );
}
