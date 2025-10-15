'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'success' | 'danger';
  isLoading?: boolean;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  isLoading = false
}: ConfirmationModalProps) {
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

  const getIcon = () => {
    switch (type) {
      case 'success': 
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'danger': 
        return <XCircle className="h-12 w-12 text-red-500" />;
      default: 
        return <AlertTriangle className="h-12 w-12 text-orange-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'success': 
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger': 
        return 'bg-red-600 hover:bg-red-700 text-white';
      default: 
        return 'bg-orange-600 hover:bg-orange-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
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
            <div className="flex items-center justify-center mb-6">
              {getIcon()}
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={onClose} 
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button 
                onClick={onConfirm}
                className={`flex-1 ${getConfirmButtonStyle()}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : confirmText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

