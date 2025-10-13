'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function useAuthGuard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        setIsAuthenticated(false);
        router.push('/');
        return false;
      }

      if (!session) {
        console.log('Nenhuma sessão ativa encontrada, redirecionando para home');
        setIsAuthenticated(false);
        router.push('/');
        return false;
      }

      // Verificar se o token ainda é válido
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('Token não encontrado no localStorage, redirecionando para home');
        setIsAuthenticated(false);
        router.push('/');
        return false;
      }

      // Verificar se o usuário existe na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, user_type')
        .eq('auth_user_id', session.user.id)
        .maybeSingle();

      if (userError) {
        console.error('Erro ao verificar usuário:', userError);
        setIsAuthenticated(false);
        router.push('/');
        return false;
      }

      if (!userData) {
        console.log('Usuário não encontrado na tabela users, redirecionando para home');
        setIsAuthenticated(false);
        router.push('/');
        return false;
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      setIsAuthenticated(false);
      router.push('/');
      return false;
    }
  };

  useEffect(() => {
    // Verificação inicial
    checkAuth().finally(() => {
      setIsLoading(false);
    });

    // Monitorar mudanças na sessão
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔒 Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log('🔒 Usuário deslogado, redirecionando para home');
          setIsAuthenticated(false);
          router.push('/');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('🔒 Sessão renovada, verificando autenticação');
          await checkAuth();
        }
      }
    );

    // Monitorar mudanças no localStorage (para detectar "Limpar Sessão")
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) {
        console.log('🔒 Token removido do localStorage, redirecionando para home');
        setIsAuthenticated(false);
        router.push('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Monitorar mudanças no localStorage da mesma aba
    const checkTokenPeriodically = setInterval(() => {
      const token = localStorage.getItem('access_token');
      if (!token && isAuthenticated) {
        console.log('🔒 Token removido (verificação periódica), redirecionando para home');
        setIsAuthenticated(false);
        router.push('/');
      }
    }, 1000); // Verificar a cada segundo

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkTokenPeriodically);
    };
  }, [router, isAuthenticated]);

  return { isLoading, isAuthenticated };
}
