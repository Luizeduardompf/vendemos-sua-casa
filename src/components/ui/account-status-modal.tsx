'use client';

import { Modal } from '@/components/ui/modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, XCircle, Info } from 'lucide-react';

interface AccountStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'verified' | 'rejected' | 'inactive';
  userType: string;
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
}

const AccountStatusModal: React.FC<AccountStatusModalProps> = ({ 
  isOpen, 
  onClose, 
  status, 
  userType,
  emailVerificado = false,
  telefoneVerificado = false
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-8 w-8 text-amber-500" />,
          title: 'Análise em Andamento',
          color: 'amber',
          message: 'A sua conta está a ser analisada pela nossa equipa! Este processo garante a segurança e qualidade do nosso serviço.',
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
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: 'Conta Aprovada! 🎉',
          color: 'green',
          message: 'Parabéns! A sua conta foi verificada com sucesso e está pronta para usar todas as funcionalidades.',
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
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          title: 'Conta Rejeitada',
          color: 'red',
          message: 'Infelizmente, a sua conta foi rejeitada após análise. Mas não se preocupe, podemos ajudar!',
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
          icon: <Info className="h-8 w-8 text-blue-500" />,
          title: 'Conta Inativa',
          color: 'blue',
          message: 'A sua conta está temporariamente inativa. Vamos resolver isso rapidamente!',
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
      title=""
      description=""
    >
      <div className="space-y-6">
        {/* Status Icon and Message */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full bg-${statusInfo.color}-50 dark:bg-${statusInfo.color}-900/20`}>
              {statusInfo.icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {statusInfo.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {statusInfo.message}
          </p>
        </div>

        {/* Verification Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 space-y-4 border border-blue-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Status das Verificações
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
              <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${emailVerificado ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                {emailVerificado ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Verificado</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3" />
                    <span>Pendente</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone:</span>
              <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${telefoneVerificado ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                {telefoneVerificado ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Verificado</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3" />
                    <span>Pendente</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        {statusInfo.details.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              O que está a acontecer:
            </h4>
            <ul className="space-y-3">
              {statusInfo.details.map((detail, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {statusInfo.nextSteps.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 border border-green-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Próximos passos:
            </h4>
            <ul className="space-y-3">
              {statusInfo.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 border border-blue-200 dark:border-gray-600">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mt-0.5">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Precisa de ajuda? 🤝
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Contacte o nosso suporte através do email{' '}
                <a 
                  href="mailto:suporte@vendemossuacasa.com" 
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  suporte@vendemossuacasa.com
                </a>{' '}
                ou use o chat de suporte no dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountStatusModal;
