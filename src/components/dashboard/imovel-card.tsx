'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Euro, 
  Eye, 
  Edit, 
  EyeOff, 
  MoreVertical,
  Calendar,
  Star
} from 'lucide-react';

interface Imovel {
  id: string;
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
  imagemPrincipal?: string;
  descricao?: string;
  slug?: string;
}

interface ImovelCardProps {
  imovel: Imovel;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onInactivate?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export function ImovelCard({ 
  imovel, 
  onView, 
  onEdit, 
  onInactivate, 
  onToggleStatus 
}: ImovelCardProps) {
  console.log('🔍 ImovelCard renderizado para:', imovel.titulo, 'ID:', imovel.id);
  console.log('🔍 onView function recebida:', onView);
  
  const [showActions, setShowActions] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'publicado':
        return { label: 'Publicado', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case 'pendente':
        return { label: 'Pendente', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' };
      case 'inativo':
        return { label: 'Inativo', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
      case 'finalizado':
        return { label: 'Finalizado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' };
      default:
        return { label: 'Desconhecido', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
  };

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

  const statusInfo = getStatusInfo(imovel.status);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        {/* Imagem do imóvel */}
        <div 
          className="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onView?.(imovel.id)}
        >
          {imovel.imagemPrincipal ? (
            <img
              src={imovel.imagemPrincipal}
              alt={imovel.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <Square className="h-12 w-12" />
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Menu de ações */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              
              {showActions && (
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      console.log('🔍 Botão Ver clicado! ID:', imovel.id);
                      console.log('🔍 onView function:', onView);
                      onView?.(imovel.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit?.(imovel.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleStatus?.(imovel.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>Alterar Status</span>
                  </button>
                  {/* Botão de mudança de status - só aparece para publicado e inativo */}
                  {(imovel.status === 'publicado' || imovel.status === 'inativo') && (
                    <button
                      onClick={() => {
                        onInactivate?.(imovel.id);
                        setShowActions(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 ${
                        imovel.status === 'publicado'
                          ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                          : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                    >
                      {imovel.status === 'publicado' ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span>Inativar</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Publicar</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Imóveis pendentes NÃO têm botão de mudança de status */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="p-4">
          {/* Título e preço */}
          <div className="mb-3">
            <h3 
              className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1 line-clamp-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => onView?.(imovel.id)}
            >
              {imovel.titulo}
            </h3>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(imovel.preco)}
            </p>
          </div>

          {/* Localização */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{imovel.localizacao}</span>
          </div>

          {/* Características */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{imovel.quartos}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{imovel.banheiros}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{imovel.area} m²</span>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{imovel.visualizacoes}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1" />
                <span>{imovel.favoritos}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(imovel.dataCadastro)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
