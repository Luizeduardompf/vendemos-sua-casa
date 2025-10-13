'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function useAuthGuard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Verificar se há sessão ativa
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          router.push('/');
          return;
        }

        if (!session) {
          console.log('Nenhuma sessão ativa encontrada, redirecionando para home');
          router.push('/');
          return;
        }

        // Verificar se o token ainda é válido
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('Token não encontrado no localStorage, redirecionando para home');
          router.push('/');
          return;
        }

        // Verificar se o usuário existe na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, user_type')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        if (userError) {
          console.error('Erro ao verificar usuário:', userError);
          router.push('/');
          return;
        }

        if (!userData) {
          console.log('Usuário não encontrado na tabela users, redirecionando para home');
          router.push('/');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isLoading, isAuthenticated };
}
