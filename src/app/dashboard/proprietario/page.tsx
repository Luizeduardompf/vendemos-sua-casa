'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardProprietario() {
  const [user] = useState({
    nome: 'João Silva',
    email: 'joao@email.com',
    tipoPessoa: 'singular'
  });

  const [imoveis] = useState([
    {
      id: 1,
      titulo: 'Casa T3 com Jardim',
      endereco: 'Rua das Flores, 123, Lisboa',
      preco: 350000,
      status: 'disponivel',
      visualizacoes: 45,
      agendamentos: 3,
      propostas: 1
    },
    {
      id: 2,
      titulo: 'Apartamento T2 Moderno',
      endereco: 'Av. da Liberdade, 456, Porto',
      preco: 280000,
      status: 'reservado',
      visualizacoes: 32,
      agendamentos: 5,
      propostas: 2
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'reservado': return 'bg-yellow-100 text-yellow-800';
      case 'vendido': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'reservado': return 'Reservado';
      case 'vendido': return 'Vendido';
      default: return 'Indisponível';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Dashboard */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard do Proprietário</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user.nome}</span>
              <Button variant="outline" size="sm">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
              <span className="text-2xl">🏠</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{imoveis.length}</div>
              <p className="text-xs text-muted-foreground">
                {imoveis.filter(i => i.status === 'disponivel').length} disponíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <span className="text-2xl">👁️</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {imoveis.reduce((acc, imovel) => acc + imovel.visualizacoes, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <span className="text-2xl">📅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {imoveis.reduce((acc, imovel) => acc + imovel.agendamentos, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propostas</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {imoveis.reduce((acc, imovel) => acc + imovel.propostas, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendentes de análise
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-primary hover:bg-primary/90">
              + Cadastrar Novo Imóvel
            </Button>
            <Button variant="outline">
              📊 Ver Relatórios
            </Button>
            <Button variant="outline">
              📋 Gerenciar Agendamentos
            </Button>
            <Button variant="outline">
              💬 Mensagens
            </Button>
          </div>
        </div>

        {/* Lista de Imóveis */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Meus Imóveis</h2>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>

          <div className="space-y-4">
            {imoveis.map((imovel) => (
              <Card key={imovel.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {imovel.titulo}
                        </h3>
                        <Badge className={getStatusColor(imovel.status)}>
                          {getStatusText(imovel.status)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{imovel.endereco}</p>
                      <p className="text-2xl font-bold text-primary mb-4">
                        €{imovel.preco.toLocaleString('pt-PT')}
                      </p>
                      <div className="flex space-x-6 text-sm text-gray-600">
                        <span>👁️ {imovel.visualizacoes} visualizações</span>
                        <span>📅 {imovel.agendamentos} agendamentos</span>
                        <span>💰 {imovel.propostas} propostas</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Nova proposta recebida para <strong>Casa T3 com Jardim</strong>
                    </p>
                    <p className="text-xs text-gray-500">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Agendamento confirmado para <strong>Apartamento T2 Moderno</strong>
                    </p>
                    <p className="text-xs text-gray-500">Ontem</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Imóvel <strong>Casa T3 com Jardim</strong> teve 12 visualizações hoje
                    </p>
                    <p className="text-xs text-gray-500">Há 1 dia</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
