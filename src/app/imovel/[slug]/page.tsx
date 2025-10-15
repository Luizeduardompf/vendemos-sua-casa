'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { extractIdFromSlug } from '@/lib/slug';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Home,
  Calendar,
  Phone,
  Mail,
  Share2,
  Heart,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Wifi,
  Shield,
  TreePine,
  Zap,
  Snowflake,
  Flame
} from 'lucide-react';

// Interface para dados do imóvel
interface ImovelData {
  id: string;
  imovel_id?: string;
  titulo: string;
  tipo: string;
  preco: number;
  area: number;
  area_terreno: number;
  quartos: number;
  banheiros: number;
  localizacao: string;
  endereco: string;
  codigo_postal: string;
  cidade: string;
  distrito: string;
  pais: string;
  estado: string;
  ano_construcao: number;
  certificado_energetico: string;
  orientacao: string;
  descricao: string;
  observacoes: string;
  status: string;
  dataCadastro: string;
  visualizacoes: number;
  favoritos: number;
  tipo_negocio: string;
  disponibilidade: string;
  comissao: number;
  contacto_visitas: string;
  palavras_chave: string;
  destaque: boolean;
  urgente: boolean;
  
  // Características
  garagem: boolean;
  elevador: boolean;
  varanda: boolean;
  terraco: boolean;
  jardim: boolean;
  piscina: boolean;
  ar_condicionado: boolean;
  aquecimento: boolean;
  lareira: boolean;
  alarme: boolean;
  portao_automatico: boolean;
  internet: boolean;
  tv_cabo: boolean;
  
  // Detalhes da garagem
  lugares_garagem: number;
  tipo_garagem: string;
  
  // Imagens
  imagens: Array<{
    id: string;
    url: string;
    isMain: boolean;
    alt: string;
  }>;
  
  // Informações do proprietário/agente
  proprietario: {
    nome: string;
    telefone: string;
    email: string;
    foto: string;
    tipo: string;
  };
};

