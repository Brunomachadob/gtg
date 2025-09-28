import './App.css';
import React, { useState } from 'react';
import { PageType } from './types';
import { useConfig } from './hooks/useConfig';
import { useSession } from './hooks/useSession';
import { Navigation, Today, Config, Statistics } from './components';

export function App() {
  const [page, setPage] = useState<PageType>('today');
  const { config, setConfig } = useConfig();

  // Get session data for countdown integration
  const todayIdx = new Date().getDay();
  const todayExercise = config.days[todayIdx];
  const isRestDay = todayExercise === 'Rest';

  const {
    setsDone,
    reminder,
    timeRemaining,
    progressPercentage: countdownProgress,
    formatTime,
    dismissReminder
  } = useSession(config.sets, config.reminderIntervalMinutes);

  const shouldShowCountdown = !isRestDay && setsDone.some((r: number) => r === 0);

  return (
    <div className="app">
      <main className="app-content">
        {page === 'today' && (
          <Today
            config={config}
            todayExercise={todayExercise}
            countdown={shouldShowCountdown ? {
              reminder,
              timeRemaining,
              countdownProgress,
              formatTime,
              dismissReminder
            } : undefined}
          />
        )}
        {page === 'config' && <Config config={config} setConfig={setConfig} />}
        {page === 'stats' && <Statistics />}
      </main>

      <Navigation currentPage={page} onPageChange={setPage} />
    </div>
  );
}
