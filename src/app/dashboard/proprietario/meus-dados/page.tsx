'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageLayout, { Section, TwoColumnGrid } from '@/components/dashboard/page-layout';
import Message from '@/components/ui/message';
import PasswordModal from '@/components/auth/password-modal';

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
  telefone_verificado?: boolean;
  conta_analisada?: boolean;
  status_analise?: 'pending' | 'approved' | 'rejected' | 'under_review';
  dados_sociais?: any;
  foto_manual?: boolean;
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

  // Estado para edição de foto
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Estado para modal de senha
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Token de acesso não encontrado' });
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setFormData({
          nome_completo: data.user.nome_completo || '',
          telefone: data.user.telefone || '',
          nif: data.user.nif || '',
          tipo_pessoa: data.user.tipo_pessoa || 'singular'
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao carregar dados' });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecione apenas arquivos de imagem' });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB' });
      return;
    }

    setIsUploadingPhoto(true);
    setMessage(null);

    try {
      // Converter para base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        
        try {
          const token = localStorage.getItem('access_token');
          if (!token) {
            setMessage({ type: 'error', text: 'Token de acesso não encontrado' });
            return;
          }

          // Atualizar foto no perfil
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              foto_perfil: base64,
              foto_manual: true
            }),
          });

          const result = await response.json();

          if (response.ok) {
            setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
            // Recarregar dados do usuário
            await fetchUserData();
            
            // Notificar o sidebar para atualizar a foto
            window.dispatchEvent(new CustomEvent('userPhotoUpdated', { 
              detail: { photoUrl: base64 } 
            }));
          } else {
            setMessage({ type: 'error', text: result.error || 'Erro ao atualizar foto' });
          }
        } catch (error) {
          console.error('Erro ao atualizar foto:', error);
          setMessage({ type: 'error', text: 'Erro interno do servidor' });
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setMessage({ type: 'error', text: 'Erro ao processar arquivo' });
      setIsUploadingPhoto(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome_completo.trim()) {
      newErrors.nome_completo = 'Nome completo é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.nif.trim()) {
      newErrors.nif = 'NIF é obrigatório';
    }

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
    <PageLayout
      title="Meus Dados"
      description="Gerencie as suas informações pessoais e de contacto"
      message={message ? (
        <Message
          type={message.type}
          text={message.text}
          onClose={() => setMessage(null)}
        />
      ) : undefined}
    >
      {/* Conteúdo principal */}
      <TwoColumnGrid
        left={
          <Section title="Informações da Conta">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData?.email || ''}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                  O email não pode ser alterado
                </p>
              </div>

              <div>
                <Label htmlFor="user_type" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Tipo de Utilizador
                </Label>
                <Input
                  id="user_type"
                  value={userData?.user_type === 'proprietario' ? 'Proprietário' : userData?.user_type || ''}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Estado da Conta
                </Label>
                <div className="flex items-center space-x-2 mt-2">
                  {(() => {
                    // Lógica baseada nos novos campos de verificação
                    if (userData?.status_analise === 'approved') {
                      return (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            Aprovada
                          </span>
                        </>
                      );
                    } else if (userData?.status_analise === 'rejected') {
                      return (
                        <>
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            Rejeitada
                          </span>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            Análise Pendente
                          </span>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>

              <div>
                <Label htmlFor="created_at" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Membro desde
                </Label>
                <Input
                  id="created_at"
                  value={userData?.created_at ? new Date(userData.created_at).toLocaleDateString('pt-PT') : ''}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300"
                />
              </div>
            </div>
          </Section>
        }
        right={
          <Section title="Dados Pessoais">
            <div className="space-y-4">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden transition-colors duration-300">
                    {userData?.foto_perfil ? (
                      <img
                        src={userData.foto_perfil}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('🔵 Imagem carregada com sucesso')}
                        onError={() => console.log('❌ Erro ao carregar imagem')}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        {userData?.nome_completo?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay para editar foto */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    {isUploadingPhoto ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploadingPhoto}
                  />
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {userData?.nome_completo || 'Utilizador'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    {userData?.provedor === 'google' ? 'Conectado via Google' : 'Conta local'}
                  </p>
                  {userData?.email_verificado && (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center space-x-1">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Email verificado</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Clique na foto para editar
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome_completo" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome_completo"
                    type="text"
                    value={formData.nome_completo}
                    onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                    className={`transition-colors duration-300 ${errors.nome_completo ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Digite o seu nome completo"
                  />
                  {errors.nome_completo && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome_completo}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className={`transition-colors duration-300 ${errors.telefone ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="+351 XXX XXX XXX"
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nif" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    NIF *
                  </Label>
                  <Input
                    id="nif"
                    type="text"
                    value={formData.nif}
                    onChange={(e) => handleInputChange('nif', e.target.value)}
                    className={`transition-colors duration-300 ${errors.nif ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="123456789"
                  />
                  {errors.nif && (
                    <p className="text-red-500 text-sm mt-1">{errors.nif}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tipo_pessoa" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Tipo de Pessoa *
                  </Label>
                  <Select
                    value={formData.tipo_pessoa}
                    onValueChange={(value) => handleInputChange('tipo_pessoa', value)}
                  >
                    <SelectTrigger className={`transition-colors duration-300 ${errors.tipo_pessoa ? 'border-red-500 focus:border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o tipo de pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="singular">Pessoa Singular</SelectItem>
                      <SelectItem value="coletiva">Pessoa Coletiva</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo_pessoa && (
                    <p className="text-red-500 text-sm mt-1">{errors.tipo_pessoa}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full transition-colors duration-300"
                >
                  {isSaving ? 'A guardar...' : 'Guardar Alterações'}
                </Button>
              </form>

              {/* Botão para gerenciar senha */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Acesso por Email e Senha
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {userData?.provedor?.includes('email') 
                        ? '✅ Senha definida - Pode usar email e senha'
                        : '❌ Apenas login social - Defina uma senha'
                      }
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="transition-colors duration-300"
                    >
                      {userData?.provedor?.includes('email') ? 'Alterar Senha' : 'Definir Senha'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        }
      />

      {/* Modal de senha */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={userData?.email || ''}
        hasPassword={userData?.provedor?.includes('email') || false}
        onSuccess={() => {
          // Recarregar dados do usuário
          fetchUserData();
        }}
      />
    </PageLayout>
  );
}