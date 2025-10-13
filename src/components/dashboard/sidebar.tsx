'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

interface SidebarProps {
  userType: string;
  userName: string;
  userPhoto?: string;
  userEmail?: string;
}

        const menuItems = {
          proprietario: [
            {
              title: 'Dashboard',
              href: '/dashboard/proprietario',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
              )
            },
            {
              title: 'Meus Imóveis',
              href: '/dashboard/proprietario/imoveis',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )
            },
            {
              title: 'Financeiro',
              href: '/dashboard/proprietario/financeiro',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              )
            },
            {
              title: 'Propostas',
              href: '/dashboard/proprietario/propostas',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              notification: 3
            },
            {
              title: 'Agendamentos',
              href: '/dashboard/proprietario/agendamentos',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              notification: 2
            },
            {
              title: 'CPCV',
              href: '/dashboard/proprietario/cpcv',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              title: 'Relatórios',
              href: '/dashboard/proprietario/relatorios',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            },
            {
              title: 'Cadastrar Imóvel',
              href: '/dashboard/proprietario/cadastrar-imovel',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              ),
              isLast: true
            },
            {
              title: 'Suporte',
              href: '/dashboard/proprietario/suporte',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              ),
              isLast: true
            }
          ],
          agente: [
            {
              title: 'Dashboard',
              href: '/dashboard/agente',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
              )
            },
            {
              title: 'Imóveis Disponíveis',
              href: '/dashboard/agente/imoveis',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )
            },
            {
              title: 'Minhas Propostas',
              href: '/dashboard/agente/propostas',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              notification: 3
            },
            {
              title: 'Agendamentos',
              href: '/dashboard/agente/agendamentos',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              notification: 2
            },
            {
              title: 'CPCV',
              href: '/dashboard/agente/cpcv',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              title: 'Relatórios',
              href: '/dashboard/agente/relatorios',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            },
            {
              title: 'Suporte',
              href: '/dashboard/agente/suporte',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              ),
              isLast: true
            }
          ],
          imobiliaria: [
            {
              title: 'Dashboard',
              href: '/dashboard/imobiliaria',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
              )
            },
            {
              title: 'Imóveis',
              href: '/dashboard/imobiliaria/imoveis',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )
            },
            {
              title: 'Agentes',
              href: '/dashboard/imobiliaria/agentes',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              )
            },
            {
              title: 'Propostas',
              href: '/dashboard/imobiliaria/propostas',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              notification: 3
            },
            {
              title: 'Agendamentos',
              href: '/dashboard/imobiliaria/agendamentos',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              notification: 2
            },
            {
              title: 'CPCV',
              href: '/dashboard/imobiliaria/cpcv',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              title: 'Relatórios',
              href: '/dashboard/imobiliaria/relatorios',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            },
            {
              title: 'Suporte',
              href: '/dashboard/imobiliaria/suporte',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              ),
              isLast: true
            }
          ]
};

export function Sidebar({ userType, userName, userPhoto, userEmail }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  
  const items = menuItems[userType as keyof typeof menuItems] || menuItems.proprietario;

  return (
    <div className={cn(
      "sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header da Sidebar */}
      <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-6 w-6 sm:h-8 sm:w-8"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center">
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt={userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para iniciais se a imagem falhar
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                          <span class="text-xs sm:text-sm font-medium text-primary dark:text-primary-foreground">
                            ${userName.split(' ').length > 1 
                              ? `${userName.split(' ')[0][0]}${userName.split(' ')[userName.split(' ').length - 1][0]}`.toUpperCase()
                              : userName[0].toUpperCase()
                            }
                          </span>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-medium text-primary dark:text-primary-foreground">
                    {userName.split(' ').length > 1 
                      ? `${userName.split(' ')[0][0]}${userName.split(' ')[userName.split(' ').length - 1][0]}`.toUpperCase()
                      : userName[0].toUpperCase()
                    }
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {userType === 'proprietario' ? 'Proprietário' : 
                 userType === 'agente' ? 'Agente' : 
                 userType === 'imobiliaria' ? 'Imobiliária' : 'Utilizador'}
              </p>
            </div>
          </div>
          
          {/* Linha divisória */}
          <div className="mt-2 mb-2 sm:mt-3 sm:mb-3">
            <div className="border-t border-gray-200 dark:border-gray-600"></div>
          </div>

          {/* Submenu de perfil */}
          <div className="space-y-0.5 sm:space-y-1">
            {/* Dashboard */}
            <Link
              href={`/dashboard/${userType}`}
              className={cn(
                "flex items-center space-x-2 sm:space-x-3 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                pathname === `/dashboard/${userType}`
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <span className={cn(
                "flex-shrink-0",
                pathname === `/dashboard/${userType}` ? "text-white" : "text-gray-500 dark:text-gray-400"
              )}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
              </span>
              <span className="truncate">Dashboard</span>
            </Link>

            {/* Meus Dados */}
            <Link
              href={`/dashboard/${userType}/meus-dados`}
              className={cn(
                "flex items-center space-x-2 sm:space-x-3 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                pathname === `/dashboard/${userType}/meus-dados`
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <span className={cn(
                "flex-shrink-0",
                pathname === `/dashboard/${userType}/meus-dados` ? "text-white" : "text-gray-500 dark:text-gray-400"
              )}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className="truncate">Meus Dados</span>
            </Link>

            {/* Configurações */}
            <Link
              href={`/dashboard/${userType}/configuracoes`}
              className={cn(
                "flex items-center space-x-2 sm:space-x-3 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                pathname === `/dashboard/${userType}/configuracoes`
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <span className={cn(
                "flex-shrink-0",
                pathname === `/dashboard/${userType}/configuracoes` ? "text-white" : "text-gray-500 dark:text-gray-400"
              )}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="truncate">Configurações</span>
            </Link>
          </div>
        </div>
      )}

              {/* Linha divisória */}
              <div className="px-2 sm:px-4">
                <div className="border-t border-gray-200 dark:border-gray-600"></div>
              </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 sm:p-4 space-y-0.5 sm:space-y-1">
        {items.filter(item => item.title !== 'Meus Dados' && item.title !== 'Dashboard').map((item, index) => {
          const isActive = pathname === item.href;
          const showSeparator = item.isLast;
          const previousItem = items.filter(i => i.title !== 'Meus Dados' && i.title !== 'Dashboard')[index - 1];
          const shouldShowSeparatorBefore = showSeparator && previousItem && !previousItem.isLast;
          
          return (
            <div key={item.href}>
              {shouldShowSeparatorBefore && (
                <div className="my-2 sm:my-3">
                  <div className="border-t border-gray-200"></div>
                </div>
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className={cn(
                    "flex-shrink-0",
                    isActive ? "text-white" : "text-gray-500"
                  )}>
                    <div className="w-3 h-3 sm:w-4 sm:h-4">
                      {item.icon}
                    </div>
                  </span>
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </div>
                {!isCollapsed && item.notification && (
                  <span className={cn(
                    "inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-bold rounded-full",
                    isActive 
                      ? "bg-white text-primary" 
                      : "bg-red-500 text-white"
                  )}>
                    {item.notification}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer da Sidebar */}
      <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Vendemos Sua Casa
          </div>
        )}
      </div>
    </div>
  );
}
