'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function useAuthGuard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let subscription: any = null;

    const checkAuth = async () => {
      try {
        // Evitar múltiplas verificações simultâneas
        if (hasRedirected.current) return false;

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Verificação rápida do token primeiro
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('🔒 Token não encontrado, redirecionando para home');
          if (isMounted && !hasRedirected.current) {
            hasRedirected.current = true;
            setIsAuthenticated(false);
            router.push('/');
          }
          return false;
        }

        // Verificar sessão do Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.log('🔒 Sessão inválida, redirecionando para home');
          if (isMounted && !hasRedirected.current) {
            hasRedirected.current = true;
            setIsAuthenticated(false);
            router.push('/');
          }
          return false;
        }

        // Verificação rápida do usuário (sem aguardar muito)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, user_type')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        if (userError || !userData) {
          console.log('🔒 Usuário não encontrado, redirecionando para home');
          if (isMounted && !hasRedirected.current) {
            hasRedirected.current = true;
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
        if (isMounted && !hasRedirected.current) {
          hasRedirected.current = true;
          setIsAuthenticated(false);
          router.push('/');
        }
        return false;
      }
    };

    // Verificação inicial com timeout
    const initAuth = async () => {
      try {
        await Promise.race([
          checkAuth(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);
      } catch (error) {
        console.error('🔒 Timeout na verificação inicial:', error);
        if (isMounted && !hasRedirected.current) {
          hasRedirected.current = true;
          setIsAuthenticated(false);
          router.push('/');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Monitoramento simplificado da sessão
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    subscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log('🔒 Auth state changed:', event);
        
        if (event === 'SIGNED_OUT' || !session) {
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            setIsAuthenticated(false);
            router.push('/');
          }
        }
      }
    );

    // Cleanup
    return () => {
      isMounted = false;
      if (subscription?.data?.subscription) {
        subscription.data.subscription.unsubscribe();
      }
    };
  }, [router]);

  return { isLoading, isAuthenticated };
}
