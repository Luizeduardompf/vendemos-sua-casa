# VENDEMOSSUACASA.PT - Requisitos do Projeto

## 1. Escopo do Projeto
O projeto tem como objetivo desenvolver e implementar um Portal/Aplicativo focado na angariação de propriedades, servindo como ponte entre o proprietário (pessoa singular ou grandes construtores) e o agente vendedor, com um banco de compradores para identificação de clientes em espera.

## 2. Objetivos
- Angariar e cadastrar imóveis de proprietários de forma simples e objetiva
- Disponibilizar os imóveis cadastrados para divulgação pelas imobiliárias parceiras
- Processo transparente para proprietário e agente final
- Tudo dentro de uma mesma plataforma: agendamentos, propostas, envio de documentações e formalização final

## 3. Público-Alvo
- **Proprietários de Imóveis** interessados em vender
- **Construtores**
- **Agentes Imobiliários** que trabalham com compradores

## 4. Sistema de Comissões

### Imóveis Particulares
- **Comissão Total**: 5% sobre o valor da venda (+IVA)
- **VENDEMOSSUACASA.PT**: 30%
- **Agente Imobiliário**: até 70%

### Empreendimentos de Construtoras
- **Comissão Total**: 3% sobre o valor do imóvel (+IVA)
- **VENDEMOSSUACASA.PT**: 30%
- **Agente/Construtor**: até 70%

### Venda Direta pelo Proprietário
- **Comissão**: 1,5% do valor do imóvel

## 5. Requisitos para Contratação

### Para Proprietários
- ✅ Assinatura do contrato
- ✅ Cancelamento de contratos ativos com outras imobiliárias
- ✅ Disponibilização de documentação completa:
  - Caderneta Predial
  - Certificado Energético
  - Licença de Utilização
  - Certidão Permanente
  - CC dos Proprietários
  - Planta do Imóvel ou Croqui com Medidas
- ✅ Disponibilização de datas/horários para visitas
- ✅ Cópia de chaves (imóveis devolutos)
- ✅ Autorização para proteção de dados e branqueamento de capitais
- ✅ Escolha de privacidade (divulgação em portais ou não)
- ✅ Pagamento: 50% na assinatura CPCV + 50% na escritura

### Para Agentes Imobiliários
- ✅ Agência com AMI válido
- ✅ Contrato assinado com VENDEMOSSUACASA.PT
- ✅ Cláusula de não angariação por outros agentes da mesma agência
- ✅ Taxa de 1,5% em caso de descumprimento

## 6. Serviços Disponibilizados

### Para Proprietários
- 📊 **Estudo de Mercado**: Análise ampla com indicação de valor
- 📅 **Agendamento de Visita**: Conhecimento do imóvel
- 📸 **Pacote de Fotos**:
  - Até €200.000: Fotos profissionais
  - Acima de €200.000: Fotos + vídeo + 3D
- 📋 **Tratamento de Documentação**: CPCV, Escritura, Direito de Preferência
- 🔧 **Indicação de Empresas**: Certificado energético
- 🔐 **Cadeados Codificados**: Casas devolutas
- 📱 **Divulgação**: Redes sociais, portais nacionais/internacionais

### Para Agentes Imobiliários
- 📁 **Material para Exportação**: Divulgação para cliente final
- 📊 **Relatórios de Visitas**: Acompanhamento de performance
- 💰 **Sistema de Comissões**: Acompanhamento de ganhos

## 7. Funcionalidades do Portal

### Sistema de Login
- 🔐 **Proprietários**: Acesso após contrato assinado
- 🏢 **Agências**: Acesso após contrato assinado

### Gestão de Imóveis
- 📝 **Cadastro Detalhado**: Informações completas dos imóveis
- 📄 **Armazenamento de Documentos**: Seguro e organizado
- 📊 **Estudo de Mercado Automático**: Envio automático ao proprietário

### Sistema de Agendamentos
- 📅 **Marcação de Visitas**: Agente registra nome e CC do cliente
- ⏰ **Aprovação do Proprietário**: Prazo de 24h para resposta
- 📱 **Notificações**: SMS para proprietário
- 📋 **Agenda Visual**: Datas bloqueadas, livres e agendadas
- 🔄 **Reagendamento**: 2 datas alternativas em caso de recusa

### Processo de Visitas
- 📄 **Formulário de Avaliação**: Preenchimento obrigatório em 24h
- 📊 **Relatórios Automáticos**: Envio ao proprietário
- 🚫 **Bloqueio por Atraso**: Sem reagendamento até regularização

### Sistema de Propostas
- 📋 **Formulário de Propostas**: Dados da propriedade pré-preenchidos
- ✍️ **Assinatura Obrigatória**: Cliente comprador
- 📊 **Status Público**: Número e status visíveis para todos
- 💰 **Valores Privados**: Apenas para agentes com propostas
- 📞 **Reuniões de Esclarecimento**: Zoom ou presencial

### Processo CPCV
- ⏰ **Prazo de 24h**: Preenchimento após proposta aceite
- 📄 **Geração Automática**: Baseado na proposta e dados do imóvel
- ⚖️ **Análise Jurídica**: Advogada prestadora de serviço
- ✍️ **Assinatura Digital/Presencial**: Com filmagem da leitura
- 📧 **Envio Automático**: Email para agente

### Processo de Escritura
- 📅 **Agendamento do Notário**
- 📋 **Direito de Preferência**
- 🏢 **Lei do Condomínio**
- ✍️ **Assinatura da Escritura**
- 💰 **Pagamento Restante**
- 💼 **Pagamento da Comissão**
- ✅ **Confirmação de Etapas**: Processo concluído

### Distribuição de Leads
- 🎯 **Promoção Automática**: Quando nenhum agente promove
- 📊 **Top 10 Agentes**: Mais imóveis partilhados
- ⚡ **Primeiro a Aceitar**: Fica com o lead
- 📱 **Notificação Imediata**: Para todos os 10 agentes

## 8. Tecnologias Utilizadas
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Docker, Vercel
- **Tools**: ESLint, Prettier, Turbopack

## 9. Estrutura do Banco de Dados
- **proprietarios**: Dados dos proprietários
- **agencias**: Agências imobiliárias com AMI
- **agentes**: Agentes vinculados às agências
- **imoveis**: Catálogo completo de propriedades
- **documentos**: Armazenamento de documentação
- **agendamentos**: Sistema de marcação de visitas
- **avaliacoes_visitas**: Relatórios de visitas
- **propostas**: Gestão de ofertas de compra
- **cpcv**: Contratos de promessa de compra e venda
- **comissoes**: Sistema de comissões
- **leads_distribuidos**: Distribuição automática de leads
