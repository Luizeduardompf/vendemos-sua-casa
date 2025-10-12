import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Termos de Uso - Vendemos Sua Casa
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Ao aceder e utilizar o portal Vendemos Sua Casa, concorda em cumprir e estar vinculado aos seguintes termos e condições de utilização. Se não concordar com qualquer parte destes termos, não deve utilizar o nosso serviço.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  O Vendemos Sua Casa é uma plataforma digital que conecta proprietários de imóveis, compradores interessados e agentes imobiliários, facilitando o processo de venda de propriedades através de:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Cadastro e divulgação de imóveis</li>
                  <li>Sistema de agendamento de visitas</li>
                  <li>Gestão de propostas de compra</li>
                  <li>Processo de CPCV (Contrato Promessa de Compra e Venda)</li>
                  <li>Sistema de comissões para agentes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Usuários e Responsabilidades</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Proprietários</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
                  <li>Devem fornecer informações verdadeiras e atualizadas sobre os imóveis</li>
                  <li>São responsáveis pela veracidade dos documentos apresentados</li>
                  <li>Devem manter a disponibilidade para agendamentos de visitas</li>
                  <li>Comprometem-se a responder a propostas dentro do prazo estabelecido</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Agentes Imobiliários</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
                  <li>Devem possuir licença AMI (Agente de Mediação Imobiliária) válida</li>
                  <li>Comprometem-se a agir com ética e profissionalismo</li>
                  <li>São responsáveis pela veracidade das informações dos clientes</li>
                  <li>Devem cumprir os prazos estabelecidos para documentação</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Compradores</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Devem fornecer informações verdadeiras para agendamentos</li>
                  <li>Comprometem-se a comparecer nos agendamentos marcados</li>
                  <li>São responsáveis pela veracidade das propostas apresentadas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Sistema de Comissões</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  O VENDEMOSSUACASA.PT opera com o seguinte sistema de comissões:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Imóveis Particulares:</strong> 5% do valor da venda</li>
                  <li><strong>Empreendimentos:</strong> 3% do valor da venda</li>
                  <li><strong>Distribuição:</strong> 70% para o agente, 30% para a plataforma</li>
                  <li>As comissões são calculadas sobre o valor final da transação</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacidade e Proteção de Dados</h2>
                <p className="text-gray-700 leading-relaxed">
                  O tratamento dos seus dados pessoais é regido pela nossa Política de Privacidade, que faz parte integrante destes Termos de Uso. Utilizamos os seus dados exclusivamente para a prestação do serviço e cumprimento das obrigações legais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitações de Responsabilidade</h2>
                <p className="text-gray-700 leading-relaxed">
                  O VENDEMOSSUACASA.PT atua como intermediário na conexão entre as partes. Não nos responsabilizamos por:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                  <li>Veracidade das informações fornecidas pelos usuários</li>
                  <li>Qualidade ou estado dos imóveis anunciados</li>
                  <li>Transações realizadas entre as partes</li>
                  <li>Problemas legais ou documentais dos imóveis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modificações dos Termos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no portal. O uso continuado do serviço após as modificações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Rescisão</h2>
                <p className="text-gray-700 leading-relaxed">
                  Qualquer das partes pode rescindir o uso do serviço a qualquer momento. A rescisão não afeta os direitos e obrigações já adquiridos pelas partes antes da rescisão.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Lei Aplicável</h2>
                <p className="text-gray-700 leading-relaxed">
                  Estes termos são regidos pela lei portuguesa. Qualquer disputa será resolvida pelos tribunais competentes de Portugal.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contacto</h2>
                <p className="text-gray-700 leading-relaxed">
                  Para questões relacionadas com estes Termos de Uso, contacte-nos através de:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <p className="text-gray-700"><strong>Email:</strong> legal@vendemossuacasa.pt</p>
                  <p className="text-gray-700"><strong>Telefone:</strong> +351 123 456 789</p>
                  <p className="text-gray-700"><strong>Morada:</strong> Rua Exemplo, 123, Lisboa, Portugal</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
