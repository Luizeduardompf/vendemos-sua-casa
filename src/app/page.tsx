import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8 sm:py-16 px-3 sm:px-4 space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">🏠 Vendemos Sua Casa</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">Portal de Angariação de Propriedades</p>
        <p className="text-base sm:text-lg">Ponte entre proprietários, compradores e agentes imobiliários</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Sistema completo: agendamentos, propostas, CPCV e formalização</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-3 sm:mb-4">Por que é tão vantajoso para o proprietário?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">✅ Transparência Total</h3>
              <p className="text-xs sm:text-sm text-blue-700">Sem contratos de exclusividade. Todos os agentes têm acesso aos seus imóveis, criando competição saudável e melhores resultados.</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">🚫 Fim do Stress</h3>
              <p className="text-xs sm:text-sm text-blue-700">Acaba com a pressão de agentes e imobiliárias tentando forçar contratos de exclusividade. Você mantém o controle total.</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">💰 Melhor Preço</h3>
              <p className="text-xs sm:text-sm text-blue-700">Com múltiplos agentes trabalhando, você obtém o melhor preço de venda possível para seu imóvel.</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">⚡ Venda Mais Rápida</h3>
              <p className="text-xs sm:text-sm text-blue-700">Mais agentes = mais divulgação = mais compradores interessados = venda mais rápida.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
        <Card className="text-center">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl">👤 Para Proprietários</CardTitle>
            <CardDescription className="text-sm">Angarie seu imóvel com segurança e transparência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-xs sm:text-sm text-left space-y-1">
              <p>• Estudo de mercado automático</p>
              <p>• Gestão completa de documentação</p>
              <p>• Agendamento controlado de visitas</p>
              <p>• Relatórios detalhados de divulgação</p>
              <p>• Processo CPCV automatizado</p>
            </div>
            <Button className="w-full text-xs sm:text-sm">Cadastrar Imóvel</Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl">🏢 Para Agentes</CardTitle>
            <CardDescription className="text-sm">Acesse imóveis e ganhe até 70% de comissão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-xs sm:text-sm text-left space-y-1">
              <p>• Catálogo completo de imóveis</p>
              <p>• Agendamento de visitas qualificadas</p>
              <p>• Material de divulgação profissional</p>
              <p>• Sistema de propostas integrado</p>
              <p>• Acompanhamento de comissões</p>
            </div>
            <Button className="w-full text-xs sm:text-sm">Acessar Portal</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl">
        <Card className="text-center">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">📅 Agendamentos</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Sistema inteligente de marcação</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <p className="text-xs sm:text-sm">Visitas controladas com aprovação do proprietário</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">📋 Propostas</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Gestão completa de ofertas</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <p className="text-xs sm:text-sm">Receba e analise propostas de forma organizada</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">📄 CPCV</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Contratos automatizados</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <p className="text-xs sm:text-sm">Geração automática de contratos de promessa</p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>🚀 Vendemos Sua Casa - Status</CardTitle>
          <CardDescription>Sistema de angariação de propriedades funcionando</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Portal de Angariação:</span>
              <span className="text-green-600">✅ Ativo</span>
            </div>
            <div className="flex justify-between">
              <span>Sistema de Agendamentos:</span>
              <span className="text-green-600">✅ Pronto</span>
            </div>
            <div className="flex justify-between">
              <span>Gestão de Propostas:</span>
              <span className="text-green-600">✅ Implementado</span>
            </div>
            <div className="flex justify-between">
              <span>Processo CPCV:</span>
              <span className="text-green-600">✅ Automatizado</span>
            </div>
            <div className="flex justify-between">
              <span>Sistema de Comissões:</span>
              <span className="text-green-600">✅ Configurado</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Comissões Ativas:</p>
            <p className="text-xs text-blue-600">Imóveis Particulares: 5% | Empreendimentos: 3% | Agentes: até 70%</p>
          </div>
          <Button className="w-full mt-4">Acessar Sistema</Button>
        </CardContent>
      </Card>
    </div>
  );
}
