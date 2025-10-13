'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AccountLinkingInfoProps {
  onDismiss?: () => void;
}

export default function AccountLinkingInfo({ onDismiss }: AccountLinkingInfoProps) {
  return (
    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <div className="space-y-2">
              <p className="font-medium">💡 Dica: Vinculação de Contas</p>
              <p className="text-sm">
                Se você se registrou com Google e quer usar email/senha (ou vice-versa), 
                use o mesmo email em ambos os métodos. O sistema irá unificar automaticamente as suas contas.
              </p>
              <div className="text-xs text-blue-600 dark:text-blue-300">
                <p>• Mesmo email = Mesma conta</p>
                <p>• Pode usar qualquer método de login</p>
                <p>• Dados são preservados</p>
              </div>
            </div>
          </AlertDescription>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0 h-auto p-1"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
    </Alert>
  );
}
