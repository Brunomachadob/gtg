import './App.css';
import React from 'react';
import { useConfig } from './hooks/useConfig';
import { useSession } from './hooks/useSession';
import { useRouter } from './hooks/useRouter';
import { Navigation, Today, Config, Statistics, About } from './components';

export function App() {
  const { currentPage, navigateTo } = useRouter();
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
        {currentPage === 'today' && (
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
        {currentPage === 'config' && <Config config={config} setConfig={setConfig} />}
        {currentPage === 'stats' && <Statistics />}
        {currentPage === 'about' && <About />}
      </main>

      <Navigation currentPage={currentPage} onPageChange={navigateTo} />
    </div>
  );
}
