import React, { useState, useEffect } from 'react';
import { Code, RotateCcw, Trash2, Calendar, Clock } from 'lucide-react';
import { DateService } from '../../services/DateService';
import {StorageService} from "../../services/StorageService.ts";
import { Card } from '../Card/Card';
import {useRouter} from "../../hooks/useRouter.ts";
import './Developer.css';

export function Developer() {
  const [mockDate, setMockDate] = useState<string>('');
  const [isMockActive, setIsMockActive] = useState(false);
  const { windowReload } = useRouter()

  useEffect(() => {
    // Initialize mock date state
    const currentMockDate = DateService.getMockDate();
    if (currentMockDate) {
      setMockDate(currentMockDate.toISOString().slice(0, 10));
      setIsMockActive(true);
    } else {
      setMockDate(new Date().toISOString().slice(0, 10));
      setIsMockActive(false);
    }
  }, []);

  const handleSetMockDate = () => {
    if (mockDate) {
      DateService.setMockDate(new Date(mockDate));
      setIsMockActive(true);
      alert(`Mock date set to: ${mockDate}`);
      windowReload();
    }
  };

  const handleClearMockDate = () => {
    DateService.clearMockDate();
    setIsMockActive(false);
    setMockDate(new Date().toISOString().slice(0, 10));
    alert('Mock date cleared. Using real current date.');
    windowReload();
  };

  const resetTodaysSets = () => {
    StorageService.clearDailySets(DateService.getCurrentDateString());
    alert('Today\'s sets have been reset!');
    windowReload();
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL app data? This cannot be undone!')) {
      StorageService.clearAllData();
      alert('All app data has been cleared!');
      windowReload();
    }
  };

  return (
    <div className="developer-page">
      <div className="developer-header">
        <div className="flex items-center gap-2 mb-4">
          <Code className="text-red-600" size={24} />
          <h2 className="mb-0">Developer Tools</h2>
          <span className="dev-badge">DEV MODE</span>
        </div>
        <p className="developer-description">
          Development tools for debugging and data management. These features are only available in development mode.
        </p>
      </div>

      <div className="developer-sections">
        <Card title="Date & Time">
          <div className="date-controls">
            <div className="current-date-info">
              <div className="date-info-item">
                <Clock size={16} />
                <span>Current App Date: <strong>{DateService.getCurrentDateString()}</strong></span>
                {isMockActive && <span className="mock-indicator">MOCK</span>}
              </div>
              <div className="date-info-item">
                <Calendar size={16} />
                <span>Real Date: <strong>{new Date().toISOString().slice(0, 10)}</strong></span>
              </div>
            </div>
            <div className="date-picker-controls">
              <label className="date-label">
                Set Mock Date:
                <input
                  type="date"
                  value={mockDate}
                  onChange={(e) => setMockDate(e.target.value)}
                  className="date-input"
                />
              </label>
              <div className="date-buttons">
                <button
                  className="dev-button set-date-button"
                  onClick={handleSetMockDate}
                  disabled={!mockDate}
                >
                  <Clock size={16} />
                  Set Mock Date
                </button>
                <button
                  className="dev-button clear-date-button"
                  onClick={handleClearMockDate}
                  disabled={!isMockActive}
                >
                  <RotateCcw size={16} />
                  Use Real Date
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Session Management">
          <div className="developer-controls">
            <button
              className="dev-button reset-button"
              onClick={resetTodaysSets}
              title="Reset all sets for today"
            >
              <RotateCcw size={16} />
              Reset Today's Sets
            </button>
          </div>
        </Card>

        <Card title="Data Management">
          <div className="developer-controls">
            <button
              className="dev-button danger-button"
              onClick={clearAllData}
              title="Clear all app data - cannot be undone!"
            >
              <Trash2 size={16} />
              Clear All Data
            </button>
          </div>
        </Card>

        <Card title="Environment Info">
          <div className="env-info">
            <div className="env-item">
              <strong>Mode:</strong> Development
            </div>
            <div className="env-item">
              <strong>Build Date:</strong> {new Date().toLocaleDateString()}
            </div>
            <div className="env-item">
              <strong>User Agent:</strong> {navigator.userAgent}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
