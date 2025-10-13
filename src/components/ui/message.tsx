'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  text?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Message({ type, text, title, description, icon, onClose, className = '' }: MessageProps) {
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

  if (!text && !title && !description) return null;

  return (
    <div className={`mb-6 ${className}`}>
      <Alert className={`${getAlertStyles()} transition-all duration-300`}>
        <AlertDescription className={`${getTextStyles()}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {icon && (
                <div className="flex-shrink-0 mt-0.5">
                  {icon}
                </div>
              )}
              <div className="flex-1">
                {title && (
                  <h3 className="font-medium mb-1">{title}</h3>
                )}
                {description && (
                  <p className="text-sm opacity-90">{description}</p>
                )}
                {text && (
                  <p className="text-sm">{text}</p>
                )}
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-2 h-auto p-1 hover:bg-transparent flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default Message;
