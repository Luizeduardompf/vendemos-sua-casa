'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('proprietario');
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['proprietario', 'agente', 'imobiliaria'].includes(type)) {
      setUserType(type);
    }
  }, [searchParams]);

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'agente': return 'Agente';
      case 'imobiliaria': return 'Imobiliária';
      default: return 'Proprietário';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implementar autenticação com Supabase
      console.log('Login:', { email, password, userType });
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Erro ao fazer login. Verifique as suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Entrar como {getUserTypeLabel(userType)}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Aceda ao portal de angariação de propriedades
          </p>
          <div className="mt-2">
            <Link
              href="/auth/select-type"
              className="text-xs text-primary hover:text-primary/80 underline"
            >
              ← Alterar tipo de utilizador
            </Link>
          </div>
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
            {/* Social Login primeiro */}
            <SocialLogin mode="login" userType={userType} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Ou continue com email
                </span>
              </div>
            </div>

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
                {isLoading ? 'A entrar...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  href={`/auth/register?type=${userType}`}
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