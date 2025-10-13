# 🚀 Setup Rápido Git - Vendemos Sua Casa

## ⚡ Configuração Automática

Execute o script de setup para configurar automaticamente:

```bash
# Executar script de configuração
./scripts/git-setup.sh
```

## 📋 Configuração Manual

### 1. Configurar Branch Padrão
```bash
git config --local init.defaultBranch main
```

### 2. Configurar Usuário
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### 3. Configurar Aliases Úteis
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --decorate --all"
```

### 4. Criar Branches Principais
```bash
git checkout -b main
git checkout -b develop
git checkout -b staging
git checkout develop
```

## 🔄 Fluxo de Trabalho Básico

### Nova Feature
```bash
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer mudanças e commits
git add .
git commit -m "feat(componente): adicionar nova funcionalidade"

# 3. Push da branch
git push origin feature/nova-funcionalidade

# 4. Criar Pull Request no GitHub
```

### Commit Inicial
```bash
# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat(init): configuração inicial do projeto Vendemos Sua Casa"

# Configurar remote (se ainda não configurado)
git remote add origin https://github.com/seu-usuario/vendemos-sua-casa.git

# Push inicial
git push -u origin develop
```

## 📁 Estrutura de Branches

```
main (produção)
├── develop (desenvolvimento)
│   ├── feature/authentication
│   ├── feature/dashboard
│   └── feature/mobile-optimization
└── staging (testes)
```

## 🏷️ Convenção de Commits

### Formato
```
tipo(escopo): descrição

Exemplos:
feat(auth): adicionar login social
fix(dashboard): corrigir layout mobile
docs(api): atualizar documentação
refactor(ui): padronizar componentes
```

### Tipos
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação
- **refactor**: Refatoração
- **test**: Testes
- **chore**: Tarefas de build

## 🔒 Segurança

### Arquivos Sensíveis
- ❌ NUNCA commitar `.env.local`
- ❌ NUNCA commitar chaves de API
- ❌ NUNCA commitar senhas
- ✅ Usar `.env.example` como template

### Verificação
```bash
# Verificar arquivos que serão commitados
git status

# Verificar diferenças
git diff --cached

# Verificar arquivos sensíveis
git diff --cached --name-only | grep -E "\.(env|key|pem)$"
```

## 🚀 Deploy

### Ambientes
- **Development**: `develop` branch
- **Staging**: `staging` branch  
- **Production**: `main` branch

### Release
```bash
# 1. Criar branch de release
git checkout -b release/v1.0.0

# 2. Fazer ajustes finais
git commit -m "chore(release): preparar versão 1.0.0"

# 3. Merge para main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 4. Merge de volta para develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

## 📚 Recursos

- [Guia Completo](GIT_BEST_PRACTICES.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Semantic Versioning](https://semver.org/)

## 🆘 Comandos de Emergência

### Desfazer Último Commit
```bash
git reset --soft HEAD~1
```

### Desfazer Mudanças Não Commitadas
```bash
git checkout -- arquivo.txt
git clean -fd
```

### Reverter Commit Específico
```bash
git revert <hash-do-commit>
```

### Ver Histórico
```bash
git log --oneline --graph --decorate --all
```
