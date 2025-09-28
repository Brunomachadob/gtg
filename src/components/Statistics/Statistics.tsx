import React from 'react';
import { Flame, Calendar, Trophy, History, TrendingUp } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import './Statistics.css';

export function Statistics() {
  const stats = useStatistics();

  // Get sorted daily entries for total stats
  const sortedDailyEntries = Object.entries(stats.daily)
    .sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="statistics-page">
      {/* Page Header */}
      <div className="stats-header">
        <Trophy className="text-purple-600" size={24} />
        <h2>Statistics Overview</h2>
      </div>

      <div className="stats-summary">
        {/* Current Streak Card */}
        <div className="stat-card streak">
          <Flame className="mx-auto mb-2 text-orange-500" size={24} />
          <h3>Current Streak</h3>
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-unit">days total</div>
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.exerciseStats.pullUps.streak} days</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.exerciseStats.dips.streak} days</span>
            </div>
          </div>
        </div>

        {/* Weekly Stats Card */}
        <div className="stat-card weekly">
          <Calendar className="mx-auto mb-2 text-blue-500" size={24} />
          <h3>This Week</h3>
          <div className="stat-value">{stats.weekly}</div>
          <div className="stat-unit">reps total</div>
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.exerciseStats.pullUps.weekly} reps</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.exerciseStats.dips.weekly} reps</span>
            </div>
          </div>
        </div>

        {/* Monthly Stats Card */}
        <div className="stat-card monthly">
          <Trophy className="mx-auto mb-2 text-green-500" size={24} />
          <h3>This Month</h3>
          <div className="stat-value">{stats.monthly}</div>
          <div className="stat-unit">reps total</div>
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.exerciseStats.pullUps.monthly} reps</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.exerciseStats.dips.monthly} reps</span>
            </div>
          </div>
        </div>

        {/* Bonus Days Card */}
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
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.exerciseStats.pullUps.bonusDays} days</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.exerciseStats.dips.bonusDays} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily History Section */}
      <div className="daily-history">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-gray-600" size={20} />
          <h3 className="mb-0">Daily History - All Exercises</h3>
        </div>
        {sortedDailyEntries.length > 0 ? (
          <div className="history-list">
            {sortedDailyEntries.map(([date, reps]) => (
              <div key={date} className="history-item">
                <span className="history-date">{date}</span>
                <span className="history-reps">{reps} reps total</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">
            No workout data yet. Start your first session!
          </p>
        )}
      </div>
    </div>
  );
}
