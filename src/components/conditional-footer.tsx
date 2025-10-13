'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Esconder footer quando estiver no dashboard
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  
  return <Footer />;
}
