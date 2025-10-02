import React, { useState } from 'react';
import { Flame, Calendar, Trophy, TrendingUp, BarChart3 } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import './Statistics.css';
import {Card} from "../Card/Card";

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

  // Chart dimensions and calculations - use proper pixel-based approach
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = { top: 20, right: 40, bottom: 60, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate max value for scaling
  const maxReps = Math.max(
    ...stats.overtime.map(d => Math.max(d.pullUps, d.dips)),
    1
  );

  // Bar chart calculations
  const barGroupWidth = innerWidth / stats.overtime.length;
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
        {/* Weekly Stats Card */}
        <Card
          title="This Week"
        >
          <div className="stat-value">{stats.total.weekly}</div>
          <div className="stat-unit">reps total</div>
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.pullUps.weekly} reps</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.dips.weekly} reps</span>
            </div>
          </div>
        </Card>

        {/* Monthly Stats Card */}
        <Card
          title="This Month"
        >
          <div className="stat-value">{stats.total.monthly}</div>
          <div className="stat-unit">reps total</div>
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.pullUps.monthly} reps</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.dips.monthly} reps</span>
            </div>
          </div>
        </Card>

        {/* Current Streak Card */}
        <Card
          title="Current Streak"
        >
          <div className="stat-value">{stats.total.streak}</div>
          <div className="stat-unit">reps total</div>
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.pullUps.streak} reps</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.dips.streak} reps</span>
            </div>
          </div>
        </Card>

        {/* Bonus Days Card */}
        <Card
          title="Bonus Days"
        >
          <div className="stat-value">{stats.total.bonusDays}</div>
          <div className="stat-unit">days exceeded minimum</div>
          {stats.total.bonusDays > 0 && (
            <div className="bonus-average">
              Avg +{stats.total.averageBonusSets} sets
            </div>
          )}
          <div className="exercise-breakdown">
            <div className="exercise-stat">
              <span className="exercise-name">Pull Ups:</span>
              <span className="exercise-value">{stats.pullUps.bonusDays} days</span>
            </div>
            <div className="exercise-stat">
              <span className="exercise-name">Dips:</span>
              <span className="exercise-value">{stats.dips.bonusDays} days</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="stats-header">
        <BarChart3 className="text-purple-600" size={24} />
        <h2>Progress over time</h2>
      </div>

      {/* Daily Progress Graph Section */}
      <div className="daily-progress-graph">
        <Card
          title="30-Day Progress"
        >
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
            {stats.overtime.map((point, index) => {
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

                  {/* Date labels (every other day) */}
                  {index % 2 === 0 && (
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
        </Card>
      </div>
    </div>
  );
}
