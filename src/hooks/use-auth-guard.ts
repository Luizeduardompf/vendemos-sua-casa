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
        console.log('🔒 Auth Guard - Verificando token:', token ? 'Encontrado' : 'Não encontrado');
        
        if (!token) {
          console.log('🔒 Token não encontrado, redirecionando para home');
          if (isMounted) {
            setIsAuthenticated(false);
            window.location.href = '/';
          }
          return false;
        }

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Verificar sessão do Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔒 Auth Guard - Sessão Supabase:', session ? 'Válida' : 'Inválida', error ? `Erro: ${error.message}` : '');
        
        // Se não há sessão, tentar usar o token diretamente
        if (error || !session) {
          console.log('🔒 Sessão Supabase inválida, tentando usar token diretamente...');
          
          // Verificar se o token é válido fazendo uma chamada à API
          try {
            const response = await fetch('/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              console.log('🔒 Token válido, permitindo acesso');
              if (isMounted) {
                setIsAuthenticated(true);
              }
              return true;
            } else {
              console.log('🔒 Token inválido, redirecionando para home');
              if (isMounted) {
                setIsAuthenticated(false);
                window.location.href = '/';
              }
              return false;
            }
          } catch (apiError) {
            console.log('🔒 Erro ao verificar token via API, redirecionando para home');
            if (isMounted) {
              setIsAuthenticated(false);
              window.location.href = '/';
            }
            return false;
          }
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
            window.location.href = '/';
          }
          return false;
        }

        if (isMounted) {
          console.log('🔒 Auth Guard - Usuário autenticado com sucesso!');
          setIsAuthenticated(true);
        }
        return true;
      } catch (error) {
        console.error('🔒 Erro na verificação de autenticação:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          window.location.href = '/';
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
          window.location.href = '/';
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
