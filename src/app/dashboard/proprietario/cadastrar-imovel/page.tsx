'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageLayout, { Section } from '@/components/dashboard/page-layout';
import Message from '@/components/ui/message';

export default function CadastrarImovelPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    area: '',
    quartos: '',
    casas_banho: '',
    localizacao: '',
    tipo_imovel: 'apartamento',
    estado: 'excelente'
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleInputChange = (name: string, value: string) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.preco)) || Number(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser um número válido';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Área é obrigatória';
    } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      newErrors.area = 'Área deve ser um número válido';
    }

    if (!formData.quartos.trim()) {
      newErrors.quartos = 'Número de quartos é obrigatório';
    } else if (isNaN(Number(formData.quartos)) || Number(formData.quartos) < 0) {
      newErrors.quartos = 'Número de quartos deve ser um número válido';
    }

    if (!formData.casas_banho.trim()) {
      newErrors.casas_banho = 'Número de casas de banho é obrigatório';
    } else if (isNaN(Number(formData.casas_banho)) || Number(formData.casas_banho) < 0) {
      newErrors.casas_banho = 'Número de casas de banho deve ser um número válido';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (!formData.tipo_imovel) {
      newErrors.tipo_imovel = 'Tipo de imóvel é obrigatório';
    }

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

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
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ 
        type: 'success', 
        text: 'Imóvel cadastrado com sucesso! Redirecionando...' 
      });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/dashboard/proprietario');
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
      description="Adicione um novo imóvel ao seu portfólio"
      message={message ? (
        <Message
          type={message.type}
          text={message.text}
          onClose={() => setMessage(null)}
        />
      ) : undefined}
    >
      {/* Formulário principal */}
      <Section title="Informações do Imóvel">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Título *
                </Label>
                <Input
                  id="titulo"
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className={`transition-colors duration-300 ${errors.titulo ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="Ex: Apartamento T2 com varanda"
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
                )}
              </div>

              <div>
                <Label htmlFor="preco" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Preço *
                </Label>
                <Input
                  id="preco"
                  type="number"
                  value={formData.preco}
                  onChange={(e) => handleInputChange('preco', e.target.value)}
                  className={`transition-colors duration-300 ${errors.preco ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="250000"
                />
                {errors.preco && (
                  <p className="text-red-500 text-sm mt-1">{errors.preco}</p>
                )}
              </div>

              <div>
                <Label htmlFor="area" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Área (m²) *
                </Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={`transition-colors duration-300 ${errors.area ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="85"
                />
                {errors.area && (
                  <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                )}
              </div>

              <div>
                <Label htmlFor="localizacao" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Localização *
                </Label>
                <Input
                  id="localizacao"
                  type="text"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  className={`transition-colors duration-300 ${errors.localizacao ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="Lisboa, Portugal"
                />
                {errors.localizacao && (
                  <p className="text-red-500 text-sm mt-1">{errors.localizacao}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="tipo_imovel" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Tipo de Imóvel *
                </Label>
                <Select
                  value={formData.tipo_imovel}
                  onValueChange={(value) => handleInputChange('tipo_imovel', value)}
                >
                  <SelectTrigger className={`transition-colors duration-300 ${errors.tipo_imovel ? 'border-red-500 focus:border-red-500' : ''}`}>
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
                  </SelectContent>
                </Select>
                {errors.tipo_imovel && (
                  <p className="text-red-500 text-sm mt-1">{errors.tipo_imovel}</p>
                )}
              </div>

              <div>
                <Label htmlFor="quartos" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Quartos *
                </Label>
                <Input
                  id="quartos"
                  type="number"
                  value={formData.quartos}
                  onChange={(e) => handleInputChange('quartos', e.target.value)}
                  className={`transition-colors duration-300 ${errors.quartos ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="2"
                />
                {errors.quartos && (
                  <p className="text-red-500 text-sm mt-1">{errors.quartos}</p>
                )}
              </div>

              <div>
                <Label htmlFor="casas_banho" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Casas de Banho *
                </Label>
                <Input
                  id="casas_banho"
                  type="number"
                  value={formData.casas_banho}
                  onChange={(e) => handleInputChange('casas_banho', e.target.value)}
                  className={`transition-colors duration-300 ${errors.casas_banho ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="1"
                />
                {errors.casas_banho && (
                  <p className="text-red-500 text-sm mt-1">{errors.casas_banho}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estado" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Estado *
                </Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange('estado', value)}
                >
                  <SelectTrigger className={`transition-colors duration-300 ${errors.estado ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="bom">Bom</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="precisa_renovacao">Precisa Renovação</SelectItem>
                  </SelectContent>
                </Select>
                {errors.estado && (
                  <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Descrição *
            </Label>
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                errors.descricao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              rows={4}
              placeholder="Descreva o imóvel em detalhes..."
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 transition-colors duration-300"
            >
              {isSaving ? 'A guardar...' : 'Cadastrar Imóvel'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Section>
    </PageLayout>
  );
}