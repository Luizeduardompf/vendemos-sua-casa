'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  ArrowLeft, 
  Home,
  LogIn,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Acesso Restrito
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Apenas o proprietário ou pessoas autorizadas podem visualizar este imóvel.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Informação Importante
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Para visualizar este imóvel, você precisa ser o proprietário registrado ou ter permissão de acesso.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auth/login')}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir para Início
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => window.close()}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Fechar Aba
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Se você acredita que deveria ter acesso a este imóvel, entre em contacto connosco.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
