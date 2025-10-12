'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { useTheme } from '@/hooks/use-theme';
import './globals.css';
import './dynamic-styles.css';

interface User {
  id: string;
  email: string;
  nome_completo: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [configuracoes, setConfiguracoes] = useState({
    modo_escuro: false,
    tema_cor: 'azul',
    tamanho_fonte: 'medio',
    compacto: false,
    animacoes: true
  });
  const router = useRouter();
  const { theme } = useTheme();

  // Função para carregar configurações do usuário
  const loadConfiguracoes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/user/settings/bypass', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracoes(data.settings);
        applyStyles(data.settings);
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
      try {
        console.log('🔵 Dashboard Layout - Buscando perfil do utilizador...');
        
        // Obter token do localStorage (salvo durante o login)
        const token = localStorage.getItem('access_token');
        console.log('🔵 Dashboard Layout - Token:', token ? 'Encontrado' : 'Não encontrado');
        
        if (!token) {
          console.log('🔵 Dashboard Layout - Token não encontrado, redirecionando para login');
          router.push('/auth/login');
          return;
        }
        
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('🔵 Dashboard Layout - Status da resposta:', response.status);
        const data = await response.json();
        console.log('🔵 Dashboard Layout - Dados recebidos:', data);
        
        if (response.ok) {
          setUser(data.user);
        } else {
          console.log('🔵 Dashboard Layout - Erro na resposta, redirecionando para login');
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        router.push('/auth/login');
      } finally {
        // Carregar configurações do usuário
        await loadConfiguracoes();
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        localStorage.removeItem('access_token'); // Limpar token do localStorage
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar o localStorage e redirecionar
      localStorage.removeItem('access_token');
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme={theme} enableSystem={false}>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300 dashboard-container">
      {/* Sidebar */}
      <Sidebar userType={user.user_type} userName={user.nome_completo} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="dashboard-header">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 transition-colors duration-300">
                  Dashboard - {user.nome_completo}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {user.user_type === 'proprietario' ? 'Proprietário' : 
                   user.user_type === 'agente' ? 'Agente' : 
                   user.user_type === 'imobiliaria' ? 'Imobiliária' : 
                   'Utilizador'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {!user.is_verified && (
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm transition-colors duration-300">
                    Pendente de Verificação
                  </div>
                )}
                
                {/* Indicativo de Notificações */}
                <div className="relative">
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V7a7 7 0 00-14 0v5l-5 5h5m0 0v1a3 3 0 106 0v-1m-6 0H9" />
                    </svg>
                    {/* Badge de notificação */}
                    <span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      5
                    </span>
                  </button>
                </div>
                
                <Button 
                  onClick={handleLogout} 
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content flex-1 px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
      </div>
    </ThemeProvider>
  );
}
