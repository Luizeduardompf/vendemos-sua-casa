'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      newErrors.area = 'Área deve ser maior que zero';
    }

    if (!formData.quartos) {
      newErrors.quartos = 'Número de quartos é obrigatório';
    }

    if (!formData.casas_banho) {
      newErrors.casas_banho = 'Número de casas de banho é obrigatório';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Por favor, corrija os erros no formulário.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Token de autenticação não encontrado. Faça login novamente.' });
        return;
      }

      // Aqui implementaremos a API para cadastrar imóvel
      console.log('Dados do imóvel:', formData);
      
      // Simular cadastro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Imóvel cadastrado com sucesso! Redirecionando...' });
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        router.push('/dashboard/proprietario');
      }, 2000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao cadastrar imóvel. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🏠 Cadastrar Novo Imóvel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Preencha os dados do seu imóvel para começar a receber propostas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : ''}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título do Anúncio *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Ex: Apartamento T2 com varanda, centro de Lisboa"
                />
                {errors.titulo && (
                  <p className="text-sm text-red-600">{errors.titulo}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva o imóvel, localização, características especiais..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
                {errors.descricao && (
                  <p className="text-sm text-red-600">{errors.descricao}</p>
                )}
              </div>

              {/* Preço e Área */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (€) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    value={formData.preco}
                    onChange={(e) => handleInputChange('preco', e.target.value)}
                    placeholder="250000"
                  />
                  {errors.preco && (
                    <p className="text-sm text-red-600">{errors.preco}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área (m²) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="85"
                  />
                  {errors.area && (
                    <p className="text-sm text-red-600">{errors.area}</p>
                  )}
                </div>
              </div>

              {/* Quartos e Casas de Banho */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quartos">Quartos *</Label>
                  <Select value={formData.quartos} onValueChange={(value) => handleInputChange('quartos', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T0">T0</SelectItem>
                      <SelectItem value="T1">T1</SelectItem>
                      <SelectItem value="T2">T2</SelectItem>
                      <SelectItem value="T3">T3</SelectItem>
                      <SelectItem value="T4">T4</SelectItem>
                      <SelectItem value="T5+">T5+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.quartos && (
                    <p className="text-sm text-red-600">{errors.quartos}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="casas_banho">Casas de Banho *</Label>
                  <Select value={formData.casas_banho} onValueChange={(value) => handleInputChange('casas_banho', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4+">4+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.casas_banho && (
                    <p className="text-sm text-red-600">{errors.casas_banho}</p>
                  )}
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização *</Label>
                <Input
                  id="localizacao"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  placeholder="Ex: Lisboa, Porto, Braga..."
                />
                {errors.localizacao && (
                  <p className="text-sm text-red-600">{errors.localizacao}</p>
                )}
              </div>

              {/* Tipo de Imóvel e Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_imovel">Tipo de Imóvel *</Label>
                  <Select value={formData.tipo_imovel} onValueChange={(value) => handleInputChange('tipo_imovel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado do Imóvel *</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="bom">Bom</SelectItem>
                      <SelectItem value="razoavel">Razoável</SelectItem>
                      <SelectItem value="precisa_obras">Precisa de Obras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/proprietario')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSaving ? 'Cadastrando...' : 'Cadastrar Imóvel'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
