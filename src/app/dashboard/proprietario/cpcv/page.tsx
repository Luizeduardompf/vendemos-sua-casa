'use client';

import { PageLayout } from '@/components/dashboard/page-layout';
import { Message } from '@/components/ui/message';
import { Clock, Info, FileCheck } from 'lucide-react';

export default function CPCVPage() {
  return (
    <PageLayout
      title="CPCV"
      description="Gerencie seus contratos de promessa de compra e venda"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        {/* Ícone de CPCV */}
        <div className="mb-6">
          <FileCheck className="h-16 w-16 text-gray-400 mx-auto" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Página em Desenvolvimento
        </h2>

        {/* Mensagem informativa */}
        <div className="max-w-md mx-auto space-y-4">
          <Message
            type="info"
            icon={<Info className="h-5 w-5" />}
            title="Funcionalidade em Breve"
            description="Esta página está sendo desenvolvida e estará disponível em breve. Aqui você poderá gerenciar todos os seus contratos de promessa de compra e venda."
          />

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Previsão de lançamento: Em breve</span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/proprietario'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir para Dashboard
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