export default function ImovelDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Extrair ID do slug
  const imovelId = extractIdFromSlug(params.slug as string);
  console.log('🔍 Slug recebido:', params.slug);
  console.log('🔍 ID extraído:', imovelId);
  
  // Verificar se o ID é um UUID antigo (formato antigo) no servidor
  const isOldUuid = imovelId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(imovelId);
  console.log('🔍 É UUID antigo?', isOldUuid);
  
  const [imovel, setImovel] = useState<ImovelData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<{ id: string; nome: string; email: string; user_type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imovelId) {
      checkAuthentication();
    } else {
      window.location.href = '/dashboard/proprietario';
    }
  }, [imovelId]);

  const checkAuthentication = async () => {
    try {
      // Obter token do localStorage
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.log('🔒 Token não encontrado, redirecionando para login');
        window.location.href = '/auth/login';
        return;
      }

      // Verificar se o ID é um UUID antigo (formato antigo)
      const isOldUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(imovelId);
      if (isOldUuid) {
        console.log('🔒 ID antigo detectado, mostrando página de erro');
        setError('Este imóvel não está mais disponível. O sistema foi atualizado e este link é antigo.');
        setIsLoading(false);
        return;
      }

      // Verificar se o usuário é proprietário do imóvel
      const response = await fetch(`/api/imovel/${imovelId}/check-ownership`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.isOldLink) {
          console.log('🔒 Link antigo detectado, mostrando página de erro');
          setError(data.error);
          setIsLoading(false);
          return;
        }
        const redirectTo = data.redirectTo || '/dashboard/proprietario';
        console.log('🔒 Redirecionando para:', redirectTo);
        window.location.href = redirectTo;
        return;
      }

      if (!data.authorized) {
        window.location.href = '/dashboard/proprietario';
        return;
      }

      setUser(data.user);
      setIsAuthorized(true);
      
      // Carregar dados do imóvel da API
      await loadImovelData();

    } catch (error) {
      console.error('Erro na verificação de propriedade:', error);
      window.location.href = '/dashboard/proprietario';
    }
  };

  const loadImovelData = async () => {
    try {
      // Obter token do localStorage
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`/api/imovel/${imovelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar imóvel');
      }

      setImovel(data.imovel);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados do imóvel:', error);
      setIsLoading(false);
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
      month: 'long',
      year: 'numeric'
    });
  };

  const nextImage = () => {
    if (imovel?.imagens && imovel.imagens.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === imovel.imagens.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (imovel?.imagens && imovel.imagens.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? imovel.imagens.length - 1 : prev - 1
      );
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ativo':
        return { label: 'Disponível', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case 'vendido':
        return { label: 'Vendido', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' };
      case 'alugado':
        return { label: 'Alugado', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' };
      default:
        return { label: 'Indisponível', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
  };

  const processGoogleImageUrl = (url: string) => {
    if (!url) return url;
    
    // Se for uma URL do Google, remover parâmetros desnecessários e adicionar tamanho específico
    if (url.includes('googleusercontent.com')) {
      // Remover parâmetros existentes e adicionar tamanho específico
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?sz=100&w=100&h=100&fit=crop&crop=face`;
    }
    
    return url;
  };

  const getCaracteristicas = () => {
    const caracteristicas = [];
    
    if (imovel.garagem) caracteristicas.push({ icon: Car, label: 'Garagem', value: `${imovel.lugares_garagem} lugar${imovel.lugares_garagem > 1 ? 'es' : ''}` });
    if (imovel.elevador) caracteristicas.push({ icon: Home, label: 'Elevador' });
    if (imovel.varanda) caracteristicas.push({ icon: Home, label: 'Varanda' });
    if (imovel.terraco) caracteristicas.push({ icon: Home, label: 'Terraço' });
    if (imovel.jardim) caracteristicas.push({ icon: TreePine, label: 'Jardim' });
    if (imovel.piscina) caracteristicas.push({ icon: Home, label: 'Piscina' });
    if (imovel.ar_condicionado) caracteristicas.push({ icon: Snowflake, label: 'Ar Condicionado' });
    if (imovel.aquecimento) caracteristicas.push({ icon: Flame, label: 'Aquecimento' });
    if (imovel.lareira) caracteristicas.push({ icon: Home, label: 'Lareira' });
    if (imovel.alarme) caracteristicas.push({ icon: Shield, label: 'Alarme' });
    if (imovel.internet) caracteristicas.push({ icon: Wifi, label: 'Internet' });
    
    return caracteristicas;
  };

  // Mostrar página de erro para UUIDs antigos
  if (isOldUuid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Imóvel Não Disponível</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Este imóvel não está mais disponível. O sistema foi atualizado e este link é antigo.</p>
          <div className="space-y-3">
            <a 
              href="/dashboard/proprietario/imoveis" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver Meus Imóveis
            </a>
            <br />
            <a 
              href="/dashboard/proprietario" 
              className="inline-block text-primary hover:text-primary/80 transition-colors"
            >
              Voltar ao Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Imóvel Não Disponível</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="space-y-3">
            <a 
              href="/dashboard/proprietario/imoveis" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver Meus Imóveis
            </a>
            <br />
            <a 
              href="/dashboard/proprietario" 
              className="inline-block text-primary hover:text-primary/80 transition-colors"
            >
              Voltar ao Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !isAuthorized || !imovel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{isLoading ? 'A carregar imóvel...' : !isAuthorized ? 'A verificar permissões...' : 'Imóvel não encontrado'}</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(imovel.status);
  const caracteristicas = getCaracteristicas();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header com navegação */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/proprietario/imoveis')}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar aos Imóveis
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ID: {imovel.imovel_id || imovel.id}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Partilhar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className={isFavorited ? 'text-red-600 border-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorito' : 'Favoritar'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria de imagens */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  {imovel.imagens && imovel.imagens.length > 0 ? (
                    <img
                      src={imovel.imagens[currentImageIndex]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'}
                      alt={imovel.imagens[currentImageIndex]?.alt || 'Imagem do imóvel'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('❌ Erro ao carregar imagem do imóvel:', imovel.imagens[currentImageIndex]?.url);
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <span>Nenhuma imagem disponível</span>
                    </div>
                  )}
                </div>
                
                {/* Controles da galeria */}
                {imovel?.imagens && imovel.imagens.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    {imovel.imagens.length > 1 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={prevImage}
                        className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsImageModalOpen(true)}
                      className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    {imovel.imagens.length > 1 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={nextImage}
                        className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Indicadores */}
                {imovel?.imagens && imovel.imagens.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      {imovel.imagens.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <Badge className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                  {imovel.destaque && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  )}
                  {imovel.urgente && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      Urgente
                    </Badge>
                  )}
                </div>
              </div>

              {/* Miniaturas */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {imovel.imagens.map((imagem, index) => (
                    <button
                      key={imagem.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex 
                          ? 'border-primary' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img
                        src={imagem.url}
                        alt={imagem.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Informações principais */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Título e preço */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {imovel.titulo}
                    </h1>
                    <p className="text-4xl font-bold text-primary mb-4">
                      {formatPrice(imovel.preco)}
                    </p>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{imovel.localizacao}</span>
                    </div>
                  </div>

                  {/* Características principais */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Square className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{imovel.area} m²</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Área útil</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Bed className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{imovel.quartos}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quartos</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Bath className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{imovel.banheiros}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Banheiros</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Car className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{imovel.lugares_garagem || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Garagem</p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Descrição
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {imovel.descricao}
                    </p>
                    {imovel.observacoes && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Observações
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          {imovel.observacoes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Características e comodidades */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Características e Comodidades
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {caracteristicas.map((caracteristica, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <caracteristica.icon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {caracteristica.label}
                            </p>
                            {caracteristica.value && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {caracteristica.value}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informações técnicas */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Informações Técnicas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tipo de imóvel:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {imovel.tipo}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {imovel.estado}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Ano de construção:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {imovel.ano_construcao || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Certificado energético:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {imovel.certificado_energetico || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Orientação:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {imovel.orientacao || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Disponibilidade:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {imovel.disponibilidade}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tipo de negócio:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {imovel.tipo_negocio}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Comissão:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {imovel.comissao ? `${imovel.comissao}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de contacto */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {imovel.proprietario.foto ? (
                      <img
                        src={processGoogleImageUrl(imovel.proprietario.foto)}
                        alt={imovel.proprietario.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('❌ Erro ao carregar foto do proprietário:', imovel.proprietario.foto);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 ${imovel.proprietario.foto ? 'hidden' : ''}`}>
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {imovel.proprietario.nome}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {imovel.proprietario.tipo}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Visita
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Visualizações:</span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {imovel.visualizacoes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>Favoritos:</span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {imovel.favoritos}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>Publicado em:</span>
                    <span>{formatDate(imovel.dataCadastro)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de localização */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Localização
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">{imovel.endereco}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {imovel.codigo_postal} {imovel.cidade}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{imovel.pais}</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de imagem */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={imovel.imagens[currentImageIndex].url}
              alt={imovel.imagens[currentImageIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={prevImage}
                className="bg-white/90 hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={nextImage}
                className="bg-white/90 hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
