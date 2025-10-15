'use client';

import { useState, useEffect } from 'react';
import { PageLayout, Section } from '@/components/dashboard/page-layout';
import { createImovelSlug, extractIdFromSlug } from '@/lib/slug';
import { ImovelCard } from '@/components/dashboard/imovel-card';
import { ImoveisCompactTable } from '@/components/dashboard/imoveis-compact-table';
import { ImoveisFilters } from '@/components/dashboard/imoveis-filters';
import { Button } from '@/components/ui/button';
import { Message } from '@/components/ui/message';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { 
  Plus, 
  Grid3X3, 
  List, 
  Home,
  TrendingUp,
  Eye,
  Star,
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';

// Interface para imóvel
interface Imovel {
  id: string;
  imovel_id?: string;
  titulo: string;
  tipo: string;
  preco: number;
  area: number;
  quartos: number;
  banheiros: number;
  localizacao: string;
  status: 'publicado' | 'pendente' | 'inativo' | 'finalizado';
  dataCadastro: string;
  visualizacoes: number;
  favoritos: number;
  imagemPrincipal: string;
  imagem: string;
  descricao: string;
  slug?: string;
}

interface FilterOptions {
  search: string;
  status: string;
  tipo: string;
  precoMin: string;
  precoMax: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filteredImoveis, setFilteredImoveis] = useState<Imovel[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('compact');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    tipo: '',
    precoMin: '',
    precoMax: '',
    sortBy: 'dataCadastro',
    sortOrder: 'desc'
  });

  // Estado do modal de confirmação
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'warning' | 'success' | 'danger';
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirmar',
    onConfirm: () => {}
  });

  // Carregar dados da API
  const loadImoveis = async () => {
    try {
      setIsLoading(true);
      
      // Obter token do localStorage
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }
      
      // Verificar se o token ainda é válido
      const verifyResponse = await fetch('/api/auth/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!verifyResponse.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      const response = await fetch('/api/imoveis', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error('❌ Erro na resposta:', errorData);
        
        if (response.status === 401) {
          // Token expirado
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        
        if (response.status === 404) {
          // Usuário não encontrado - pode ser primeira vez, não limpar token
          console.warn('⚠️ Usuário não encontrado no banco, mas token é válido');
          setMessage({
            type: 'info',
            text: 'Nenhum imóvel encontrado. Cadastre seu primeiro imóvel!'
          });
          setImoveis([]);
          return;
        }
        
        throw new Error(errorData.error || 'Erro ao carregar imóveis');
      }
      
      const data = await response.json();
      console.log('🔍 Dados recebidos da API:', data);
      console.log('🔍 Primeiro imóvel:', data.imoveis?.[0]);
      console.log('🔍 Primeiro imóvel - imovel_id:', data.imoveis?.[0]?.imovel_id);
      console.log('🔍 Primeiro imóvel - slug:', data.imoveis?.[0]?.slug);

      setImoveis(data.imoveis || []);
      setMessage(null);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao carregar imóveis. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    loadImoveis();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...imoveis];

    // Filtro de busca
    if (filters.search) {
      filtered = filtered.filter(imovel =>
        imovel.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
        imovel.localizacao.toLowerCase().includes(filters.search.toLowerCase()) ||
        imovel.descricao?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro de status
    if (filters.status) {
      filtered = filtered.filter(imovel => imovel.status === filters.status);
    }

    // Filtro de tipo
    if (filters.tipo) {
      filtered = filtered.filter(imovel => imovel.tipo === filters.tipo);
    }

    // Filtro de preço
    if (filters.precoMin) {
      filtered = filtered.filter(imovel => imovel.preco >= parseInt(filters.precoMin));
    }
    if (filters.precoMax) {
      filtered = filtered.filter(imovel => imovel.preco <= parseInt(filters.precoMax));
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: string | number = a[filters.sortBy as keyof typeof a] as string | number;
      let bValue: string | number = b[filters.sortBy as keyof typeof b] as string | number;

      if (filters.sortBy === 'dataCadastro') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredImoveis(filtered);
  }, [filters, imoveis]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      tipo: '',
      precoMin: '',
      precoMax: '',
      sortBy: 'dataCadastro',
      sortOrder: 'desc'
    });
  };

  const handleViewImovel = (id: string) => {
    console.log('🔍 handleViewImovel chamado com ID:', id);
    console.log('🔍 Array de imóveis:', imoveis);
    
    const imovel = imoveis.find(i => i.id === id);
    console.log('🔍 Imóvel encontrado:', imovel);
    console.log('🔍 imovel_id:', imovel?.imovel_id);
    console.log('🔍 slug:', imovel?.slug);
    
    if (imovel) {
      // SEMPRE gerar um novo slug usando o imovel_id (formato ABC-123)
      let slug;
      if (imovel.imovel_id) {
        // Usar o imovel_id novo (formato ABC-123)
        slug = createImovelSlug(imovel.titulo, imovel.imovel_id);
        console.log('🔍 Slug gerado com imovel_id:', slug);
      } else {
        // Fallback para UUID se não houver imovel_id
        slug = createImovelSlug(imovel.titulo, imovel.id);
        console.log('🔍 Slug gerado com UUID:', slug);
      }
      console.log('🔍 Slug final:', slug);
      console.log('🔍 URL final:', `/imovel/${slug}`);
      window.open(`/imovel/${slug}`, '_blank', 'noopener,noreferrer');
    } else {
      console.log('❌ Imóvel não encontrado!');
    }
  };

  const handleEditImovel = (id: string) => {
    // Implementar edição do imóvel
    console.log('Editar imóvel:', id);
  };

  const handleInactivateImovel = async (id: string) => {
    const imovel = imoveis.find(i => i.id === id);
    if (!imovel) return;
    
    // Imóveis pendentes não podem ter status alterado
    if (imovel.status === 'pendente') {
      setMessage({ type: 'error', text: 'Imóveis pendentes não podem ter o status alterado' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    // Determinar novo status baseado nas regras
    let newStatus: string;
    let action: string;
    
    if (imovel.status === 'publicado') {
      newStatus = 'inativo';
      action = 'inativar';
    } else if (imovel.status === 'inativo') {
      newStatus = 'publicado';
      action = 'publicar';
    } else {
      // Status não reconhecido ou não permite mudança
      setMessage({ type: 'error', text: 'Este status não permite alteração' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    // Mostrar modal de confirmação
    setConfirmationModal({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Imóvel`,
      message: `Tem certeza que deseja ${action} o imóvel "${imovel.titulo}"?`,
      type: action === 'inativar' ? 'warning' : 'success',
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        
        try {
          const response = await fetch(`/api/imovel/${id}/change-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
              status_novo: newStatus,
              motivo: `${action.charAt(0).toUpperCase() + action.slice(1)} do imóvel`,
              observacoes: `Imóvel ${action} via dashboard`
            })
          });
          
          if (response.ok) {
            setImoveis(prev => prev.map(imovel => 
              imovel.id === id 
                ? { ...imovel, status: newStatus as any }
                : imovel
            ));
            setMessage({ type: 'success', text: `Imóvel ${action} com sucesso!` });
            setTimeout(() => setMessage(null), 3000);
          } else {
            const error = await response.json();
            setMessage({ type: 'error', text: `Erro ao ${action} imóvel: ${error.error}` });
            setTimeout(() => setMessage(null), 5000);
          }
        } catch (error) {
          console.error('Erro ao alterar status:', error);
          setMessage({ type: 'error', text: `Erro ao ${action} imóvel` });
          setTimeout(() => setMessage(null), 5000);
        }
      }
    });
  };

  const handleToggleStatus = (id: string) => {
    setImoveis(prev => prev.map(imovel => 
      imovel.id === id 
        ? { ...imovel, status: imovel.status === 'publicado' ? 'pendente' : 'publicado' }
        : imovel
    ));
    setMessage({ type: 'success', text: 'Status do imóvel alterado com sucesso!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddImovel = () => {
    window.location.href = '/dashboard/proprietario/cadastrar-imovel';
  };

  // Estatísticas
  const stats = {
    total: imoveis.length,
    publicados: imoveis.filter(i => i.status === 'publicado').length,
    pendentes: imoveis.filter(i => i.status === 'pendente').length,
    inativos: imoveis.filter(i => i.status === 'inativo').length,
    finalizados: imoveis.filter(i => i.status === 'finalizado').length,
    totalVisualizacoes: imoveis.reduce((sum, i) => sum + i.visualizacoes, 0),
  };

  return (
    <PageLayout
      title="Meus Imóveis"
      description="Gerencie todos os seus imóveis cadastrados"
      message={message ? (
        <Message type={message.type} text={message.text} />
      ) : null}
    >
      {/* Estatísticas */}
      <Section title="Visão Geral">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center">
              <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="ml-2">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div className="ml-2">
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Ativos</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">{stats.ativos}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <div className="ml-2">
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Visualizações</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{stats.totalVisualizacoes}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="ml-2">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Propostas</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">0</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div className="ml-2">
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Agendamentos</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">0</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Filtros e ações */}
      <Section title="Filtros e Busca">
        <div className="space-y-4">
          <ImoveisFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            totalImoveis={imoveis.length}
            filteredCount={filteredImoveis.length}
          />

          {/* Ações */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleAddImovel}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Imóvel
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                title="Visualização em Grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('compact')}
                title="Lista Resumida"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Lista de imóveis */}
      <Section title="Imóveis">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">A carregar imóveis...</p>
          </div>
        ) : filteredImoveis.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {imoveis.length === 0 
                ? 'Você ainda não cadastrou nenhum imóvel. Que tal começar agora?'
                : 'Tente ajustar os filtros para encontrar o que procura.'
              }
            </p>
            {imoveis.length === 0 && (
              <Button onClick={handleAddImovel} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Imóvel
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImoveis.map((imovel) => {
              console.log('🔍 Renderizando ImovelCard para:', imovel.titulo, 'ID:', imovel.id);
              return (
                <ImovelCard
                  key={imovel.id}
                  imovel={imovel}
                  onView={handleViewImovel}
                  onEdit={handleEditImovel}
                  onInactivate={handleInactivateImovel}
                  onToggleStatus={handleToggleStatus}
                />
              );
            })}
          </div>
        ) : (
          <ImoveisCompactTable
            imoveis={filteredImoveis}
            onView={handleViewImovel}
            onEdit={handleEditImovel}
            onInactivate={handleInactivateImovel}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </Section>

      {/* Modal de confirmação */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
        cancelText="Cancelar"
      />
    </PageLayout>
  );
}