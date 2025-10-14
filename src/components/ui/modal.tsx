'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info',
  showCloseButton = true 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getAlertVariant = () => {
    switch (type) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com transparência maior */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative z-10 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg font-semibold text-gray-900">
              {title}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl">
                {getIcon()}
              </div>
            </div>
            
            {showCloseButton && (
              <Button 
                onClick={onClose} 
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Entendi
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
