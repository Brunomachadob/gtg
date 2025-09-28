import { useState, useEffect } from 'react';
import { PageType } from '../types';

// Map hash values to page types
const hashToPage: Record<string, PageType> = {
  '#today': 'today',
  '#config': 'config',
  '#stats': 'stats',
  '': 'today', // Default to today when no hash
};

const pageToHash: Record<PageType, string> = {
  'today': '#today',
  'config': '#config',
  'stats': '#stats',
};

export function useRouter() {
  const getPageFromHash = (): PageType => {
    const hash = window.location.hash;
    return hashToPage[hash] || 'today';
  };

  const [currentPage, setCurrentPage] = useState<PageType>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      setCurrentPage(newPage);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Set initial hash if none exists
    if (!window.location.hash) {
      window.location.hash = '#today';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (page: PageType) => {
    window.location.hash = pageToHash[page];
    // setCurrentPage will be updated by the hashchange event
  };

  return {
    currentPage,
    navigateTo
  };
}
