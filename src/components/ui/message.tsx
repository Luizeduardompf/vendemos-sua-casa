'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  onClose?: () => void;
  className?: string;
}

export default function Message({ type, text, onClose, className = '' }: MessageProps) {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };

  if (!text) return null;

  return (
    <div className={`mb-6 ${className}`}>
      <Alert className={`${getAlertStyles()} transition-all duration-300`}>
        <AlertDescription className={`${getTextStyles()} flex items-center justify-between`}>
          <span className="flex-1">{text}</span>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-2 h-auto p-1 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
