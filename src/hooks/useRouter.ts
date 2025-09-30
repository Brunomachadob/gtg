import { useState, useEffect } from 'react';
import { PageType } from '../types';

// Map hash values to page types
const hashToPage: Record<string, PageType> = {
  '#today': 'today',
  '#stats': 'stats',
  '#about': 'about',
  '#developer': 'developer',
};

export function useRouter() {
  const getPageFromHash = (): PageType => {
    return hashToPage[window.location.hash] || 'today';
  };

  const navigateTo = (page: PageType) => {
    window.location.hash = `#${page}`
  };

  const windowReload = () => {
    window.location.reload();
  }

  const [currentPage, setCurrentPage] = useState<PageType>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return {
    currentPage,
    navigateTo,
    windowReload
  };
}
