import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Política de Privacidade - VENDEMOSSUACASA.PT
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
                <p className="text-gray-700 leading-relaxed">
                  A VENDEMOSSUACASA.PT compromete-se a proteger a privacidade e os dados pessoais dos nossos utilizadores. Esta Política de Privacidade explica como recolhemos, utilizamos, armazenamos e protegemos as suas informações pessoais em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) e a legislação portuguesa aplicável.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Responsável pelo Tratamento</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Entidade:</strong> VENDEMOSSUACASA.PT</p>
                  <p className="text-gray-700"><strong>Email:</strong> privacidade@vendemossuacasa.pt</p>
                  <p className="text-gray-700"><strong>Telefone:</strong> +351 123 456 789</p>
                  <p className="text-gray-700"><strong>Morada:</strong> Rua Exemplo, 123, Lisboa, Portugal</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Dados Pessoais Recolhidos</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Dados de Proprietários</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
                  <li>Nome completo</li>
                  <li>Endereço de email</li>
                  <li>Número de telefone</li>
                  <li>NIF (Número de Identificação Fiscal)</li>
                  <li>Morada</li>
                  <li>Tipo de pessoa (singular/construtor)</li>
                  <li>Informações sobre os imóveis (endereço, características, preço)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Dados de Agentes Imobiliários</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
                  <li>Nome completo</li>
                  <li>Endereço de email</li>
                  <li>Número de telefone</li>
                  <li>Número AMI (Agente de Mediação Imobiliária)</li>
                  <li>Dados da agência imobiliária</li>
                  <li>Informações de contacto</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Dados de Compradores</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Nome completo</li>
                  <li>Endereço de email</li>
                  <li>Número de telefone</li>
                  <li>Número de identificação (CC)</li>
                  <li>Preferências de imóveis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Finalidades do Tratamento</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Os seus dados pessoais são tratados para as seguintes finalidades:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Prestação do serviço de angariação de imóveis</li>
                  <li>Gestão de agendamentos de visitas</li>
                  <li>Processamento de propostas de compra</li>
                  <li>Comunicação entre proprietários, agentes e compradores</li>
                  <li>Gestão de comissões e pagamentos</li>
                  <li>Cumprimento de obrigações legais</li>
                  <li>Melhoria dos nossos serviços</li>
                  <li>Comunicação de atualizações e novidades</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Base Legal</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  O tratamento dos seus dados pessoais baseia-se em:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Consentimento:</strong> Para comunicações de marketing e cookies não essenciais</li>
                  <li><strong>Execução de contrato:</strong> Para prestação dos nossos serviços</li>
                  <li><strong>Interesse legítimo:</strong> Para melhoria dos serviços e segurança</li>
                  <li><strong>Obrigação legal:</strong> Para cumprimento de requisitos legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Partilha de Dados</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Os seus dados podem ser partilhados com:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Agentes imobiliários registados na plataforma</li>
                  <li>Prestadores de serviços técnicos (hosting, email, etc.)</li>
                  <li>Autoridades competentes, quando legalmente exigido</li>
                  <li>Parceiros comerciais, com o seu consentimento</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Nunca vendemos os seus dados pessoais a terceiros.</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Retenção de Dados</h2>
                <p className="text-gray-700 leading-relaxed">
                  Os seus dados pessoais são conservados apenas pelo tempo necessário para as finalidades para as quais foram recolhidos, ou conforme exigido por lei. Após este período, os dados são eliminados de forma segura.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Os Seus Direitos</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tem os seguintes direitos relativamente aos seus dados pessoais:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Acesso:</strong> Solicitar informações sobre os dados que tratamos</li>
                  <li><strong>Retificação:</strong> Corrigir dados incorretos ou incompletos</li>
                  <li><strong>Apagamento:</strong> Solicitar a eliminação dos seus dados</li>
                  <li><strong>Limitação:</strong> Restringir o tratamento dos seus dados</li>
                  <li><strong>Portabilidade:</strong> Receber os seus dados num formato estruturado</li>
                  <li><strong>Oposição:</strong> Opor-se ao tratamento dos seus dados</li>
                  <li><strong>Retirada de consentimento:</strong> Retirar o consentimento a qualquer momento</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Para exercer estes direitos, contacte-nos através de: <strong>privacidade@vendemossuacasa.pt</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Segurança dos Dados</h2>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos encriptação, controlos de acesso e monitorização regular dos nossos sistemas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Utilizamos cookies para melhorar a sua experiência no nosso website. Os cookies são pequenos ficheiros armazenados no seu dispositivo que nos ajudam a:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Lembrar as suas preferências</li>
                  <li>Analisar o tráfego do website</li>
                  <li>Personalizar o conteúdo</li>
                  <li>Melhorar a funcionalidade</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Pode gerir as suas preferências de cookies através das configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Alterações à Política</h2>
                <p className="text-gray-700 leading-relaxed">
                  Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre alterações significativas através do nosso website ou por email. A utilização continuada dos nossos serviços após as alterações constitui aceitação da nova política.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contacto e Reclamações</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Para questões sobre esta Política de Privacidade ou para exercer os seus direitos, contacte-nos:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Email:</strong> privacidade@vendemossuacasa.pt</p>
                  <p className="text-gray-700"><strong>Telefone:</strong> +351 123 456 789</p>
                  <p className="text-gray-700"><strong>Morada:</strong> Rua Exemplo, 123, Lisboa, Portugal</p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Tem também o direito de apresentar uma reclamação à Comissão Nacional de Proteção de Dados (CNPD) se considerar que o tratamento dos seus dados pessoais viola a legislação aplicável.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
