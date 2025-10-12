'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DashboardProprietario() {
  // Dados simulados - em produção virão da API
  const stats = {
    imoveisCadastrados: 0,
    visualizacoes: 0,
    contatos: 0,
    propostas: 0
  };

  return (
    <div className="space-y-6">
      {/* Aviso de Conta Pendente */}
      <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <strong>Conta Pendente de Verificação:</strong> A sua conta está em processo de verificação. 
          Enquanto aguarda, pode explorar o dashboard e preparar os seus imóveis para cadastro.
        </AlertDescription>
      </Alert>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Imóveis Cadastrados</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{stats.imoveisCadastrados}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 transition-colors duration-300">
              Comece a cadastrar os seus imóveis
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Visualizações</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{stats.visualizacoes}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 transition-colors duration-300">
              Acompanhe o interesse nos seus imóveis
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Contatos</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{stats.contatos}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 transition-colors duration-300">
              Interessados em contactar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Propostas</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{stats.propostas}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 transition-colors duration-300">
              Propostas de compra recebidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 transition-colors duration-300">Bem-vindo ao Vendemos Sua Casa</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            A sua conta está ativa! Comece a cadastrar os seus imóveis e acompanhe o progresso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/dashboard/proprietario/cadastrar-imovel'}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Cadastrar Imóvel</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Completar Perfil</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Configurações</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 transition-colors duration-300">Próximos Passos</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Complete estas ações para maximizar o potencial da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Completar o seu perfil</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Adicione informações adicionais para melhorar a sua credibilidade</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Cadastrar o seu primeiro imóvel</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Comece a vender adicionando detalhes e fotos do seu imóvel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Configurar notificações</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Receba alertas sobre interessados e propostas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}