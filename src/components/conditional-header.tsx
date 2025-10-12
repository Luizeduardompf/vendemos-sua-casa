'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Esconder header quando estiver no dashboard
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  
  return <Header />;
}
