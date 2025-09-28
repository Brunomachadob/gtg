import React, { useState } from 'react';
import { Flame, Calendar, Trophy, History, TrendingUp, Zap, Target } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import './Statistics.css';

type StatView = 'total' | 'pullUps' | 'dips';

export function Statistics() {
  const stats = useStatistics();
  const [activeView, setActiveView] = useState<StatView>('total');

  // Get the appropriate stats based on active view
  const getCurrentStats = () => {
    switch (activeView) {
      case 'pullUps':
        return stats.exerciseStats.pullUps;
      case 'dips':
        return stats.exerciseStats.dips;
      default:
        return {
          daily: stats.daily,
          weekly: stats.weekly,
          monthly: stats.monthly,
          streak: stats.streak,
          bonusDays: stats.bonusDays,
          averageBonusSets: stats.averageBonusSets,
        };
    }
  };

  const currentStats = getCurrentStats();
  const sortedDailyEntries = Object.entries(currentStats.daily)
    .sort(([a], [b]) => b.localeCompare(a));

  const getViewTitle = () => {
    switch (activeView) {
      case 'pullUps':
        return 'Pull Ups Statistics';
      case 'dips':
        return 'Dips Statistics';
      default:
        return 'Total Statistics';
    }
  };

  const getViewIcon = () => {
    switch (activeView) {
      case 'pullUps':
        return <Target className="text-blue-600" size={20} />;
      case 'dips':
        return <Zap className="text-green-600" size={20} />;
      default:
        return <Trophy className="text-purple-600" size={20} />;
    }
  };

  return (
    <div className="statistics-page">
      {/* View Selector Tabs */}
      <div className="stats-tabs">
        <button
          className={`stats-tab ${activeView === 'total' ? 'active' : ''}`}
          onClick={() => setActiveView('total')}
        >
          <Trophy size={16} />
          Total
        </button>
        <button
          className={`stats-tab ${activeView === 'pullUps' ? 'active' : ''}`}
          onClick={() => setActiveView('pullUps')}
        >
          <Target size={16} />
          Pull Ups
        </button>
        <button
          className={`stats-tab ${activeView === 'dips' ? 'active' : ''}`}
          onClick={() => setActiveView('dips')}
        >
          <Zap size={16} />
          Dips
        </button>
      </div>

      {/* Current View Title */}
      <div className="stats-header">
        {getViewIcon()}
        <h2>{getViewTitle()}</h2>
      </div>

      <div className="stats-summary">
        <div className="stat-card streak">
          <Flame className="mx-auto mb-2 text-orange-500" size={24} />
          <h3>Current Streak</h3>
          <div className="stat-value">{currentStats.streak}</div>
          <div className="stat-unit">days</div>
        </div>

        <div className="stat-card weekly">
          <Calendar className="mx-auto mb-2 text-blue-500" size={24} />
          <h3>This Week</h3>
          <div className="stat-value">{currentStats.weekly}</div>
          <div className="stat-unit">reps</div>
        </div>

        <div className="stat-card monthly">
          <Trophy className="mx-auto mb-2 text-green-500" size={24} />
          <h3>This Month</h3>
          <div className="stat-value">{currentStats.monthly}</div>
          <div className="stat-unit">reps</div>
        </div>

        <div className="stat-card bonus">
          <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
          <h3>Bonus Days</h3>
          <div className="stat-value">{currentStats.bonusDays}</div>
          <div className="stat-unit">days exceeded minimum</div>
          {currentStats.bonusDays > 0 && (
            <div className="bonus-average">
              Avg +{currentStats.averageBonusSets} sets
            </div>
          )}
        </div>
      </div>

      <div className="daily-history">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-gray-600" size={20} />
          <h3 className="mb-0">Daily History - {getViewTitle().replace(' Statistics', '')}</h3>
        </div>
        {sortedDailyEntries.length > 0 ? (
          <div className="history-list">
            {sortedDailyEntries.map(([date, reps]) => (
              <div key={date} className="history-item">
                <span className="history-date">{date}</span>
                <span className="history-reps">{reps} reps</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">
            No {activeView === 'total' ? 'workout' : activeView === 'pullUps' ? 'pull ups' : 'dips'} data yet.
            {activeView === 'total' ? ' Start your first session!' : ' Complete some ' + (activeView === 'pullUps' ? 'pull ups' : 'dips') + ' workouts!'}
          </p>
        )}
      </div>
    </div>
  );
}
