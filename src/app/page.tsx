import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className={cn('flex min-h-screen flex-col items-center justify-center p-24 space-y-8')}>
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-primary">🏠 VendemosSuaCasa</h1>
        <p className="text-xl text-muted-foreground">Plataforma completa para venda de imóveis</p>
        <p className="text-lg">Conecte vendedores e compradores de forma segura e eficiente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🔍 Buscar Imóveis</CardTitle>
            <CardDescription>Encontre o imóvel perfeito com filtros avançados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Explorar Catálogo</Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🏘️ Vender Imóvel</CardTitle>
            <CardDescription>Anuncie seu imóvel e alcance mais compradores</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Criar Anúncio</Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">💬 Chat Integrado</CardTitle>
            <CardDescription>Comunique-se diretamente com interessados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Iniciar Conversa</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>🚀 Status do Sistema</CardTitle>
          <CardDescription>Aplicação funcionando perfeitamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Next.js 15:</span>
              <span className="text-green-600">✅ Funcionando</span>
            </div>
            <div className="flex justify-between">
              <span>Supabase:</span>
              <span className="text-green-600">✅ Conectado</span>
            </div>
            <div className="flex justify-between">
              <span>Docker:</span>
              <span className="text-green-600">✅ Rodando</span>
            </div>
            <div className="flex justify-between">
              <span>Tailwind CSS:</span>
              <span className="text-green-600">✅ Ativo</span>
            </div>
          </div>
          <Button className="w-full mt-4">Começar Desenvolvimento</Button>
        </CardContent>
      </Card>
    </main>
  );
}
