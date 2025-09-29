import React, { useState } from 'react';
import { Flame, Calendar, Trophy, TrendingUp, BarChart3 } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import { StorageService } from '../../services/StorageService';
import { DateService } from '../../services/DateService';
import './Statistics.css';

export function Statistics() {
  const stats = useStatistics();
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: {
      date: string;
      dayMonth: string;
      exercise: string;
      reps: number;
    } | null;
  }>({
    show: false,
    x: 0,
    y: 0,
    content: null
  });

  // Handle mouse events for tooltip
  const handleBarMouseEnter = (event: React.MouseEvent, point: any, exercise: 'Pull Ups' | 'Dips', reps: number) => {
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();

    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: {
        date: point.date,
        dayMonth: point.dayMonth,
        exercise,
        reps
      }
    });
  };

  const handleBarMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Prepare graph data for the last 30 days with separate series for each exercise
  const getGraphData = () => {
    const days = 30;
    const today = DateService.getCurrentDate();
    const data = [];
    const sessions = StorageService.getAllSessions();
    const config = StorageService.getConfig();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);

      // Get the day index to determine what exercise was scheduled
      const dayIndex = date.getDay();
      const scheduledExercise = config.days[dayIndex];

      // Get session data for this date
      const sessionData = sessions[dateStr] || [];
      const totalReps = sessionData.reduce((sum: number, reps: number) => sum + reps, 0);

      // Determine which exercise the reps belong to based on the scheduled exercise for that day
      let pullUpsReps = 0;
      let dipsReps = 0;

      if (scheduledExercise === 'Pull Ups') {
        pullUpsReps = totalReps;
      } else if (scheduledExercise === 'Dips') {
        dipsReps = totalReps;
      }

      data.push({
        date: dateStr,
        pullUps: pullUpsReps,
        dips: dipsReps,
        dayMonth: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday: dateStr === DateService.getCurrentDateString()
      });
    }

    return data;
  };

  const graphData = getGraphData();

  // Chart dimensions and calculations - use proper pixel-based approach
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = { top: 20, right: 40, bottom: 60, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate max value for scaling
  const maxReps = Math.max(
    ...graphData.map(d => Math.max(d.pullUps, d.dips)),
    1
  );

  // Bar chart calculations
  const barGroupWidth = innerWidth / graphData.length;
  const barWidth = Math.min(barGroupWidth * 0.35, 15); // Each bar takes 35% of group width, max 15px
  const barSpacing = 2; // Space between the two bars in a group

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

      {/* Daily Progress Graph Section */}
      <div className="daily-progress-graph">
        <div className="graph-header">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-gray-600" size={20} />
            <h3 className="mb-0">30-Day Progress Trends</h3>
          </div>
        </div>

        <div className="chart-container">
          <div className="custom-chart-wrapper">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="custom-bar-chart"
              style={{ width: '100%', height: '300px' }}
            >
              {/* Gradient definitions for card-like styling */}
              <defs>
                <linearGradient id="pullups-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="dips-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding.top + innerHeight - ratio * innerHeight;
                const value = Math.round(ratio * maxReps);
                return (
                  <g key={index}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 5}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="12"
                      fill="#6b7280"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* X-axis */}
              <line
                x1={padding.left}
                y1={padding.top + innerHeight}
                x2={padding.left + innerWidth}
                y2={padding.top + innerHeight}
                stroke="#d1d5db"
                strokeWidth="2"
              />

              {/* Y-axis */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + innerHeight}
                stroke="#d1d5db"
                strokeWidth="2"
              />

              {/* Bars and labels */}
              {graphData.map((point, index) => {
                const groupX = padding.left + (index * barGroupWidth) + (barGroupWidth / 2);

                // Pull Ups bar (left)
                const pullUpsBarX = groupX - barWidth - (barSpacing / 2);
                const pullUpsBarHeight = (point.pullUps / maxReps) * innerHeight;
                const pullUpsBarY = padding.top + innerHeight - pullUpsBarHeight;

                // Dips bar (right)
                const dipsBarX = groupX + (barSpacing / 2);
                const dipsBarHeight = (point.dips / maxReps) * innerHeight;
                const dipsBarY = padding.top + innerHeight - dipsBarHeight;

                return (
                  <g key={point.date}>
                    {/* Pull Ups bar */}
                    {point.pullUps > 0 && (
                      <rect
                        x={pullUpsBarX}
                        y={pullUpsBarY}
                        width={barWidth}
                        height={pullUpsBarHeight}
                        rx="2"
                        className="chart-bar pullups-bar"
                        onMouseEnter={(e) => handleBarMouseEnter(e, point, 'Pull Ups', point.pullUps)}
                        onMouseLeave={handleBarMouseLeave}
                      />
                    )}

                    {/* Dips bar */}
                    {point.dips > 0 && (
                      <rect
                        x={dipsBarX}
                        y={dipsBarY}
                        width={barWidth}
                        height={dipsBarHeight}
                        rx="2"
                        className="chart-bar dips-bar"
                        onMouseEnter={(e) => handleBarMouseEnter(e, point, 'Dips', point.dips)}
                        onMouseLeave={handleBarMouseLeave}
                      />
                    )}

                    {/* Pull Ups value label */}
                    {point.pullUps > 0 && (
                      <text
                        x={pullUpsBarX + barWidth / 2}
                        y={pullUpsBarY - 5}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#2563eb"
                        fontWeight="600"
                      >
                        {point.pullUps}
                      </text>
                    )}

                    {/* Dips value label */}
                    {point.dips > 0 && (
                      <text
                        x={dipsBarX + barWidth / 2}
                        y={dipsBarY - 5}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#dc2626"
                        fontWeight="600"
                      >
                        {point.dips}
                      </text>
                    )}

                    {/* Date labels (every 5th day) */}
                    {index % 5 === 0 && (
                      <text
                        x={groupX}
                        y={padding.top + innerHeight + 20}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6b7280"
                        transform={`rotate(-45 ${groupX} ${padding.top + innerHeight + 20})`}
                      >
                        {point.dayMonth}
                      </text>
                    )}

                    {/* Today indicator */}
                    {point.isToday && (
                      <line
                        x1={groupX}
                        y1={padding.top}
                        x2={groupX}
                        y2={padding.top + innerHeight}
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    )}
                  </g>
                );
              })}

              {/* Y-axis label */}
              <text
                x={15}
                y={padding.top + innerHeight / 2}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
                transform={`rotate(-90 15 ${padding.top + innerHeight / 2})`}
              >
                Reps
              </text>
            </svg>

            {/* Legend */}
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Pull Ups</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                <span>Dips</span>
              </div>
              <div className="legend-item">
                <div className="legend-line today"></div>
                <span>Today</span>
              </div>
            </div>

            {/* Tooltip */}
            {tooltip.show && tooltip.content && (
              <div
                className="tooltip"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div>{tooltip.content.dayMonth}</div>
                <div>{tooltip.content.exercise}: {tooltip.content.reps} reps</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
