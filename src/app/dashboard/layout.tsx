'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { useTheme } from '@/hooks/use-theme';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { createBrowserClient } from '@supabase/ssr';
import './globals.css';
import './dynamic-styles.css';

interface User {
  id: string;
  email: string;
  nome_completo: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
  foto_perfil?: string;
  primeiro_nome?: string;
  ultimo_nome?: string;
  nome_exibicao?: string;
  provedor?: string;
  localizacao?: string;
  email_verificado?: boolean;
  dados_sociais?: any;
  foto_manual?: boolean;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [configuracoes, setConfiguracoes] = useState({
    modo_escuro: false,
    tema_cor: 'azul',
    tamanho_fonte: 'medio',
    compacto: false,
    animacoes: true
  });
  const router = useRouter();
  const { theme } = useTheme();
  const { isLoading: authLoading, isAuthenticated } = useAuthGuard();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Função para carregar configurações do usuário
  const loadConfiguracoes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/user/settings/bypass', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setConfiguracoes(data.settings);
          applyStyles(data.settings);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  // Função para aplicar estilos dinâmicos
  const applyStyles = (config: any) => {
    const body = document.body;
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    // Remover classes antigas
    body.classList.remove('theme-azul', 'theme-verde', 'theme-roxo', 'theme-laranja', 'theme-vermelho');
    body.classList.remove('font-pequeno', 'font-medio', 'font-grande');
    body.classList.remove('compacto');
    body.classList.remove('animacoes-desabilitadas', 'animacoes-habilitadas');
    body.classList.remove('dark');
    
    // Aplicar novas classes
    body.classList.add(`theme-${config.tema_cor || 'azul'}`);
    body.classList.add(`font-${config.tamanho_fonte || 'medio'}`);
    
    // Aplicar modo escuro
    if (config.modo_escuro) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    
    if (config.compacto) {
      body.classList.add('compacto');
    }
    
    if (config.animacoes === false) {
      body.classList.add('animacoes-desabilitadas');
    } else {
      body.classList.add('animacoes-habilitadas');
    }
    
    // Aplicar variáveis CSS diretamente
    if (dashboardContainer) {
      const root = document.documentElement;
      
      // Aplicar cores do tema
      const themeColors = {
        azul: { primary: '#3b82f6', secondary: '#1e40af', accent: '#dbeafe' },
        verde: { primary: '#10b981', secondary: '#047857', accent: '#d1fae5' },
        roxo: { primary: '#8b5cf6', secondary: '#6d28d9', accent: '#ede9fe' },
        laranja: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' },
        vermelho: { primary: '#ef4444', secondary: '#dc2626', accent: '#fecaca' }
      };
      
      const theme = config.tema_cor || 'azul';
      const colors = themeColors[theme as keyof typeof themeColors];
      
      root.style.setProperty('--theme-color-primary', colors.primary);
      root.style.setProperty('--theme-color-secondary', colors.secondary);
      root.style.setProperty('--theme-color-accent', colors.accent);
      
      // Aplicar tamanho de fonte
      const fontSizes = {
        pequeno: '12px',
        medio: '14px',
        grande: '16px'
      };
      
      const fontSize = config.tamanho_fonte || 'medio';
      root.style.setProperty('--font-size-base', fontSizes[fontSize as keyof typeof fontSizes]);
      
      // Aplicar modo compacto
      if (config.compacto) {
        root.style.setProperty('--spacing-base', '0.75rem');
      } else {
        root.style.setProperty('--spacing-base', '1rem');
      }
      
      // Aplicar animações
      if (config.animacoes === false) {
        root.style.setProperty('--animation-duration', '0s');
      } else {
        root.style.setProperty('--animation-duration', '0.3s');
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      // Se ainda está verificando autenticação, aguardar
      if (authLoading) {
        return;
      }

      // Se não está autenticado, o hook já redirecionou
      if (!isAuthenticated) {
        return;
      }

      try {
        console.log('🔵 Dashboard Layout - Buscando perfil do utilizador...');
        
        // Verificar sessão atual do Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔵 Dashboard Layout - Sessão:', session ? 'Encontrada' : 'Não encontrada');
        console.log('🔵 Dashboard Layout - Session Error:', sessionError);
        console.log('🔵 Dashboard Layout - Session User ID:', session?.user?.id);
        console.log('🔵 Dashboard Layout - Session User Email:', session?.user?.email);
        
        if (sessionError || !session?.user) {
          console.log('🔵 Dashboard Layout - Sessão inválida, redirecionando para home');
          console.log('🔵 Dashboard Layout - Motivo:', sessionError ? 'Erro na sessão' : 'Usuário não encontrado');
          router.push('/');
          return;
        }
        
        // Buscar dados do usuário na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        if (userError) {
          console.error('🔵 Dashboard Layout - Erro ao buscar dados do usuário:', userError);
          router.push('/');
          return;
        }

        if (!userData) {
          console.log('🔵 Dashboard Layout - Usuário não encontrado na tabela users, redirecionando para home');
          router.push('/');
          return;
        }

        console.log('🔵 Dashboard Layout - Dados do usuário encontrados:', userData);
        console.log('🔵 Dashboard Layout - Foto do perfil:', userData.foto_perfil);

        setUser(userData);
        loadConfiguracoes();
      } catch (error) {
        console.error('🔵 Dashboard Layout - Erro ao buscar dados do usuário:', error);
        router.push('/');
      }
    };

    fetchUser();
  }, [authLoading, isAuthenticated, router, supabase]);

  // Aplicar estilos quando configurações mudarem
  useEffect(() => {
    if (user) {
      applyStyles(configuracoes);
    }
  }, [configuracoes, user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">A verificar autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (já foi redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  // Mostrar loading enquanto carrega dados do usuário
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">A carregar dados do utilizador...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dashboard-container">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar 
            userPhoto={user.foto_perfil}
            userEmail={user.email}
            userName={user.nome_completo}
            userType={user.user_type}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Dashboard - {user.nome_completo}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {user.user_type}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Notificação */}
                  <div className="relative">
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM15 17h5l-5 5v-5z" />
                      </svg>
                    </button>
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      5
                    </span>
                  </div>
                  
                  {/* Logout */}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="transition-colors duration-300"
                  >
                    Sair
                  </Button>
                </div>
              </div>
            </header>
            
            {/* Page Content */}
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}