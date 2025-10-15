'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';

interface FilterOptions {
  search: string;
  status: string;
  tipo: string;
  precoMin: string;
  precoMax: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ImoveisFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  totalImoveis: number;
  filteredCount: number;
}

export function ImoveisFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalImoveis,
  filteredCount
}: ImoveisFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'asc');

  const getSortLabel = () => {
    const sortLabels: Record<string, string> = {
      'dataCadastro': 'Data de Cadastro',
      'preco': 'Preço',
      'titulo': 'Título',
      'area': 'Área',
      'visualizacoes': 'Visualizações'
    };
    return sortLabels[filters.sortBy] || 'Data de Cadastro';
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca e filtros básicos */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar imóveis..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtro de status */}
        <Select value={filters.status || "todos"} onValueChange={(value) => handleFilterChange('status', value === "todos" ? "" : value)}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="vendido">Vendido</SelectItem>
            <SelectItem value="alugado">Alugado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de tipo */}
        <Select value={filters.tipo || "todos"} onValueChange={(value) => handleFilterChange('tipo', value === "todos" ? "" : value)}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="apartamento">Apartamento</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="terreno">Terreno</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
          </SelectContent>
        </Select>

        {/* Botão de filtros avançados */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtros Avançados</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Preço mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço Mínimo
              </label>
              <Input
                type="number"
                placeholder="€ 0"
                value={filters.precoMin}
                onChange={(e) => handleFilterChange('precoMin', e.target.value)}
              />
            </div>

            {/* Preço máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço Máximo
              </label>
              <Input
                type="number"
                placeholder="€ 1.000.000"
                value={filters.precoMax}
                onChange={(e) => handleFilterChange('precoMax', e.target.value)}
              />
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ordenar por
              </label>
              <Select value={filters.sortBy || "dataCadastro"} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dataCadastro">Data de Cadastro</SelectItem>
                  <SelectItem value="preco">Preço</SelectItem>
                  <SelectItem value="titulo">Título</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                  <SelectItem value="visualizacoes">Visualizações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ordem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ordem
              </label>
              <Button
                variant="outline"
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full justify-start"
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                {filters.sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resumo dos filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredCount} de {totalImoveis} imóveis
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Filtros ativos
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
