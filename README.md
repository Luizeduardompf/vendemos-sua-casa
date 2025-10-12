# VENDEMOSSUACASA.PT 🏠

Portal/Aplicativo focado na angariação de propriedades, servindo como ponte entre proprietários (pessoas singulares e construtores) e agentes vendedores. Sistema completo para gestão de imóveis, agendamentos, propostas e formalização de vendas.

## 🎯 **Funcionalidades Principais**

### **Para Proprietários:**
- **Cadastro de Imóveis**: Sistema completo para angariação e cadastro de propriedades
- **Estudo de Mercado**: Análise automática com indicação de valor baseada no tempo de venda
- **Gestão de Documentação**: Armazenamento seguro de todos os documentos necessários
- **Agendamento de Visitas**: Sistema de marcação com aprovação do proprietário
- **Relatórios Detalhados**: Acompanhamento de divulgação e visitas realizadas
- **Gestão de Propostas**: Recebimento e análise de propostas de compra
- **Processo CPCV**: Geração automática de contratos de promessa de compra e venda

### **Para Agentes Imobiliários:**
- **Acesso a Imóveis**: Catálogo completo de propriedades disponíveis
- **Sistema de Agendamento**: Marcação de visitas com clientes qualificados
- **Material de Divulgação**: Brochuras e formulários de avaliação
- **Gestão de Propostas**: Criação e acompanhamento de propostas
- **Sistema de Comissões**: Acompanhamento de comissões de até 70%
- **Leads Distribuídos**: Recebimento automático de leads qualificados

### **Sistema de Comissões:**
- **Imóveis Particulares**: 5% (+IVA) - 30% VENDEMOSSUACASA.PT / 70% Agente
- **Empreendimentos**: 3% (+IVA) - 30% VENDEMOSSUACASA.PT / 70% Agente/Construtor
- **Venda Direta**: 1,5% do valor do imóvel

## ✨ Features Atuais

- **Next.js 15 App Router**: Server Components, TypeScript, Turbopack para dev rápido
- **Supabase Integration**: PostgreSQL cloud, autenticação SSR, queries assíncronas
- **UI Moderna**: Tailwind CSS + shadcn/ui (Button, Card, Drawer, NavigationMenu)
- **Sistema de Temas**: Suporte a modo claro/escuro com next-themes
- **Performance**: Speed Insights do Vercel para monitoramento
- **Containerização**: Docker multi-estágio para dev/prod
- **Segurança**: Headers de segurança, middleware de autenticação

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, next-themes
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Docker, Vercel
- **Tools**: ESLint, Prettier, Turbopack

## 📋 Pré-requisitos

- **Docker Desktop** (Mac M4/ARM64)
- **Git** 
- **Conta Supabase** (gratuita em supabase.com)
- **Editor** (VSCode recomendado)

## 🚀 Configuração

### 1. Clone e Setup
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vendemos-sua-casa.git
cd vendemos-sua-casa

# Instale as dependências
npm install
```

### 2. Configure Supabase
```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Edite .env.local com suas credenciais do Supabase
# Obtenha as chaves em: https://supabase.com/dashboard
```

### 3. Configure o Banco de Dados no Supabase
```sql
-- Tabela de proprietários
CREATE TABLE proprietarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT,
  nif TEXT UNIQUE,
  morada TEXT,
  tipo_pessoa TEXT CHECK (tipo_pessoa IN ('singular', 'construtor')),
  contrato_assinado BOOLEAN DEFAULT FALSE,
  contrato_data TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de agências imobiliárias
CREATE TABLE agencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  nif TEXT UNIQUE,
  ami TEXT UNIQUE NOT NULL, -- Número AMI obrigatório
  morada TEXT,
  contrato_assinado BOOLEAN DEFAULT FALSE,
  contrato_data TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de agentes imobiliários
CREATE TABLE agentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  cc TEXT UNIQUE,
  agencia_id UUID REFERENCES agencias(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de imóveis
CREATE TABLE imoveis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(12,2) NOT NULL,
  tipo_imovel TEXT NOT NULL CHECK (tipo_imovel IN ('casa', 'apartamento', 'terreno', 'comercial', 'empreendimento')),
  quartos INTEGER,
  casas_banho INTEGER,
  area DECIMAL(8,2),
  morada TEXT NOT NULL,
  cidade TEXT NOT NULL,
  distrito TEXT NOT NULL,
  codigo_postal TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  fotos TEXT[],
  video_url TEXT,
  tour_3d_url TEXT,
  caracteristicas TEXT[],
  privacidade BOOLEAN DEFAULT FALSE, -- TRUE = não divulgar em portais
  status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido', 'cancelado')),
  proprietario_id UUID REFERENCES proprietarios(id) ON DELETE CASCADE,
  estudo_mercado JSONB, -- Dados do estudo de mercado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('caderneta_predial', 'certificado_energetico', 'licenca_utilizacao', 'certidao_permanente', 'cc_proprietario', 'planta', 'outros')),
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  cliente_nome TEXT NOT NULL,
  cliente_cc TEXT NOT NULL,
  data_visita TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceite', 'rejeitado', 'realizado', 'cancelado')),
  proprietario_resposta TIMESTAMPTZ,
  proprietario_observacoes TEXT,
  reagendamento_data1 TIMESTAMPTZ,
  reagendamento_data2 TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de avaliações de visitas
