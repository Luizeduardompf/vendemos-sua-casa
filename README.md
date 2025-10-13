# 🏠 Vendemos Sua Casa

Portal completo para angariação e venda de imóveis, conectando proprietários, agentes imobiliários e imobiliárias em uma plataforma moderna e eficiente.

## 🎯 **Visão Geral**

Sistema completo de gestão imobiliária que facilita a conexão entre proprietários que desejam vender seus imóveis e profissionais do setor imobiliário, oferecendo ferramentas avançadas para gestão, agendamentos, propostas e formalização de vendas.

## ✨ **Funcionalidades Implementadas**

### 🔐 **Sistema de Autenticação Completo**
- **Login/Registro** com validação robusta
- **Login Social** (Google, Facebook, LinkedIn)
- **Recuperação de senha** com email
- **Confirmação de email** automática
- **Tipos de usuário**: Proprietário, Agente, Imobiliária
- **Validação de dados** (NIF, email, telefone)

### 🏠 **Dashboard Responsivo**
- **Interface moderna** com design mobile-first
- **Sidebar colapsível** com navegação intuitiva
- **Notificações** em tempo real
- **Temas personalizáveis** (5 cores disponíveis)
- **Modo escuro/claro** dinâmico
- **Configurações de usuário** personalizáveis

### 👤 **Gestão de Dados Pessoais**
- **Páginas "Meus Dados"** para cada tipo de usuário
- **Edição de perfil** com validação
- **Campos específicos** por tipo de usuário
- **Validação de NIF** (Portugal)
- **Gestão de AMI** para agentes e imobiliárias

### ⚙️ **Sistema de Configurações Avançado**
- **Temas de cor** (Azul, Verde, Roxo, Laranja, Vermelho)
- **Tamanhos de fonte** (Pequeno, Médio, Grande)
- **Modo compacto** para máxima produtividade
- **Animações** (habilitar/desabilitar)
- **Notificações sonoras** e vibração
- **Persistência** no banco de dados

### 🏘️ **Cadastro de Imóveis**
- **Formulário completo** com validação
- **Tipos de imóvel** (Apartamento, Casa, Moradia, Villa, etc.)
- **Características detalhadas** (quartos, casas de banho, área)
- **Localização** com validação
- **Estado do imóvel** (Excelente, Bom, Razoável, Precisa obras)
- **Interface responsiva** e intuitiva

### 🎨 **Design System Moderno**
- **shadcn/ui** para componentes consistentes
- **Tailwind CSS** para estilização
- **Design mobile-first** otimizado
- **Temas dinâmicos** com CSS variables
- **Componentes reutilizáveis**
- **Acessibilidade** implementada

## 🛠️ **Stack Tecnológica**

### **Frontend**
- **Next.js 15** com App Router
- **React 19** com Server Components
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes

### **Backend**
- **Supabase** (PostgreSQL + Auth + Real-time)
- **APIs RESTful** personalizadas
- **Row Level Security (RLS)**
- **Autenticação JWT**

### **Ferramentas**
- **Docker** para containerização
- **Vercel** para deploy
- **ESLint + Prettier** para qualidade
- **Turbopack** para dev rápido

## 🚀 **Instalação e Configuração**

### **1. Pré-requisitos**
```bash
# Node.js 18+ e npm
node --version
npm --version

# Git
git --version
```

### **2. Clone e Instalação**
```bash
# Clone o repositório
git clone https://github.com/Luizeduardompf/vendemos-sua-casa.git
cd vendemos-sua-casa

# Instale as dependências
npm install
```

### **3. Configuração do Supabase**
```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Configure suas variáveis no .env.local
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **4. Configuração do Banco de Dados**
Execute os scripts SQL na seguinte ordem no Supabase SQL Editor:

```bash
# 1. Setup principal
database/sql/setup/supabase_complete_setup.sql

# 2. Schema da tabela users
database/sql/setup/supabase_users_schema.sql

# 3. Integração com login social
database/sql/setup/social_login_integration.sql

# 4. Configurações de autenticação
database/sql/config/supabase_auth_config.sql

# 5. Políticas RLS
database/sql/config/rls_policies_corrected.sql

# 6. Configurações de usuário
database/sql/settings/create_user_settings_complete.sql

# 7. Correção RLS para user_settings
database/sql/settings/fix_user_settings_rls.sql
```

**Ou use o script principal:**
```bash
database/sql/EXECUTAR_NO_SUPABASE.sql
```

### **5. Executar o Projeto**
```bash
# Modo desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

## 📁 **Estrutura do Projeto**

