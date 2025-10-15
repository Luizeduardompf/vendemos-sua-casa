'use client';

import { useState, useEffect } from 'react';
import { PageLayout, Section } from '@/components/dashboard/page-layout';
import { createImovelSlug, extractIdFromSlug } from '@/lib/slug';
import { ImovelCard } from '@/components/dashboard/imovel-card';
import { ImoveisCompactTable } from '@/components/dashboard/imoveis-compact-table';
import { ImoveisFilters } from '@/components/dashboard/imoveis-filters';
import { Button } from '@/components/ui/button';
import { Message } from '@/components/ui/message';
import { 
  Plus, 
  Grid3X3, 
  List, 
  Home,
  TrendingUp,
  Eye,
  Star,
  AlertCircle
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
  status: 'ativo' | 'inativo' | 'vendido' | 'alugado' | 'pendente';
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

  // Carregar dados da API
  const loadImoveis = async () => {
    try {
      setIsLoading(true);
      
      // Obter token do localStorage
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('/api/imoveis', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('🔍 Dados recebidos da API:', data);
      console.log('🔍 Primeiro imóvel:', data.imoveis?.[0]);
      console.log('🔍 Primeiro imóvel - imovel_id:', data.imoveis?.[0]?.imovel_id);
      console.log('🔍 Primeiro imóvel - slug:', data.imoveis?.[0]?.slug);

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar imóveis');
      }

      setImoveis(data.imoveis || []);
      setMessage(null);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao carregar imóveis. Tente novamente.'
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

  const handleDeleteImovel = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      setImoveis(prev => prev.filter(imovel => imovel.id !== id));
      setMessage({ type: 'success', text: 'Imóvel excluído com sucesso!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleStatus = (id: string) => {
    setImoveis(prev => prev.map(imovel => 
      imovel.id === id 
        ? { ...imovel, status: imovel.status === 'ativo' ? 'inativo' : 'ativo' }
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
    ativos: imoveis.filter(i => i.status === 'ativo').length,
    vendidos: imoveis.filter(i => i.status === 'vendido').length,
    totalVisualizacoes: imoveis.reduce((sum, i) => sum + i.visualizacoes, 0),
    totalFavoritos: imoveis.reduce((sum, i) => sum + i.favoritos, 0)
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.ativos}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Visualizações</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalVisualizacoes}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Favoritos</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.totalFavoritos}</p>
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
                  onDelete={handleDeleteImovel}
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
            onDelete={handleDeleteImovel}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </Section>
    </PageLayout>
  );
}