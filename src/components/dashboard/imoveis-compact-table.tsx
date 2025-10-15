'use client';

import React, { useState } from 'react';
import { createImovelSlug } from '@/lib/slug';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  MapPin,
  Calendar,
  Euro
} from 'lucide-react';

interface Imovel {
  id: string;
  titulo: string;
  tipo: string;
  preco: number;
  localizacao: string;
  status: 'ativo' | 'inativo' | 'vendido' | 'alugado' | 'pendente';
  dataCadastro: string;
  visualizacoes: number;
  favoritos: number;
  imagem?: string;
  slug?: string;
  imovel_id?: string;
}

interface ImoveisCompactTableProps {
  imoveis: Imovel[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export function ImoveisCompactTable({ 
  imoveis, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: ImoveisCompactTableProps) {
  const [showActions, setShowActions] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ativo':
        return { label: 'Ativo', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case 'inativo':
        return { label: 'Inativo', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
      case 'vendido':
        return { label: 'Vendido', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' };
      case 'alugado':
        return { label: 'Alugado', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' };
      default:
        return { label: 'Desconhecido', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
  };

  if (imoveis.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Nenhum imóvel encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Imóvel
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Data
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {imoveis.map((imovel) => {
              const statusInfo = getStatusInfo(imovel.status);
              
              return (
                <React.Fragment key={imovel.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {/* Imóvel */}
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {imovel.imagem ? (
                            <img
                              src={imovel.imagem}
                              alt={imovel.titulo}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {imovel.titulo.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {imovel.titulo}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {imovel.tipo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Preço */}
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <Euro className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(imovel.preco)}
                        </span>
                      </div>
                    </td>

                    {/* Localização */}
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                          {imovel.localizacao}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </td>

                    {/* Data */}
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(imovel.dataCadastro)}
                        </span>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // SEMPRE gerar um novo slug usando o imovel_id (formato ABC-123)
                            let slug;
                            if (imovel.imovel_id) {
                              // Usar o imovel_id novo (formato ABC-123)
                              slug = createImovelSlug(imovel.titulo, imovel.imovel_id);
                              console.log('🔍 Tabela Compacta - Slug gerado com imovel_id:', slug);
                            } else {
                              // Fallback para UUID se não houver imovel_id
                              slug = createImovelSlug(imovel.titulo, imovel.id);
                              console.log('🔍 Tabela Compacta - Slug gerado com UUID:', slug);
                            }
                            console.log('🔍 Tabela Compacta - Slug final:', slug);
                            console.log('🔍 Tabela Compacta - URL final:', `/imovel/${slug}`);
                            window.open(`/imovel/${slug}`, '_blank', 'noopener,noreferrer');
                          }}
                          className="h-8 w-8 p-0"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(imovel.id)}
                          className="h-8 w-8 p-0"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(imovel.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
