'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';
import PageLayout, { Section, TwoColumnGrid } from '@/components/dashboard/page-layout';
import Message from '@/components/ui/message';

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
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setConfiguracoes(data.settings);
          // Aplicar tema
          if (data.settings.modo_escuro) {
            setTheme('dark');
          } else {
            setTheme('light');
          }
        }
      } else {
        console.log('Erro ao carregar configurações, usando padrão');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Token de acesso não encontrado' });
        return;
      }

      const response = await fetch('/api/user/settings/bypass', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuracoes),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configurações guardadas com sucesso!' });
        
        // Aplicar tema
        if (configuracoes.modo_escuro) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
        
        // Recarregar página para aplicar todas as configurações
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erro ao guardar configurações' });
      }
    } catch (error) {
      console.error('Erro ao guardar configurações:', error);
      setMessage({ type: 'error', text: 'Erro ao guardar configurações' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfiguracoes({
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
    setMessage({ type: 'success', text: 'Configurações resetadas para o padrão' });
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [key]: value
    }));
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
    <PageLayout
      title="Configurações"
      description="Personalize a sua experiência e preferências"
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
          <Section title="Aparência" description="Personalize o visual da aplicação">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Modo Escuro
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Ativar tema escuro
                  </p>
                </div>
                <Switch
                  checked={configuracoes.modo_escuro}
                  onCheckedChange={(checked) => handleConfigChange('modo_escuro', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Cor do Tema
                </Label>
                <Select
                  value={configuracoes.tema_cor}
                  onValueChange={(value) => handleConfigChange('tema_cor', value)}
                >
                  <SelectTrigger className="transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="azul">Azul</SelectItem>
                    <SelectItem value="verde">Verde</SelectItem>
                    <SelectItem value="roxo">Roxo</SelectItem>
                    <SelectItem value="laranja">Laranja</SelectItem>
                    <SelectItem value="rosa">Rosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Tamanho da Fonte
                </Label>
                <Select
                  value={configuracoes.tamanho_fonte}
                  onValueChange={(value) => handleConfigChange('tamanho_fonte', value)}
                >
                  <SelectTrigger className="transition-colors duration-300">
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
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Modo Compacto
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Reduzir espaçamentos
                  </p>
                </div>
                <Switch
                  checked={configuracoes.compacto}
                  onCheckedChange={(checked) => handleConfigChange('compacto', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Animações
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Ativar transições e animações
                  </p>
                </div>
                <Switch
                  checked={configuracoes.animacoes}
                  onCheckedChange={(checked) => handleConfigChange('animacoes', checked)}
                />
              </div>
            </div>
          </Section>
        }
        right={
          <Section title="Notificações" description="Configure como recebe notificações">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Email
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Receber notificações por email
                  </p>
                </div>
                <Switch
                  checked={configuracoes.notificacoes_email}
                  onCheckedChange={(checked) => handleConfigChange('notificacoes_email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Push
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Notificações push no navegador
                  </p>
                </div>
                <Switch
                  checked={configuracoes.notificacoes_push}
                  onCheckedChange={(checked) => handleConfigChange('notificacoes_push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    SMS
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Receber notificações por SMS
                  </p>
                </div>
                <Switch
                  checked={configuracoes.notificacoes_sms}
                  onCheckedChange={(checked) => handleConfigChange('notificacoes_sms', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Som
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Reproduzir som nas notificações
                  </p>
                </div>
                <Switch
                  checked={configuracoes.som_notificacoes}
                  onCheckedChange={(checked) => handleConfigChange('som_notificacoes', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Vibração
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Vibrar em dispositivos móveis
                  </p>
                </div>
                <Switch
                  checked={configuracoes.vibracao}
                  onCheckedChange={(checked) => handleConfigChange('vibracao', checked)}
                />
              </div>
            </div>
          </Section>
        }
      />

      {/* Configurações adicionais */}
      <Section title="Preferências Gerais" description="Outras configurações da sua conta">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Idioma
            </Label>
            <Select
              value={configuracoes.idioma}
              onValueChange={(value) => handleConfigChange('idioma', value)}
            >
              <SelectTrigger className="transition-colors duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Fuso Horário
            </Label>
            <Select
              value={configuracoes.fuso_horario}
              onValueChange={(value) => handleConfigChange('fuso_horario', value)}
            >
              <SelectTrigger className="transition-colors duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Lisbon">Lisboa (GMT+0/+1)</SelectItem>
                <SelectItem value="Europe/London">Londres (GMT+0/+1)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (GMT+1/+2)</SelectItem>
                <SelectItem value="America/New_York">Nova York (GMT-5/-4)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Privacidade do Perfil
            </Label>
            <Select
              value={configuracoes.privacidade_perfil}
              onValueChange={(value) => handleConfigChange('privacidade_perfil', value)}
            >
              <SelectTrigger className="transition-colors duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publico">Público</SelectItem>
                <SelectItem value="privado">Privado</SelectItem>
                <SelectItem value="amigos">Apenas Amigos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Marketing
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Receber emails promocionais
              </p>
            </div>
            <Switch
              checked={configuracoes.marketing_emails}
              onCheckedChange={(checked) => handleConfigChange('marketing_emails', checked)}
            />
          </div>
        </div>
      </Section>

      {/* Botões de ação */}
      <div className="flex space-x-4 pt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 transition-colors duration-300"
        >
          {isSaving ? 'A guardar...' : 'Guardar Configurações'}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 transition-colors duration-300"
        >
          Resetar
        </Button>
      </div>
    </PageLayout>
  );
}