'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from '@/hooks/use-theme';

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Estados das configurações
  const [configuracoes, setConfiguracoes] = useState({
    modo_escuro: false,
    tema_cor: 'azul',
    tamanho_fonte: 'medio',
    compacto: false,
    animacoes: true,
    notificacoes_email: true,
    notificacoes_push: true,
    notificacoes_sms: false,
    som_notificacoes: true,
    vibracao: true,
    idioma: 'pt',
    fuso_horario: 'Europe/Lisbon',
    privacidade_perfil: 'publico',
    marketing_emails: false
  });

  useEffect(() => {
    loadConfiguracoes();
  }, []);

  const loadConfiguracoes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('Token não encontrado, usando configurações padrão');
        setTheme('light');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/user/settings/bypass', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracoes(data.settings);
        
        // Aplicar tema se estiver salvo
        if (data.settings.modo_escuro !== undefined) {
          setTheme(data.settings.modo_escuro ? 'dark' : 'light');
        } else {
          setTheme('light');
        }
      } else {
        console.error('Erro ao carregar configurações da API:', response.status);
        // Fallback para configurações padrão
        setTheme('light');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setTheme('light');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (key: string, value: unknown) => {
    setConfiguracoes(prev => ({ ...prev, [key]: value }));
    
    // Aplicar mudanças imediatas para tema
    if (key === 'modo_escuro') {
      setTheme(value ? 'dark' : 'light');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Token de autenticação não encontrado. Faça login novamente.' });
        return;
      }

      const response = await fetch('/api/user/settings/bypass', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configuracoes)
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracoes(data.settings);
        
        // Aplicar tema se necessário
        if (configuracoes.modo_escuro !== undefined) {
          setTheme(configuracoes.modo_escuro ? 'dark' : 'light');
        }
        
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso! Atualizando página...' });
        
        // Refresh automático após 1 segundo
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Erro ao salvar configurações.' });
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage({ type: 'error', text: 'Erro de conexão ao salvar configurações. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
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

      const response = await fetch('/api/user/settings/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracoes(data.settings);
        
        // Aplicar tema padrão
        setTheme('light');
        
        setMessage({ type: 'success', text: data.message || 'Configurações resetadas com sucesso!' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Erro ao resetar configurações.' });
      }
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      setMessage({ type: 'error', text: 'Erro de conexão ao resetar configurações. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>A carregar configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Personalize a sua experiência na plataforma
        </p>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              <span>Aparência</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="modo_escuro" className="text-base">Modo Escuro</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ativar o tema escuro para reduzir o cansaço visual
                </p>
              </div>
              <Switch
                id="modo_escuro"
                checked={configuracoes.modo_escuro}
                onCheckedChange={(checked) => handleConfigChange('modo_escuro', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tema_cor">Cor do Tema</Label>
              <Select
                value={configuracoes.tema_cor}
                onValueChange={(value) => handleConfigChange('tema_cor', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azul">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span>Azul</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="verde">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span>Verde</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="roxo">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span>Roxo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="laranja">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span>Laranja</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="vermelho">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span>Vermelho</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamanho_fonte">Tamanho da Fonte</Label>
              <Select
                value={configuracoes.tamanho_fonte}
                onValueChange={(value) => handleConfigChange('tamanho_fonte', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeno">Pequeno</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compacto" className="text-base">Modo Compacto</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reduzir espaçamentos para mostrar mais conteúdo
                </p>
              </div>
              <Switch
                id="compacto"
                checked={configuracoes.compacto}
                onCheckedChange={(checked) => handleConfigChange('compacto', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animacoes" className="text-base">Animações</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ativar transições e animações suaves
                </p>
              </div>
              <Switch
                id="animacoes"
                checked={configuracoes.animacoes}
                onCheckedChange={(checked) => handleConfigChange('animacoes', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idioma">Idioma</Label>
              <Select
                value={configuracoes.idioma}
                onValueChange={(value) => handleConfigChange('idioma', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português (PT)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuso_horario">Fuso Horário</Label>
              <Select
                value={configuracoes.fuso_horario}
                onValueChange={(value) => handleConfigChange('fuso_horario', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Lisbon">Lisboa (GMT+0/+1)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT+0/+1)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (GMT+1/+2)</SelectItem>
                  <SelectItem value="America/New_York">Nova Iorque (GMT-5/-4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V7a7 7 0 00-14 0v5l-5 5h5m0 0v1a3 3 0 106 0v-1m-6 0H9" />
              </svg>
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoes_email" className="text-base">Email</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber notificações por email
                </p>
              </div>
              <Switch
                id="notificacoes_email"
                checked={configuracoes.notificacoes_email}
                onCheckedChange={(checked) => handleConfigChange('notificacoes_email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoes_push" className="text-base">Push</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Notificações push no navegador
                </p>
              </div>
              <Switch
                id="notificacoes_push"
                checked={configuracoes.notificacoes_push}
                onCheckedChange={(checked) => handleConfigChange('notificacoes_push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoes_sms" className="text-base">SMS</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Notificações por SMS (apenas urgências)
                </p>
              </div>
              <Switch
                id="notificacoes_sms"
                checked={configuracoes.notificacoes_sms}
                onCheckedChange={(checked) => handleConfigChange('notificacoes_sms', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="som_notificacoes" className="text-base">Som</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reproduzir som nas notificações
                </p>
              </div>
              <Switch
                id="som_notificacoes"
                checked={configuracoes.som_notificacoes}
                onCheckedChange={(checked) => handleConfigChange('som_notificacoes', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vibracao" className="text-base">Vibração</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vibração em dispositivos móveis
                </p>
              </div>
              <Switch
                id="vibracao"
                checked={configuracoes.vibracao}
                onCheckedChange={(checked) => handleConfigChange('vibracao', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Privacidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="privacidade_perfil">Visibilidade do Perfil</Label>
              <Select
                value={configuracoes.privacidade_perfil}
                onValueChange={(value) => handleConfigChange('privacidade_perfil', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público</SelectItem>
                  <SelectItem value="privado">Privado</SelectItem>
                  <SelectItem value="agentes_apenas">Apenas Agentes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Controla quem pode ver o seu perfil
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing_emails" className="text-base">Marketing</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber emails promocionais e novidades
                </p>
              </div>
              <Switch
                id="marketing_emails"
                checked={configuracoes.marketing_emails}
                onCheckedChange={(checked) => handleConfigChange('marketing_emails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Exportar Dados
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Alterar Palavra-passe
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar Conta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <Button
          onClick={handleReset}
          variant="outline"
          disabled={isSaving}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
        >
          {isSaving ? 'A Resetar...' : 'Resetar Tudo'}
        </Button>
        
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              loadConfiguracoes();
              setMessage(null);
            }}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
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
      </div>
    </div>
  );
}
