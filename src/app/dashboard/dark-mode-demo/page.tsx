'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function DarkModeDemo() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Demonstração do Modo Dark
        </h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 mt-2">
          Esta página demonstra todas as cores e componentes no modo dark
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Card Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Este é um exemplo de card com suporte ao modo dark
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Card Secundário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Outro exemplo de card com cores adaptadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Card Terciário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Mais um exemplo para demonstrar consistência
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botões */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Botões
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 transition-colors duration-300">
            Botão Primário
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            Botão Secundário
          </Button>
          <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
            Botão Ghost
          </Button>
        </div>
      </div>

      {/* Formulários */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Formulários
        </h2>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Exemplo de Formulário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome" className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Nome
              </Label>
              <Input 
                id="nome" 
                placeholder="Digite seu nome"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary dark:focus:border-primary transition-colors duration-300"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Digite seu email"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary dark:focus:border-primary transition-colors duration-300"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Alertas
        </h2>
        <div className="space-y-4">
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-200 transition-colors duration-300">
              Este é um alerta de sucesso com cores adaptadas para o modo dark
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <AlertDescription className="text-yellow-800 dark:text-yellow-200 transition-colors duration-300">
              Este é um alerta de aviso com cores adaptadas para o modo dark
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200 transition-colors duration-300">
              Este é um alerta de erro com cores adaptadas para o modo dark
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Badges
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300">
            Padrão
          </Badge>
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 transition-colors duration-300">
            Primário
          </Badge>
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 transition-colors duration-300">
            Sucesso
          </Badge>
          <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 transition-colors duration-300">
            Aviso
          </Badge>
          <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 transition-colors duration-300">
            Erro
          </Badge>
        </div>
      </div>

      {/* Tabela */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Tabela
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-300">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  Nome
                </th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  João Silva
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  joao@exemplo.com
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 transition-colors duration-300">
                    Ativo
                  </Badge>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  Maria Santos
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  maria@exemplo.com
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 transition-colors duration-300">
                    Pendente
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
