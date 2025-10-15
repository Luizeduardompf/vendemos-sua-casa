'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import PageLayout, { Section, TwoColumnGrid } from '@/components/dashboard/page-layout';
import Message from '@/components/ui/message';
import { 
  Upload, 
  X, 
  Plus, 
  MapPin, 
  Home, 
  Car, 
  TreePine, 
  Wifi, 
  Shield,
  Camera,
  Trash2,
  Eye
} from 'lucide-react';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
}

export default function CadastrarImovelPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<ImageFile[]>([]);

  // Dados do formulário
  const [formData, setFormData] = useState({
    // Informações básicas
    titulo: '',
    descricao: '',
    preco: '',
    area: '',
    area_terreno: '',
    quartos: '',
    banheiros: '',
    localizacao: '',
    endereco: '',
    codigo_postal: '',
    cidade: '',
    distrito: '',
    pais: 'Portugal',
    
    // Tipo e características
    tipo_imovel: 'apartamento',
    estado: 'excelente',
    ano_construcao: '',
    certificado_energetico: '',
    orientacao: '',
    
    // Características específicas
    garagem: false,
    elevador: false,
    varanda: false,
    terraco: false,
    jardim: false,
    piscina: false,
    ar_condicionado: false,
    aquecimento: false,
    lareira: false,
    alarme: false,
    portao_automatico: false,
    internet: false,
    tv_cabo: false,
    
    // Detalhes da garagem
    lugares_garagem: '',
    tipo_garagem: '',
    
    // Informações adicionais
    observacoes: '',
    disponibilidade: 'imediata',
    tipo_negocio: 'venda',
    comissao: '',
    contacto_visitas: '',
    
    // SEO e marketing
    palavras_chave: '',
    destaque: false,
    urgente: false
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        
        const newImage: ImageFile = {
          id,
          file,
          preview,
          isMain: images.length === 0 // Primeira imagem é principal por padrão
        };
        
        setImages(prev => [...prev, newImage]);
      }
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const newImages = prev.filter(img => img.id !== id);
      // Se removemos a imagem principal, definir a primeira como principal
      if (newImages.length > 0 && !newImages.some(img => img.isMain)) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const setMainImage = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === id
    })));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validações obrigatórias
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.preco.trim()) newErrors.preco = 'Preço é obrigatório';
    else if (isNaN(Number(formData.preco)) || Number(formData.preco) <= 0) newErrors.preco = 'Preço deve ser um número válido';
    
    if (!formData.area.trim()) newErrors.area = 'Área é obrigatória';
    else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) newErrors.area = 'Área deve ser um número válido';
    
    if (!formData.quartos.trim()) newErrors.quartos = 'Número de quartos é obrigatório';
    else if (isNaN(Number(formData.quartos)) || Number(formData.quartos) < 0) newErrors.quartos = 'Número de quartos deve ser um número válido';
    
    if (!formData.banheiros.trim()) newErrors.banheiros = 'Número de banheiros é obrigatório';
    else if (isNaN(Number(formData.banheiros)) || Number(formData.banheiros) < 0) newErrors.banheiros = 'Número de banheiros deve ser um número válido';
    
    if (!formData.localizacao.trim()) newErrors.localizacao = 'Localização é obrigatória';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.codigo_postal.trim()) newErrors.codigo_postal = 'Código postal é obrigatório';

    // Validação de imagens
    if (images.length === 0) newErrors.images = 'Pelo menos uma imagem é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      // Simular upload de imagens
      const imageData = images.map(img => ({
        id: img.id,
        isMain: img.isMain,
        name: img.file.name,
        size: img.file.size,
        type: img.file.type
      }));

      console.log('Dados do imóvel:', formData);
      console.log('Imagens:', imageData);

      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setMessage({ 
        type: 'success', 
        text: 'Imóvel cadastrado com sucesso! Redirecionando...' 
      });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/dashboard/proprietario/imoveis');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao cadastrar imóvel. Tente novamente.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Cadastrar Imóvel"
      description="Adicione um novo imóvel ao seu portfólio com todas as informações necessárias"
      message={message ? (
        <Message
          type={message.type}
          text={message.text}
          onClose={() => setMessage(null)}
        />
      ) : undefined}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <Section title="Informações Básicas">
          <TwoColumnGrid
            left={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo" className="text-gray-700 dark:text-gray-300">
                    Título do Imóvel *
                  </Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    className={errors.titulo ? 'border-red-500' : ''}
                    placeholder="Ex: Apartamento T2 com varanda"
                  />
                  {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
                </div>

                <div>
                  <Label htmlFor="preco" className="text-gray-700 dark:text-gray-300">
                    Preço (€) *
                  </Label>
                  <Input
                    id="preco"
                    type="number"
                    value={formData.preco}
                    onChange={(e) => handleInputChange('preco', e.target.value)}
                    className={errors.preco ? 'border-red-500' : ''}
                    placeholder="250000"
                  />
                  {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco}</p>}
                </div>

                <div>
                  <Label htmlFor="area" className="text-gray-700 dark:text-gray-300">
                    Área Útil (m²) *
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className={errors.area ? 'border-red-500' : ''}
                    placeholder="85"
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>

                <div>
                  <Label htmlFor="area_terreno" className="text-gray-700 dark:text-gray-300">
                    Área do Terreno (m²)
                  </Label>
                  <Input
                    id="area_terreno"
                    type="number"
                    value={formData.area_terreno}
                    onChange={(e) => handleInputChange('area_terreno', e.target.value)}
                    placeholder="200"
                  />
                </div>

                <div>
                  <Label htmlFor="tipo_imovel" className="text-gray-700 dark:text-gray-300">
                    Tipo de Imóvel *
                  </Label>
                  <Select
                    value={formData.tipo_imovel}
                    onValueChange={(value) => handleInputChange('tipo_imovel', value)}
                  >
                    <SelectTrigger className={errors.tipo_imovel ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="moradia">Moradia</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="loja">Loja</SelectItem>
                      <SelectItem value="escritorio">Escritório</SelectItem>
                      <SelectItem value="armazem">Armazém</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo_imovel && <p className="text-red-500 text-sm mt-1">{errors.tipo_imovel}</p>}
                </div>
              </div>
            }
            right={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quartos" className="text-gray-700 dark:text-gray-300">
                    Quartos *
                  </Label>
                  <Input
                    id="quartos"
                    type="number"
                    value={formData.quartos}
                    onChange={(e) => handleInputChange('quartos', e.target.value)}
                    className={errors.quartos ? 'border-red-500' : ''}
                    placeholder="2"
                  />
                  {errors.quartos && <p className="text-red-500 text-sm mt-1">{errors.quartos}</p>}
                </div>

                <div>
                  <Label htmlFor="banheiros" className="text-gray-700 dark:text-gray-300">
                    Banheiros *
                  </Label>
                  <Input
                    id="banheiros"
                    type="number"
                    value={formData.banheiros}
                    onChange={(e) => handleInputChange('banheiros', e.target.value)}
                    className={errors.banheiros ? 'border-red-500' : ''}
                    placeholder="1"
                  />
                  {errors.banheiros && <p className="text-red-500 text-sm mt-1">{errors.banheiros}</p>}
                </div>

                <div>
                  <Label htmlFor="estado" className="text-gray-700 dark:text-gray-300">
                    Estado do Imóvel *
                  </Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => handleInputChange('estado', value)}
                  >
                    <SelectTrigger className={errors.estado ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="bom">Bom</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="precisa_renovacao">Precisa Renovação</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
                </div>

                <div>
                  <Label htmlFor="ano_construcao" className="text-gray-700 dark:text-gray-300">
                    Ano de Construção
                  </Label>
                  <Input
                    id="ano_construcao"
                    type="number"
                    value={formData.ano_construcao}
                    onChange={(e) => handleInputChange('ano_construcao', e.target.value)}
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <Label htmlFor="certificado_energetico" className="text-gray-700 dark:text-gray-300">
                    Certificado Energético
                  </Label>
                  <Select
                    value={formData.certificado_energetico}
                    onValueChange={(value) => handleInputChange('certificado_energetico', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a classificação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            }
          />
        </Section>

        {/* Localização */}
        <Section title="Localização">
          <TwoColumnGrid
            left={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="endereco" className="text-gray-700 dark:text-gray-300">
                    Endereço Completo *
                  </Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    className={errors.endereco ? 'border-red-500' : ''}
                    placeholder="Rua das Flores, 123"
                  />
                  {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
                </div>

                <div>
                  <Label htmlFor="codigo_postal" className="text-gray-700 dark:text-gray-300">
                    Código Postal *
                  </Label>
                  <Input
                    id="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                    className={errors.codigo_postal ? 'border-red-500' : ''}
                    placeholder="1000-001"
                  />
                  {errors.codigo_postal && <p className="text-red-500 text-sm mt-1">{errors.codigo_postal}</p>}
                </div>

                <div>
                  <Label htmlFor="cidade" className="text-gray-700 dark:text-gray-300">
                    Cidade *
                  </Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    className={errors.cidade ? 'border-red-500' : ''}
                    placeholder="Lisboa"
                  />
                  {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
                </div>
              </div>
            }
            right={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="distrito" className="text-gray-700 dark:text-gray-300">
                    Distrito
                  </Label>
                  <Input
                    id="distrito"
                    value={formData.distrito}
                    onChange={(e) => handleInputChange('distrito', e.target.value)}
                    placeholder="Lisboa"
                  />
                </div>

                <div>
                  <Label htmlFor="pais" className="text-gray-700 dark:text-gray-300">
                    País
                  </Label>
                  <Input
                    id="pais"
                    value={formData.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                    placeholder="Portugal"
                  />
                </div>

                <div>
                  <Label htmlFor="orientacao" className="text-gray-700 dark:text-gray-300">
                    Orientação Solar
                  </Label>
                  <Select
                    value={formData.orientacao}
                    onValueChange={(value) => handleInputChange('orientacao', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a orientação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="norte">Norte</SelectItem>
                      <SelectItem value="sul">Sul</SelectItem>
                      <SelectItem value="este">Este</SelectItem>
                      <SelectItem value="oeste">Oeste</SelectItem>
                      <SelectItem value="nordeste">Nordeste</SelectItem>
                      <SelectItem value="noroeste">Noroeste</SelectItem>
                      <SelectItem value="sudeste">Sudeste</SelectItem>
                      <SelectItem value="sudoeste">Sudoeste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            }
          />
        </Section>

        {/* Características */}
        <Section title="Características e Comodidades">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="garagem"
                checked={formData.garagem}
                onCheckedChange={(checked) => handleInputChange('garagem', checked)}
              />
              <Label htmlFor="garagem" className="flex items-center space-x-1">
                <Car className="h-4 w-4" />
                <span>Garagem</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="elevador"
                checked={formData.elevador}
                onCheckedChange={(checked) => handleInputChange('elevador', checked)}
              />
              <Label htmlFor="elevador" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Elevador</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="varanda"
                checked={formData.varanda}
                onCheckedChange={(checked) => handleInputChange('varanda', checked)}
              />
              <Label htmlFor="varanda" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Varanda</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="terraco"
                checked={formData.terraco}
                onCheckedChange={(checked) => handleInputChange('terraco', checked)}
              />
              <Label htmlFor="terraco" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Terraço</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="jardim"
                checked={formData.jardim}
                onCheckedChange={(checked) => handleInputChange('jardim', checked)}
              />
              <Label htmlFor="jardim" className="flex items-center space-x-1">
                <TreePine className="h-4 w-4" />
                <span>Jardim</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="piscina"
                checked={formData.piscina}
                onCheckedChange={(checked) => handleInputChange('piscina', checked)}
              />
              <Label htmlFor="piscina" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Piscina</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ar_condicionado"
                checked={formData.ar_condicionado}
                onCheckedChange={(checked) => handleInputChange('ar_condicionado', checked)}
              />
              <Label htmlFor="ar_condicionado" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Ar Condicionado</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="aquecimento"
                checked={formData.aquecimento}
                onCheckedChange={(checked) => handleInputChange('aquecimento', checked)}
              />
              <Label htmlFor="aquecimento" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Aquecimento</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="lareira"
                checked={formData.lareira}
                onCheckedChange={(checked) => handleInputChange('lareira', checked)}
              />
              <Label htmlFor="lareira" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Lareira</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="alarme"
                checked={formData.alarme}
                onCheckedChange={(checked) => handleInputChange('alarme', checked)}
              />
              <Label htmlFor="alarme" className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Alarme</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="portao_automatico"
                checked={formData.portao_automatico}
                onCheckedChange={(checked) => handleInputChange('portao_automatico', checked)}
              />
              <Label htmlFor="portao_automatico" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Portão Automático</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="internet"
                checked={formData.internet}
                onCheckedChange={(checked) => handleInputChange('internet', checked)}
              />
              <Label htmlFor="internet" className="flex items-center space-x-1">
                <Wifi className="h-4 w-4" />
                <span>Internet</span>
              </Label>
            </div>
          </div>

          {formData.garagem && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lugares_garagem" className="text-gray-700 dark:text-gray-300">
                  Lugares de Garagem
                </Label>
                <Input
                  id="lugares_garagem"
                  type="number"
                  value={formData.lugares_garagem}
                  onChange={(e) => handleInputChange('lugares_garagem', e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="tipo_garagem" className="text-gray-700 dark:text-gray-300">
                  Tipo de Garagem
                </Label>
                <Select
                  value={formData.tipo_garagem}
                  onValueChange={(value) => handleInputChange('tipo_garagem', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coberta">Coberta</SelectItem>
                    <SelectItem value="descoberta">Descoberta</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="garagem_privada">Garagem Privada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Section>

        {/* Imagens */}
        <Section title="Imagens do Imóvel">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Upload de Imagens *
              </Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagens
                </Button>
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setMainImage(image.id)}
                        className={image.isMain ? 'bg-primary text-white' : ''}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => removeImage(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Badge de imagem principal */}
                    {image.isMain && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Descrição */}
        <Section title="Descrição e Detalhes">
          <div className="space-y-4">
            <div>
              <Label htmlFor="descricao" className="text-gray-700 dark:text-gray-300">
                Descrição Detalhada *
              </Label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  errors.descricao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                rows={6}
                placeholder="Descreva o imóvel em detalhes, incluindo características especiais, localização, comodidades, etc..."
              />
              {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
            </div>

            <div>
              <Label htmlFor="observacoes" className="text-gray-700 dark:text-gray-300">
                Observações Adicionais
              </Label>
              <textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Informações adicionais sobre o imóvel..."
              />
            </div>
          </div>
        </Section>

        {/* Informações Comerciais */}
        <Section title="Informações Comerciais">
          <TwoColumnGrid
            left={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo_negocio" className="text-gray-700 dark:text-gray-300">
                    Tipo de Negócio
                  </Label>
                  <Select
                    value={formData.tipo_negocio}
                    onValueChange={(value) => handleInputChange('tipo_negocio', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="arrendamento">Arrendamento</SelectItem>
                      <SelectItem value="venda_arrendamento">Venda e Arrendamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="disponibilidade" className="text-gray-700 dark:text-gray-300">
                    Disponibilidade
                  </Label>
                  <Select
                    value={formData.disponibilidade}
                    onValueChange={(value) => handleInputChange('disponibilidade', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disponibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imediata">Imediata</SelectItem>
                      <SelectItem value="30_dias">30 dias</SelectItem>
                      <SelectItem value="60_dias">60 dias</SelectItem>
                      <SelectItem value="90_dias">90 dias</SelectItem>
                      <SelectItem value="negociavel">Negociável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="comissao" className="text-gray-700 dark:text-gray-300">
                    Comissão (%)
                  </Label>
                  <Input
                    id="comissao"
                    type="number"
                    value={formData.comissao}
                    onChange={(e) => handleInputChange('comissao', e.target.value)}
                    placeholder="3"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>
            }
            right={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contacto_visitas" className="text-gray-700 dark:text-gray-300">
                    Contacto para Visitas
                  </Label>
                  <Input
                    id="contacto_visitas"
                    value={formData.contacto_visitas}
                    onChange={(e) => handleInputChange('contacto_visitas', e.target.value)}
                    placeholder="+351 123 456 789"
                  />
                </div>

                <div>
                  <Label htmlFor="palavras_chave" className="text-gray-700 dark:text-gray-300">
                    Palavras-chave (SEO)
                  </Label>
                  <Input
                    id="palavras_chave"
                    value={formData.palavras_chave}
                    onChange={(e) => handleInputChange('palavras_chave', e.target.value)}
                    placeholder="apartamento, lisboa, centro, moderno"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="destaque"
                      checked={formData.destaque}
                      onCheckedChange={(checked) => handleInputChange('destaque', checked)}
                    />
                    <Label htmlFor="destaque">Destacar este imóvel</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="urgente"
                      checked={formData.urgente}
                      onCheckedChange={(checked) => handleInputChange('urgente', checked)}
                    />
                    <Label htmlFor="urgente">Venda urgente</Label>
                  </div>
                </div>
              </div>
            }
          />
        </Section>

        {/* Botões de Ação */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isSaving ? 'A guardar...' : 'Cadastrar Imóvel'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}