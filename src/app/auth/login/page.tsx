'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SocialLogin } from '@/components/auth/social-login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implementar autenticação com Supabase
      console.log('Login:', { email, password });
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Entrar na sua conta</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Aceda ao portal de angariação de propriedades
          </p>
        </div>

        {/* Formulário de Login */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center text-sm">
              Digite o seu email e palavra-passe para aceder
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="o.seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="A sua palavra-passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="remember-me" className="text-xs sm:text-sm text-gray-600">
                    Lembrar de mim
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs sm:text-sm text-primary hover:text-primary/80 text-center sm:text-right"
                >
                  Esqueceu-se da palavra-passe?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <SocialLogin mode="login" />

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  href="/auth/register"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Registe-se aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Links adicionais */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
