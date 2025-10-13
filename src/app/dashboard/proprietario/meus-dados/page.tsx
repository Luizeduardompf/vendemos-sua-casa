'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserData {
  id: string;
  email: string;
  nome_completo: string;
  telefone: string;
  nif: string;
  tipo_pessoa: string;
  user_type: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Novos campos do Google
  foto_perfil?: string;
  primeiro_nome?: string;
  ultimo_nome?: string;
  nome_exibicao?: string;
  provedor?: string;
  localizacao?: string;
  email_verificado?: boolean;
  dados_sociais?: any;
}

export default function MeusDadosPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome_completo: '',
    telefone: '',
    nif: '',
    tipo_pessoa: 'singular'
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setFormData({
          nome_completo: data.user.nome_completo || '',
          telefone: data.user.telefone || '',
          nif: data.user.nif || '',
          tipo_pessoa: data.user.tipo_pessoa || 'singular'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados do utilizador' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar nome completo
    if (!formData.nome_completo.trim()) {
      newErrors.nome_completo = 'Nome completo é obrigatório';
    } else if (formData.nome_completo.trim().length < 2) {
      newErrors.nome_completo = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\+351\d{9}$/.test(formData.telefone.trim())) {
      newErrors.telefone = 'Telefone deve estar no formato +351XXXXXXXXX';
    }

    // Validar NIF
    if (!formData.nif.trim()) {
      newErrors.nif = 'NIF é obrigatório';
    } else if (!/^\d{9}$/.test(formData.nif.trim())) {
      newErrors.nif = 'NIF deve ter exatamente 9 dígitos';
    }

    // Validar tipo de pessoa
    if (!formData.tipo_pessoa) {
      newErrors.tipo_pessoa = 'Tipo de pessoa é obrigatório';
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Sessão expirada. Faça login novamente.' });
        return;
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome_completo: formData.nome_completo.trim(),
          telefone: formData.telefone.trim(),
          nif: formData.nif.trim(),
          tipo_pessoa: formData.tipo_pessoa
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
        setUserData(data.user);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar dados' });
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar dados' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o utilizador começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>A carregar dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Dados</h1>
        <p className="text-gray-600 mt-2">
          Gerencie as suas informações pessoais e de contacto
        </p>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <Input
                value={userData?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                O email não pode ser alterado
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Tipo de Utilizador</Label>
              <Input
                value={userData?.user_type === 'proprietario' ? 'Proprietário' : 
                       userData?.user_type === 'agente' ? 'Agente' : 
                       userData?.user_type === 'imobiliaria' ? 'Imobiliária' : 'Utilizador'}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Estado da Conta</Label>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${userData?.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm">
                  {userData?.is_verified ? 'Verificado' : 'Pendente de Verificação'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Membro desde</Label>
              <Input
                value={userData?.created_at ? new Date(userData.created_at).toLocaleDateString('pt-PT') : ''}
                disabled
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto de Perfil */}
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                    {userData?.foto_perfil ? (
                      <img 
                        src={userData.foto_perfil} 
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-medium text-primary dark:text-primary-foreground">
                                  ${userData?.nome_completo?.split(' ').length > 1 
                                    ? `${userData.nome_completo.split(' ')[0][0]}${userData.nome_completo.split(' ')[userData.nome_completo.split(' ').length - 1][0]}`.toUpperCase()
                                    : userData?.nome_completo?.[0]?.toUpperCase() || 'U'
                                  }
                                </span>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-medium text-primary dark:text-primary-foreground">
                          {userData?.nome_completo?.split(' ').length > 1 
                            ? `${userData.nome_completo.split(' ')[0][0]}${userData.nome_completo.split(' ')[userData.nome_completo.split(' ').length - 1][0]}`.toUpperCase()
                            : userData?.nome_completo?.[0]?.toUpperCase() || 'U'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {userData?.nome_completo || 'Utilizador'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userData?.provedor ? `Conectado via ${userData.provedor.charAt(0).toUpperCase() + userData.provedor.slice(1)}` : 'Conta local'}
                  </p>
                  {userData?.email_verificado && (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Email verificado
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nome_completo">Nome Completo *</Label>
                  <Input
                    id="nome_completo"
                    value={formData.nome_completo}
                    onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                    className={errors.nome_completo ? 'border-red-500' : ''}
                    placeholder="Ex: João Silva"
                  />
                  {errors.nome_completo && (
                    <p className="text-sm text-red-600">{errors.nome_completo}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className={errors.telefone ? 'border-red-500' : ''}
                    placeholder="+351XXXXXXXXX"
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-600">{errors.telefone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nif">NIF *</Label>
                  <Input
                    id="nif"
                    value={formData.nif}
                    onChange={(e) => handleInputChange('nif', e.target.value)}
                    className={errors.nif ? 'border-red-500' : ''}
                    placeholder="123456789"
                    maxLength={9}
                  />
                  {errors.nif && (
                    <p className="text-sm text-red-600">{errors.nif}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tipo_pessoa">Tipo de Pessoa *</Label>
                  <Select
                    value={formData.tipo_pessoa}
                    onValueChange={(value) => handleInputChange('tipo_pessoa', value)}
                  >
                    <SelectTrigger className={errors.tipo_pessoa ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="singular">Pessoa Singular</SelectItem>
                      <SelectItem value="coletiva">Pessoa Coletiva</SelectItem>
                      <SelectItem value="construtor">Construtor</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo_pessoa && (
                    <p className="text-sm text-red-600">{errors.tipo_pessoa}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      nome_completo: userData?.nome_completo || '',
                      telefone: userData?.telefone || '',
                      nif: userData?.nif || '',
                      tipo_pessoa: userData?.tipo_pessoa || 'singular'
                    });
                    setErrors({});
                    setMessage(null);
                  }}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      A guardar...
                    </>
                  ) : (
                    'Guardar Alterações'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
