'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SocialLogin } from '@/components/auth/social-login';
import { createBrowserClient } from '@supabase/ssr';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('proprietario');
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
      // Usar Supabase Auth diretamente
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Erro no login:', authError);
        
        // Verificar se é erro de confirmação de email
        if (authError.message.includes('Email not confirmed') || authError.code === 'email_not_confirmed') {
          setError(`📧 Email não confirmado.\n\nPor favor, verifique a sua caixa de correio e clique no link de confirmação antes de fazer login.`);
          setIsLoading(false);
          return;
        }
        
        // Verificar se é erro de credenciais inválidas
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email ou password incorretos');
          setIsLoading(false);
          return;
        }
        
        throw new Error(authError.message || 'Erro ao fazer login');
      }

      if (!authData.user) {
        throw new Error('Falha no login');
      }

      // Sucesso - verificar se o perfil existe
      console.log('✅ Login bem-sucedido!');
      console.log('🔵 User ID:', authData.user.id);
      console.log('🔵 Session:', authData.session ? 'Válida' : 'Inválida');
      
      // Salvar token no localStorage
      if (authData.session?.access_token) {
        localStorage.setItem('access_token', authData.session.access_token);
        console.log('🔵 Token salvo no localStorage');
      }
      
      // Mostrar mensagem de sucesso
      setError(null);
      setSuccess('✅ Login realizado com sucesso! Redirecionando...');
      setIsLoading(false);
      
      // Redirecionar para dashboard do proprietário
      const dashboardUrl = '/dashboard/proprietario';
      console.log('🔵 Redirecionando para dashboard:', dashboardUrl);
      
      // Aguardar um pouco mais para garantir que o token seja processado
      setTimeout(() => {
        console.log('🔵 Executando redirecionamento...');
        window.location.href = dashboardUrl;
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login. Verifique as suas credenciais.');
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
                  <AlertDescription className="whitespace-pre-line">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription className="whitespace-pre-line">
                    {success}
                  </AlertDescription>
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

export default function LoginPage() {
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
      <LoginContent />
    </Suspense>
  );
}