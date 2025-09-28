import './App.css';
import React, { useState } from 'react';
import { PageType } from './types';
import { useConfig } from './hooks/useConfig';
import { useSession } from './hooks/useSession';
import { Navigation, Today, Config, Statistics, CountdownTimer } from './components';

export function App() {
  const [page, setPage] = useState<PageType>('today');
  const { config, setConfig } = useConfig();

  // Get session data for header countdown
  const todayIdx = new Date().getDay();
  const todayExercise = config.days[todayIdx];
  const isRestDay = todayExercise === 'Rest';

  const {
    setsDone,
    reminder,
    timeRemaining,
    progressPercentage,
    formatTime,
    dismissReminder
  } = useSession(config.sets, config.reminderIntervalMinutes);

  const getPageTitle = () => {
    switch (page) {
      case 'today':
        return isRestDay ? "Today's Session - Rest Day" : `Today's Session - ${todayExercise}`;
      case 'config': return 'Configure Exercises';
      case 'stats': return 'Statistics';
      default: return 'Grease the Groove';
    }
  };

  const shouldShowCountdown = !isRestDay && setsDone.some((r: number) => r === 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>{getPageTitle()}</h1>
        {shouldShowCountdown && (
          <div className="header-countdown">
            {reminder ? (
              <div className="header-reminder">
                <span className="reminder-text">Time for your set!</span>
                <button className="dismiss-btn" onClick={dismissReminder}>Dismiss</button>
              </div>
            ) : timeRemaining > 0 ? (
              <CountdownTimer
                timeRemaining={timeRemaining}
                progressPercentage={progressPercentage}
                formatTime={formatTime}
                compact={true}
              />
            ) : null}
          </div>
        )}
      </header>

      <main className="app-content">
        {page === 'today' && <Today config={config} />}
        {page === 'config' && <Config config={config} setConfig={setConfig} />}
        {page === 'stats' && <Statistics />}
      </main>

      <Navigation currentPage={page} onPageChange={setPage} />
    </div>
  );
}
