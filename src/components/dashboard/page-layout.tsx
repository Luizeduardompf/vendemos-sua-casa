'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  message?: ReactNode;
}

export function PageLayout({ 
  title, 
  description, 
  children, 
  className = '',
  message
}: PageLayoutProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header da página */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {description}
          </p>
        )}
      </div>

      {/* Mensagem de feedback */}
      {message}

      {/* Container principal com cartão */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para seções dentro do cartão principal
interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, children, className = '' }: SectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

// Componente para grid de duas colunas
interface TwoColumnGridProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export function TwoColumnGrid({ left, right, className = '' }: TwoColumnGridProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <div className="space-y-4">
        {left}
      </div>
      <div className="space-y-4">
        {right}
      </div>
    </div>
  );
}

export default PageLayout;
