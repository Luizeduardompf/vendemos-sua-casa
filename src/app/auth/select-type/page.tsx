'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SelectUserTypePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Como pretende aceder?</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Selecione o tipo de utilizador para continuar
          </p>
        </div>

        {/* Cards de seleção */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Proprietário */}
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <CardTitle className="text-xl sm:text-2xl">👤 Proprietário</CardTitle>
              <CardDescription className="text-sm">
                Tenho imóveis para vender
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-xs sm:text-sm text-left space-y-1 mb-4">
                <p>• Angarie sem contratos de exclusividade</p>
                <p>• Transparência total no processo</p>
                <p>• Estudo de mercado automático</p>
                <p>• Gestão completa de documentação</p>
                <p>• Controle total das visitas</p>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/login?type=proprietario">
                    Entrar como Proprietário
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/register?type=proprietario">
                    Registar como Proprietário
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agente */}
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-xl sm:text-2xl">🏢 Agente</CardTitle>
              <CardDescription className="text-sm">
                Sou agente imobiliário individual
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-xs sm:text-sm text-left space-y-1 mb-4">
                <p>• Acesso a catálogo completo de imóveis</p>
                <p>• Ganhe até 70% de comissão</p>
                <p>• Agendamento de visitas qualificadas</p>
                <p>• Material de divulgação profissional</p>
                <p>• Sistema de propostas integrado</p>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/auth/login?type=agente">
                    Entrar como Agente
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/register?type=agente">
                    Registar como Agente
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Imobiliária */}
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <CardTitle className="text-xl sm:text-2xl">🏢 Imobiliária</CardTitle>
              <CardDescription className="text-sm">
                Represento uma agência imobiliária
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-xs sm:text-sm text-left space-y-1 mb-4">
                <p>• Gestão de equipa de agentes</p>
                <p>• Relatórios de performance</p>
                <p>• Comissões diferenciadas</p>
                <p>• Ferramentas de gestão avançadas</p>
                <p>• Suporte dedicado</p>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/auth/login?type=imobiliaria">
                    Entrar como Imobiliária
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/register?type=imobiliaria">
                    Registar como Imobiliária
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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
