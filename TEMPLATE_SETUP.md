# 🚀 Setup Rápido do Template

## ⚡ Início Rápido (5 minutos)

### 1. Clone e Configure
```bash
# Clone o template
git clone https://github.com/seu-usuario/nextjs-supabase-template.git meu-projeto
cd meu-projeto

# Atualize o nome do projeto
npm pkg set name="meu-projeto"

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

### 2. Configure Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie as credenciais para `.env.local`
4. Execute o SQL de exemplo no editor SQL do Supabase:

```sql
-- Tabela de exemplo
CREATE TABLE users_test (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dados de teste
INSERT INTO users_test (name, email) VALUES 
  ('João Silva', 'joao@exemplo.com'),
  ('Maria Santos', 'maria@exemplo.com');
```

### 3. Inicie o Desenvolvimento
```bash
# Com Docker (recomendado)
docker-compose down && docker-compose up --build

# Ou sem Docker
npm install
npm run dev
```

Acesse: http://localhost:3000

## 🎯 Próximos Passos

1. **Personalize** a página inicial em `src/app/page.tsx`
2. **Adicione** suas páginas em `src/app/`
3. **Configure** autenticação se necessário
4. **Adicione** suas tabelas no Supabase
5. **Deploy** quando estiver pronto!

## 📚 Comandos Úteis

```bash
# Adicionar componentes shadcn/ui
npx shadcn@latest add button card input

# Lint e formatação
npm run lint -- --fix

# Build de produção
npm run build

# Deploy Vercel
vercel --prod
```

## 🛠️ Stack Incluída

- ✅ Next.js 15 + React 19
- ✅ TypeScript
- ✅ Supabase (PostgreSQL + Auth)
- ✅ Tailwind CSS + shadcn/ui
- ✅ Docker (dev/prod)
- ✅ ESLint + Prettier
- ✅ Speed Insights (Vercel)

## 🆘 Problemas Comuns

- **Erro Supabase**: Verifique `.env.local`
- **Hot reload não funciona**: `docker-compose down -v && docker-compose up --build`
- **Erro de permissão**: `sudo chown -R $USER:$USER .`
