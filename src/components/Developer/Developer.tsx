import React from 'react';
import { Code, RotateCcw, Trash2, Download, Upload } from 'lucide-react';
import './Developer.css';

export function Developer() {
  const resetTodaysSets = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    localStorage.removeItem(`gtg_sessions_${todayKey}`);
    alert('Today\'s sets have been reset!');
    // Force a page refresh to update the session state
    window.location.reload();
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL app data? This cannot be undone!')) {
      // Clear all localStorage data related to the app
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('gtg_')) {
          localStorage.removeItem(key);
        }
      });
      alert('All app data has been cleared!');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data: any = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('gtg_')) {
        data[key] = localStorage.getItem(key);
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gtg-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (window.confirm('This will overwrite existing data. Continue?')) {
          Object.entries(data).forEach(([key, value]) => {
            if (key.startsWith('gtg_') && typeof value === 'string') {
              localStorage.setItem(key, value);
            }
          });
          alert('Data imported successfully!');
          window.location.reload();
        }
      } catch (error) {
        alert('Error importing data: Invalid file format');
      }
    };
    reader.readAsText(file);
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
        <div className="developer-section">
          <h3>Session Management</h3>
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
        </div>

        <div className="developer-section">
          <h3>Data Management</h3>
          <div className="developer-controls">
            <button
              className="dev-button export-button"
              onClick={exportData}
              title="Export all app data to JSON file"
            >
              <Download size={16} />
              Export Data
            </button>

            <label className="dev-button import-button" title="Import app data from JSON file">
              <Upload size={16} />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
              />
            </label>

            <button
              className="dev-button danger-button"
              onClick={clearAllData}
              title="Clear all app data - cannot be undone!"
            >
              <Trash2 size={16} />
              Clear All Data
            </button>
          </div>
        </div>

        <div className="developer-section">
          <h3>Environment Info</h3>
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
        </div>
      </div>
    </div>
  );
}
