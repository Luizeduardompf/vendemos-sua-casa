'use client';

import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { applyUserTheme } from '@/utils/theme-reset';

export function useTheme() {
  const { theme, setTheme: setNextTheme } = useNextTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Forçar tema light por padrão
    setNextTheme('light');
    applyUserTheme(false);
    setIsLoaded(true);
  }, [setNextTheme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    if (isLoaded) {
      setNextTheme(newTheme);
      applyUserTheme(newTheme === 'dark');
    }
  };

  const toggleTheme = () => {
    if (isLoaded) {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setNextTheme(newTheme);
      applyUserTheme(newTheme === 'dark');
    }
  };

  return {
    theme: isLoaded ? theme : 'light',
    setTheme,
    toggleTheme,
    isLoaded
  };
}