```
vendemos-sua-casa/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 auth/              # Páginas de autenticação
│   │   ├── 📁 dashboard/         # Dashboard por tipo de usuário
│   │   ├── 📁 api/               # APIs RESTful
│   │   └── 📄 layout.tsx         # Layout principal
│   ├── 📁 components/            # Componentes React
│   │   ├── 📁 ui/                # shadcn/ui components
│   │   ├── 📁 auth/              # Componentes de auth
│   │   └── 📁 dashboard/         # Componentes do dashboard
│   ├── 📁 lib/                   # Utilitários e configurações
│   └── 📁 hooks/                 # Custom React hooks
├── 📁 database/                  # Scripts SQL organizados
│   ├── 📁 sql/
│   │   ├── 📁 setup/            # Scripts de configuração
│   │   ├── 📁 config/           # Configurações do banco
│   │   ├── 📁 settings/         # Configurações de usuário
│   │   └── 📁 development/      # Scripts para desenvolvimento
│   └── 📄 README.md             # Documentação do banco
├── 📁 scripts/                   # Scripts de automação
│   ├── 📄 git-setup.sh          # Configuração Git
│   ├── 📄 run-sql.sh            # Executor de SQLs
│   └── 📄 cleanup-*.sh          # Scripts de limpeza
├── 📁 public/                    # Arquivos estáticos
└── 📄 *.md                       # Documentação
```

## 🔧 **Scripts de Automação**

### **Configuração Git**
```bash
# Configurar Git com boas práticas
./scripts/git-setup.sh
```

### **Executar SQLs**
```bash
# Menu interativo para executar SQLs
./scripts/run-sql.sh
```

### **Limpeza**
```bash
# Limpar arquivos temporários
./scripts/cleanup-temp-files.sh

# Limpar arquivos SQL desnecessários
./scripts/cleanup-sql-files.sh
```

## 🎨 **Personalização e Temas**

### **Cores Disponíveis**
- 🔵 **Azul** (padrão)
- 🟢 **Verde**
- 🟣 **Roxo**
- 🟠 **Laranja**
- 🔴 **Vermelho**

### **Tamanhos de Fonte**
- **Pequeno**: 12px (muito compacto)
- **Médio**: 14px (padrão)
- **Grande**: 16px (acessibilidade)

### **Modo Compacto**
- **Espaçamentos reduzidos** para máxima produtividade
- **Elementos menores** para telas pequenas
- **Otimizado para mobile**

## 🚀 **Deploy**

### **Vercel (Recomendado)**
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch `main`

### **Docker**
```bash
# Build da imagem
docker build -t vendemos-sua-casa .

# Executar container
docker run -p 3000:3000 vendemos-sua-casa
```

## 📊 **APIs Disponíveis**

### **Autenticação**
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Perfil do usuário
- `POST /api/auth/forgot-password` - Recuperação de senha

### **Configurações**
- `GET /api/user/settings/bypass` - Buscar configurações
- `PUT /api/user/settings/bypass` - Atualizar configurações
- `POST /api/user/settings/reset` - Resetar configurações

## 🔒 **Segurança**

- **Row Level Security (RLS)** no Supabase
- **Validação de dados** com Zod
- **Autenticação JWT** segura
- **Headers de segurança** configurados
- **Validação de NIF** (Portugal)

## 📱 **Responsividade**

- **Mobile-first** design
- **Breakpoints** otimizados
- **Touch-friendly** interfaces
- **Performance** otimizada

## 🧪 **Testes**

```bash
# Executar testes
npm test

# Build de produção
npm run build

# Lint e formatação
npm run lint
```

## 📚 **Documentação**

Toda a documentação técnica está organizada na pasta [`docs/`](docs/):

- **[Índice da Documentação](docs/README.md)** - Navegação completa
- **[Guia de Boas Práticas Git](docs/GIT_BEST_PRACTICES.md)**
- **[Setup Git Rápido](docs/SETUP_GIT.md)**
- **[Guia de Testes](docs/GUIA_TESTE.md)**
- **[Documentação das APIs](docs/API_CONFIGURACOES.md)**
- **[Changelog](docs/CHANGELOG.md)** - Histórico de versões
- **[Guia de Releases](docs/RELEASE_GUIDE.md)**

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 **Suporte**

- **Issues**: [GitHub Issues](https://github.com/Luizeduardompf/vendemos-sua-casa/issues)
- **Documentação**: Consulte os arquivos `.md` no projeto
- **Email**: [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ para revolucionar o mercado imobiliário português**