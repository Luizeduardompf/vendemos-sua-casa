'use client';

import { useEffect } from 'react';
import { resetThemeToLight } from '@/utils/theme-reset';

export function ThemeEnforcer() {
  useEffect(() => {
    // Forçar tema light na inicialização
    resetThemeToLight();
  }, []);

  return null;
}
