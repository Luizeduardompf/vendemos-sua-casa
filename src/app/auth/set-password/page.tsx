'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createBrowserClient } from '@supabase/ssr';

function SetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Se não tem email, redirecionar para login
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validações básicas
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Senha definida com sucesso! Redirecionando para o dashboard...');
        
        // Verificar se ainda temos uma sessão válida
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.log('⚠️ Sessão perdida após definir senha, redirecionando para login');
          setTimeout(() => {
            router.push('/auth/login?message=password_set_success');
          }, 2000);
        } else {
          console.log('✅ Sessão mantida, redirecionando para dashboard');
          // Garantir que o token está salvo
          if (session.access_token) {
            localStorage.setItem('access_token', session.access_token);
          }
          setTimeout(() => {
            router.push('/dashboard/proprietario');
          }, 2000);
        }
      } else {
        setError(data.error || 'Erro ao definir senha');
      }
    } catch (error) {
      console.error('Erro ao definir senha:', error);
      setError('Erro ao definir senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    // Verificar se temos uma sessão válida antes de pular
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('⚠️ Sem sessão válida, redirecionando para login');
      router.push('/auth/login?error=no_session');
    } else {
      console.log('✅ Sessão válida, redirecionando para dashboard');
      // Garantir que o token está salvo
      if (session.access_token) {
        localStorage.setItem('access_token', session.access_token);
      }
      router.push('/dashboard/proprietario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Definir Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Defina uma senha para poder usar email e senha no futuro
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurar Acesso por Email</CardTitle>
            <CardDescription>
              Para {email} - Defina uma senha para ter mais opções de login
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Nova Senha *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirmar Senha *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Definindo senha...' : 'Definir Senha'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="w-full"
                >
                  Pular por agora
                </Button>
              </div>
            </form>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>💡 <strong>Dica:</strong> Com uma senha definida, você poderá:</p>
              <ul className="mt-1 ml-4 list-disc">
                <li>Fazer login com email e senha</li>
                <li>Continuar usando o login social</li>
                <li>Ter mais flexibilidade de acesso</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}
