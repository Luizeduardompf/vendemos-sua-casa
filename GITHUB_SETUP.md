# Configuração do Repositório GitHub

## Passos para criar o repositório no GitHub:

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `vendemos-sua-casa`
4. Descrição: `Plataforma completa para venda de imóveis`
5. Deixe como **público** ou **privado** (sua escolha)
6. **NÃO** marque "Initialize with README" (já temos um)
7. Clique em "Create repository"

### 2. Conectar repositório local ao GitHub
```bash
# Adicionar remote origin (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/vendemos-sua-casa.git

# Renomear branch principal para main (se necessário)
git branch -M main

# Fazer push inicial
git push -u origin main
```

### 3. Verificar configuração
```bash
# Verificar remotes
git remote -v

# Verificar status
git status
```

## Próximos passos após criar o repositório:

1. **Configure o Supabase:**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Copie as credenciais para `.env.local`
   - Execute o SQL do README.md no Supabase Dashboard

2. **Execute o setup:**
   ```bash
   ./setup.sh
   ```

3. **Acesse a aplicação:**
   - http://localhost:3000

## Estrutura do projeto configurada:
- ✅ Next.js 15 com App Router
- ✅ Supabase para banco de dados
- ✅ Tailwind CSS + shadcn/ui
- ✅ Docker para desenvolvimento
- ✅ Sistema de autenticação
- ✅ Estrutura de banco para imóveis
- ✅ Script de setup automatizado