CREATE TABLE avaliacoes_visitas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agendamento_id UUID REFERENCES agendamentos(id) ON DELETE CASCADE,
  pontos_fortes TEXT,
  pontos_fracos TEXT,
  comentarios TEXT,
  avaliacao_geral INTEGER CHECK (avaliacao_geral >= 1 AND avaliacao_geral <= 5),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de propostas
CREATE TABLE propostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  valor_proposta DECIMAL(12,2) NOT NULL,
  condicoes TEXT,
  prazo_escritura INTEGER, -- dias
  financiamento BOOLEAN DEFAULT FALSE,
  valor_entrada DECIMAL(12,2),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceite', 'rejeitada', 'expirada')),
  documento_proposta TEXT, -- URL do documento assinado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de CPCV
CREATE TABLE cpcv (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposta_id UUID REFERENCES propostas(id) ON DELETE CASCADE,
  numero_cpcv TEXT UNIQUE,
  valor_sinal DECIMAL(12,2),
  data_assinatura TIMESTAMPTZ,
  data_escritura TIMESTAMPTZ,
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'assinado', 'executado', 'cancelado')),
  documento_cpcv TEXT, -- URL do documento
  advogada_aprovacao BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de comissões
CREATE TABLE comissoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  valor_imovel DECIMAL(12,2) NOT NULL,
  percentagem_comissao DECIMAL(5,2) NOT NULL, -- 5% ou 3%
  valor_comissao DECIMAL(12,2) NOT NULL,
  percentagem_agencia DECIMAL(5,2) NOT NULL, -- 70%
  valor_agencia DECIMAL(12,2) NOT NULL,
  percentagem_vendemos DECIMAL(5,2) NOT NULL, -- 30%
  valor_vendemos DECIMAL(12,2) NOT NULL,
  status_pagamento TEXT DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'parcial', 'pago')),
  data_pagamento_parcial TIMESTAMPTZ,
  data_pagamento_final TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de leads distribuídos
CREATE TABLE leads_distribuidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT,
  cliente_email TEXT,
  status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'aceite', 'rejeitado', 'convertido')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_imoveis_cidade ON imoveis(cidade);
CREATE INDEX idx_imoveis_preco ON imoveis(preco);
CREATE INDEX idx_imoveis_tipo ON imoveis(tipo_imovel);
CREATE INDEX idx_imoveis_status ON imoveis(status);
CREATE INDEX idx_agendamentos_data ON agendamentos(data_visita);
CREATE INDEX idx_propostas_status ON propostas(status);
CREATE INDEX idx_cpcv_status ON cpcv(status);
```

## 🏃‍♂️ Desenvolvimento

### Iniciar o projeto
```bash
# Limpar volumes antigos
docker-compose down -v

# Construir e iniciar
docker-compose up --build
```

Acesse: http://localhost:3000

### Hot Reload
- Edite arquivos em `src/` e veja as mudanças instantaneamente
- Turbopack para rebuilds rápidos (~1s)

### Comandos úteis
```bash
# Instalar componentes shadcn/ui
docker-compose exec vendemos-sua-casa npx shadcn@latest add button card drawer

# Lint e formatação
docker-compose exec vendemos-sua-casa npm run lint -- --fix

# Ver logs do container
docker-compose logs -f vendemos-sua-casa

# Entrar no container
docker-compose exec vendemos-sua-casa sh

# Parar containers
docker-compose down

# Ver status dos containers
docker-compose ps
```

## 🚀 Deploy

### Docker Production
```bash
# Modificar docker-compose.yml para target: runner
docker-compose down -v && docker-compose up --build
```

### Vercel
```bash
# Instalar Vercel CLI
docker-compose exec app npm install -g vercel

# Deploy
vercel --prod
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal com ThemeProvider
│   ├── page.tsx           # Página inicial com query Supabase
│   └── globals.css        # Estilos Tailwind
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── providers/         # ThemeProvider
│   └── insights/          # Speed Insights
├── lib/
│   ├── supabase.ts        # Clientes Supabase (browser/server)
│   └── utils.ts           # Utilitários (cn helper)
└── middleware.ts          # Middleware de autenticação
```

## 🔧 Troubleshooting

### Problemas Comuns
- **Next.js 15 Cookies**: Use `await cookies()` em server components
- **Hot-reload não funciona**: Verifique volumes Docker
- **Erro Supabase**: Confirme variáveis de ambiente em `.env.local`
- **Build lento**: Use `docker builder prune -f` para limpar cache

## 📚 Referências

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase + Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Docker + Next.js](https://nextjs.org/docs/app/building-your-application/deploying#docker-image)

## 📄 Licença

MIT License - Template base para desenvolvimento rápido

