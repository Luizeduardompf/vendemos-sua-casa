'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro na autenticação:', error);
          router.push('/auth/login?error=auth_failed');
          return;
        }

        if (data.session) {
          // Redirecionar para o dashboard do proprietário
          router.push('/dashboard/proprietario');
        } else {
          // Se não há sessão, redirecionar para login
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        router.push('/auth/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          A processar autenticação...
        </h2>
        <p className="text-gray-600">
          Por favor aguarde enquanto completamos o seu login.
        </p>
      </div>
    </div>
  );
}
