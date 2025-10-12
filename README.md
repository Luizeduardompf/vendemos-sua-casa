# VendemosSuaCasa 🏠

Plataforma completa para venda de imóveis construída com **Next.js 15**, **Supabase**, **Tailwind CSS** + **shadcn/ui** e **Docker**. Sistema moderno e escalável para conectar vendedores e compradores de imóveis.

## 🎯 **Funcionalidades Principais**

- **Catálogo de Imóveis**: Visualização completa de propriedades com fotos, descrições e localização
- **Sistema de Busca**: Filtros avançados por preço, localização, tipo de imóvel e características
- **Perfis de Usuários**: Cadastro e gerenciamento de vendedores e compradores
- **Chat Integrado**: Comunicação direta entre interessados
- **Dashboard Administrativo**: Gestão completa de imóveis e usuários
- **Sistema de Favoritos**: Lista personalizada de imóveis de interesse
- **Notificações**: Alertas sobre novos imóveis e mensagens

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
-- Tabela de usuários
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'realtor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de imóveis
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('casa', 'apartamento', 'terreno', 'comercial')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(8,2),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  images TEXT[],
  features TEXT[],
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'pending')),
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Tabela de mensagens
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
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
docker-compose exec app npx shadcn@latest add button card drawer

# Lint e formatação
docker-compose exec app npm run lint -- --fix

# Parar containers
docker-compose down
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

