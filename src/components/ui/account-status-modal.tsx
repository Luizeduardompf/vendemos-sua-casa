'use client';

import { Modal } from '@/components/ui/modal';

interface AccountStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'verified';
  userType?: 'proprietario' | 'agente' | 'imobiliaria';
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
}

export function AccountStatusModal({
  isOpen,
  onClose,
  status,
  userType = 'proprietario',
  emailVerificado = false,
  telefoneVerificado = false
}: AccountStatusModalProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          title: 'Análise Pendente',
          message: 'Sua conta está sendo analisada pela nossa equipe. Você receberá uma notificação assim que a análise for concluída.',
          color: 'yellow'
        };
      case 'approved':
        return {
          title: 'Conta Aprovada',
          message: 'Sua conta foi aprovada! Você pode agora usar todas as funcionalidades da plataforma.',
          color: 'green'
        };
      case 'rejected':
        return {
          title: 'Conta Rejeitada',
          message: 'Sua conta foi rejeitada. Entre em contato conosco para mais informações.',
          color: 'red'
        };
      case 'under_review':
        return {
          title: 'Em Revisão',
          message: 'Sua conta está sendo revisada. Aguarde o retorno da nossa equipe.',
          color: 'blue'
        };
      case 'verified':
        return {
          title: 'Conta Verificada',
          message: 'Sua conta está verificada e ativa. Bem-vindo à plataforma!',
          color: 'green'
        };
      default:
        return {
          title: 'Status Desconhecido',
          message: 'Não foi possível determinar o status da sua conta.',
          color: 'gray'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={statusInfo.title}
      message={statusInfo.message}
      type="info"
    />
  );
}