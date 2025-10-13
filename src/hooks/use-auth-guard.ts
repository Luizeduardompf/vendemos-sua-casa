'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function useAuthGuard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Verificação rápida do token primeiro
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('🔒 Token não encontrado, redirecionando para home');
          if (isMounted) {
            setIsAuthenticated(false);
            router.push('/');
          }
          return false;
        }

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Verificar sessão do Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.log('🔒 Sessão inválida, redirecionando para home');
          if (isMounted) {
            setIsAuthenticated(false);
            router.push('/');
          }
          return false;
        }

        // Verificação do usuário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, user_type')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        if (userError || !userData) {
          console.log('🔒 Usuário não encontrado, redirecionando para home');
          if (isMounted) {
            setIsAuthenticated(false);
            router.push('/');
          }
          return false;
        }

        if (isMounted) {
          setIsAuthenticated(true);
        }
        return true;
      } catch (error) {
        console.error('🔒 Erro na verificação de autenticação:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          router.push('/');
        }
        return false;
      }
    };

    // Verificação inicial simples
    checkAuth().finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    // Monitoramento apenas de logout
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (!isMounted) return;
        
        if (event === 'SIGNED_OUT') {
          console.log('🔒 Usuário deslogado, redirecionando para home');
          setIsAuthenticated(false);
          router.push('/');
        }
      }
    );

    // Cleanup
    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router]);

  return { isLoading, isAuthenticated };
}
