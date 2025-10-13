'use client';

import { Modal } from '@/components/ui/modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, XCircle, Info } from 'lucide-react';

interface AccountStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'verified' | 'rejected' | 'inactive';
  userType: string;
}

const AccountStatusModal: React.FC<AccountStatusModalProps> = ({ 
  isOpen, 
  onClose, 
  status, 
  userType 
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6 text-yellow-600" />,
          title: 'Conta Pendente de Análise',
          color: 'yellow',
          message: 'A sua conta está a ser analisada pela nossa equipa. Este processo pode levar até 24-48 horas úteis.',
          details: [
            'Verificação dos dados pessoais fornecidos',
            'Validação dos documentos de identificação',
            'Confirmação do tipo de utilizador selecionado',
            'Verificação de conformidade com os termos de serviço'
          ],
          nextSteps: [
            'Receberá um email de confirmação quando a análise estiver concluída',
            'Pode continuar a explorar a plataforma com funcionalidades limitadas',
            'Contacte o suporte se tiver dúvidas sobre o processo'
          ]
        };
      case 'verified':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          title: 'Conta Verificada',
          color: 'green',
          message: 'A sua conta foi verificada com sucesso! Tem acesso completo a todas as funcionalidades.',
          details: [
            'Todos os dados foram validados',
            'Conta ativa e funcional',
            'Acesso completo à plataforma',
            'Pode começar a usar todas as funcionalidades'
          ],
          nextSteps: [
            'Explore o dashboard completo',
            'Configure as suas preferências',
            'Comece a cadastrar propriedades'
          ]
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          title: 'Conta Rejeitada',
          color: 'red',
          message: 'A sua conta foi rejeitada após análise. Por favor, contacte o suporte para mais informações.',
          details: [
            'Dados fornecidos não atendem aos critérios',
            'Documentos de identificação inválidos',
            'Informações inconsistentes',
            'Violação dos termos de serviço'
          ],
          nextSteps: [
            'Contacte o suporte para esclarecimentos',
            'Verifique os dados fornecidos',
            'Reenvie a documentação se necessário'
          ]
        };
      case 'inactive':
        return {
          icon: <Info className="h-6 w-6 text-blue-600" />,
          title: 'Conta Inativa',
          color: 'blue',
          message: 'A sua conta está temporariamente inativa. Contacte o suporte para reativar.',
          details: [
            'Conta suspensa temporariamente',
            'Possível violação dos termos',
            'Dados em processo de atualização',
            'Solicitação de reativação pendente'
          ],
          nextSteps: [
            'Contacte o suporte imediatamente',
            'Forneça informações adicionais se solicitado',
            'Aguarde instruções da equipa de suporte'
          ]
        };
      default:
        return {
          icon: <Info className="h-6 w-6 text-gray-600" />,
          title: 'Status Desconhecido',
          color: 'gray',
          message: 'Não foi possível determinar o status da sua conta.',
          details: [],
          nextSteps: []
        };
    }
  };

  const statusInfo = getStatusInfo();
  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'agente': return 'Agente Imobiliário';
      case 'imobiliaria': return 'Imobiliária';
      default: return 'Proprietário';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={statusInfo.title}
      description={`Status da conta de ${getUserTypeLabel(userType)}`}
    >
      <div className="space-y-6">
        {/* Status Icon and Message */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {statusInfo.icon}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {statusInfo.message}
          </p>
        </div>

        {/* Details */}
        {statusInfo.details.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              O que está a acontecer:
            </h4>
            <ul className="space-y-2">
              {statusInfo.details.map((detail, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {statusInfo.nextSteps.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Próximos passos:
            </h4>
            <ul className="space-y-2">
              {statusInfo.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Support */}
        <Alert className={`border-${statusInfo.color}-200 bg-${statusInfo.color}-50 dark:bg-${statusInfo.color}-900/20 dark:border-${statusInfo.color}-800`}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Precisa de ajuda?</strong> Contacte o nosso suporte através do email{' '}
            <a href="mailto:suporte@vendemossuacasa.com" className="text-primary hover:underline">
              suporte@vendemossuacasa.com
            </a>{' '}
            ou use o chat de suporte no dashboard.
          </AlertDescription>
        </Alert>
      </div>
    </Modal>
  );
};

export default AccountStatusModal;
