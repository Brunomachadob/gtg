import React from 'react';
import { Calendar, Settings, BarChart3, Info } from 'lucide-react';
import { PageType } from '../../types';
import './Navigation.css';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <button
        className={`main-button ${currentPage === 'today' ? 'active' : ''}`}
        onClick={() => onPageChange('today')}
      >
        <Calendar size={28} />
        <span>Today</span>
      </button>
      <button
        className={currentPage === 'config' ? 'active' : ''}
        onClick={() => onPageChange('config')}
      >
        <Settings size={20} />
        <span>Configure</span>
      </button>
      <button
        className={currentPage === 'stats' ? 'active' : ''}
        onClick={() => onPageChange('stats')}
      >
        <BarChart3 size={20} />
        <span>Statistics</span>
      </button>
      <button
        className={currentPage === 'about' ? 'active' : ''}
        onClick={() => onPageChange('about')}
      >
        <Info size={20} />
        <span>About</span>
      </button>
    </nav>
  );
}
