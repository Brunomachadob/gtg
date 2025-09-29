import React from 'react';
import { Calendar, BarChart3, Info, Code } from 'lucide-react';
import { PageType } from '../../types';
import { isDevelopment } from '../../utils/environment';
import './Navigation.css';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <button
        className={currentPage === 'stats' ? 'active' : ''}
        onClick={() => onPageChange('stats')}
      >
        <BarChart3 size={20} />
        <span>Statistics</span>
      </button>
        <button
            className={currentPage === 'today' ? 'active' : ''}
            onClick={() => onPageChange('today')}
        >
            <Calendar size={28} />
            <span>Today</span>
        </button>
      <button
        className={currentPage === 'about' ? 'active' : ''}
        onClick={() => onPageChange('about')}
      >
        <Info size={20} />
        <span>About</span>
      </button>
      {isDevelopment() && (
        <button
          className={currentPage === 'developer' ? 'active' : ''}
          onClick={() => onPageChange('developer')}
        >
          <Code size={20} />
          <span>Dev</span>
        </button>
      )}
    </nav>
  );
}
