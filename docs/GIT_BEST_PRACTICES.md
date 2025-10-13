# 🚀 Guia de Boas Práticas Git - Vendemos Sua Casa

## 📋 Estrutura de Branches

### Branches Principais
- **`main`** - Código de produção estável
- **`develop`** - Código de desenvolvimento integrado
- **`staging`** - Código para testes em ambiente de staging

### Branches de Feature
- **`feature/nome-da-feature`** - Ex: `feature/user-authentication`
- **`feature/dashboard-setup`** - Ex: `feature/property-listing`
- **`feature/mobile-optimization`** - Ex: `feature/payment-integration`

### Branches de Hotfix
- **`hotfix/critical-bug-fix`** - Para correções urgentes em produção

## 🏷️ Convenção de Commits

### Formato
```
tipo(escopo): descrição breve

Descrição detalhada (opcional)

Closes #123
```

### Tipos de Commit
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação, espaços, etc.
- **refactor**: Refatoração de código
- **test**: Adição ou correção de testes
- **chore**: Tarefas de build, dependências, etc.

### Exemplos
```bash
feat(auth): adicionar login social com Google
fix(dashboard): corrigir layout responsivo no mobile
docs(api): atualizar documentação das APIs de configuração
refactor(ui): padronizar componentes do formulário
```

## 🔄 Fluxo de Trabalho (Git Flow)

### 1. Iniciando uma Nova Feature
```bash
# Mudar para develop
git checkout develop
git pull origin develop

# Criar branch da feature
git checkout -b feature/nova-funcionalidade

# Fazer commits
git add .
git commit -m "feat(componente): adicionar nova funcionalidade"

# Push da branch
git push origin feature/nova-funcionalidade
```

### 2. Finalizando uma Feature
```bash
# Fazer merge para develop
git checkout develop
git pull origin develop
git merge feature/nova-funcionalidade
git push origin develop

# Deletar branch local
git branch -d feature/nova-funcionalidade
```

### 3. Release para Produção
```bash
# Criar branch de release
git checkout -b release/v1.0.0

# Fazer ajustes finais
git commit -m "chore(release): preparar versão 1.0.0"

# Merge para main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Merge de volta para develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

## 📁 Organização de Arquivos

### Estrutura Recomendada
```
/
├── src/
│   ├── app/                 # Páginas Next.js
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Utilitários e configurações
│   └── hooks/               # Custom hooks
├── public/                  # Arquivos estáticos
├── docs/                    # Documentação
├── scripts/                 # Scripts de automação
└── tests/                   # Testes
```

### Arquivos que DEVEM ser versionados
- ✅ Código fonte
- ✅ Configurações do projeto
- ✅ Documentação
- ✅ Scripts de build/deploy

### Arquivos que NÃO devem ser versionados
- ❌ `node_modules/`
- ❌ `.env.local`
- ❌ `.next/`
- ❌ `dist/`
- ❌ Logs
- ❌ Arquivos temporários

## 🔒 Segurança e Privacidade

### Arquivos Sensíveis
```bash
# Adicionar ao .gitignore
.env.local
.env.production
.env.staging
*.key
*.pem
secrets/
```

### Chaves e Senhas
- ❌ NUNCA commitar chaves de API
- ❌ NUNCA commitar senhas
- ❌ NUNCA commitar tokens de acesso
- ✅ Usar variáveis de ambiente
- ✅ Usar arquivos de exemplo (.env.example)

## 🏷️ Versionamento Semântico (SemVer)

### Formato: MAJOR.MINOR.PATCH
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

### Exemplos
- `1.0.0` - Primeira versão estável
- `1.1.0` - Nova funcionalidade
- `1.1.1` - Correção de bug
- `2.0.0` - Mudança incompatível

## 📝 Pull Requests

### Template de PR
```markdown
## 📋 Descrição
Breve descrição das mudanças

## 🔄 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## ✅ Checklist
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Sem conflitos
- [ ] Responsivo testado

## 🧪 Como Testar
Passos para testar as mudanças

## 📸 Screenshots (se aplicável)
```

## 🚀 Deploy e Releases

### Ambientes
- **Development**: `develop` branch
- **Staging**: `staging` branch
- **Production**: `main` branch

### Tags de Release
```bash
# Criar tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Listar tags
git tag -l

# Deletar tag (se necessário)
git tag -d v1.0.0
git push origin --delete v1.0.0
```

## 🔧 Comandos Úteis

### Limpeza
```bash
# Limpar arquivos não rastreados
git clean -fd

# Resetar para commit anterior
git reset --hard HEAD~1

# Reverter commit específico
git revert <commit-hash>
```

### Informações
```bash
# Status detalhado
git status --porcelain

# Log com gráfico
git log --oneline --graph

# Diferenças
git diff HEAD~1

# Arquivos modificados
git diff --name-only
```

## 📚 Recursos Adicionais

- [Git Flow Cheat Sheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
