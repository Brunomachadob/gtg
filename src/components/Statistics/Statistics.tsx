import React from 'react';
import { Flame, Calendar, Trophy, History, TrendingUp } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import './Statistics.css';

export function Statistics() {
  const stats = useStatistics();

  const sortedDailyEntries = Object.entries(stats.daily)
    .sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="statistics-page">
      <div className="stats-summary">
        <div className="stat-card streak">
          <Flame className="mx-auto mb-2 text-orange-500" size={24} />
          <h3>Current Streak</h3>
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-unit">days</div>
        </div>

        <div className="stat-card weekly">
          <Calendar className="mx-auto mb-2 text-blue-500" size={24} />
          <h3>This Week</h3>
          <div className="stat-value">{stats.weekly}</div>
          <div className="stat-unit">reps</div>
        </div>

        <div className="stat-card monthly">
          <Trophy className="mx-auto mb-2 text-green-500" size={24} />
          <h3>This Month</h3>
          <div className="stat-value">{stats.monthly}</div>
          <div className="stat-unit">reps</div>
        </div>

        <div className="stat-card bonus">
          <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
          <h3>Bonus Days</h3>
          <div className="stat-value">{stats.bonusDays}</div>
          <div className="stat-unit">days exceeded minimum</div>
          {stats.bonusDays > 0 && (
            <div className="bonus-average">
              Avg +{stats.averageBonusSets} sets
            </div>
          )}
        </div>
      </div>

      <div className="daily-history">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-gray-600" size={20} />
          <h3 className="mb-0">Daily History</h3>
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
          <p className="no-data">No workout data yet. Start your first session!</p>
        )}
      </div>
    </div>
  );
}
