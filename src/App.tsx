import './App.css';
import React from 'react';
import { useConfig } from './hooks/useConfig';
import { useRouter } from './hooks/useRouter';
import { Navigation, Today, Statistics, About, Developer } from './components';

export function App() {
  const { currentPage, navigateTo } = useRouter();

  return (
    <div className="app">
      <main className="app-content">
        {currentPage === 'today' && <Today navigateTo={navigateTo}/>}
        {currentPage === 'stats' && <Statistics />}
        {currentPage === 'about' && <About />}
        {currentPage === 'developer' && <Developer />}
      </main>

      <Navigation currentPage={currentPage} onPageChange={navigateTo} />
    </div>
  );
}
