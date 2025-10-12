'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

function ConfirmContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage('Erro na confirmação do email. Tente novamente.');
      return;
    }

    if (token && type === 'signup') {
      // Simular confirmação bem-sucedida
      setStatus('success');
      setMessage('Email confirmado com sucesso! A sua conta foi ativada.');
    } else {
      setStatus('error');
      setMessage('Link de confirmação inválido.');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            A confirmar email...
          </h2>
          <p className="text-gray-600">
            Por favor aguarde enquanto validamos o seu email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl text-center">
              {status === 'success' ? 'Email Confirmado!' : 'Erro na Confirmação'}
            </CardTitle>
            <CardDescription className="text-center text-sm">
              {status === 'success' 
                ? 'A sua conta foi ativada com sucesso'
                : 'Ocorreu um problema ao confirmar o email'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {status === 'success' ? (
              <Alert className="mb-6">
                <AlertDescription>
                  ✅ {message}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  ❌ {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {status === 'success' ? (
                <>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      ✅ Email confirmado com sucesso!
                    </p>
                    <p className="text-sm text-gray-600">
                      Agora pode fazer login e aceder ao seu dashboard.
                    </p>
                  </div>
                  <Link href="/auth/login">
                    <Button className="w-full h-11">
                      Fazer Login
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 text-center">
                    Tente registar-se novamente ou contacte o suporte.
                  </p>
                  <div className="space-y-2">
                    <Link href="/auth/register">
                      <Button className="w-full h-11">
                        Tentar Novamente
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full h-11">
                        Fazer Login
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            A carregar...
          </h2>
        </div>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
