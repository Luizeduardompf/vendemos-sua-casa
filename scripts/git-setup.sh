#!/bin/bash

# 🚀 Script de Setup Git - Vendemos Sua Casa
# Este script configura o repositório Git com as melhores práticas

echo "🚀 Configurando Git para Vendemos Sua Casa..."

# Verificar se estamos em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ Este diretório não é um repositório Git!"
    echo "Execute: git init"
    exit 1
fi

# Configurar branch padrão
echo "📋 Configurando branch padrão..."
git config --local init.defaultBranch main

# Configurar usuário (se não estiver configurado globalmente)
if [ -z "$(git config --global user.name)" ]; then
    echo "👤 Configurando usuário Git..."
    read -p "Digite seu nome: " username
    read -p "Digite seu email: " useremail
    git config --global user.name "$username"
    git config --global user.email "$useremail"
fi

# Configurar aliases úteis
echo "⚡ Configurando aliases Git..."
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.lga "log --oneline --graph --decorate --all --author"
git config --global alias.cleanup "!git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d"

# Configurar push padrão
git config --global push.default simple

# Configurar pull padrão
git config --global pull.rebase false

# Configurar merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Configurar diff tool
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# Configurar cores
git config --global color.ui auto
git config --global color.branch auto
git config --global color.diff auto
git config --global color.status auto

# Configurar autocrlf (para Windows)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    git config --global core.autocrlf true
else
    git config --global core.autocrlf input
fi

# Configurar line ending
git config --global core.eol lf

# Configurar ignore case
git config --global core.ignorecase false

# Configurar push upstream
git config --global push.autoSetupRemote true

# Configurar pull strategy
git config --global pull.ff only

# Configurar commit template
cat > .gitmessage << 'EOF'
# <tipo>(<escopo>): <descrição>

# <corpo da mensagem>

# <rodapé>

# Tipos: feat, fix, docs, style, refactor, test, chore
# Escopo: auth, dashboard, ui, api, etc.
# Exemplo: feat(auth): adicionar login social
EOF

git config --local commit.template .gitmessage

# Criar branches principais se não existirem
echo "🌿 Criando branches principais..."
if ! git show-ref --verify --quiet refs/heads/main; then
    git checkout -b main
fi

if ! git show-ref --verify --quiet refs/heads/develop; then
    git checkout -b develop
fi

if ! git show-ref --verify --quiet refs/heads/staging; then
    git checkout -b staging
fi

# Voltar para develop
git checkout develop

# Configurar hooks de pre-commit (opcional)
echo "🔧 Configurando hooks Git..."
mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook para verificar arquivos

echo "🔍 Executando verificações pre-commit..."

# Verificar se há arquivos de configuração sensíveis
if git diff --cached --name-only | grep -E "\.(env|key|pem)$"; then
    echo "❌ ERRO: Arquivos sensíveis detectados!"
    echo "Remova arquivos .env, .key, .pem do commit"
    exit 1
fi

# Verificar se há console.log no código
if git diff --cached --name-only | grep -E "\.(js|ts|tsx|jsx)$" | xargs grep -l "console\.log"; then
    echo "⚠️  AVISO: console.log encontrado no código"
    echo "Considere remover antes do commit"
fi

echo "✅ Pre-commit verificado com sucesso!"
EOF

chmod +x .git/hooks/pre-commit

# Configurar hook de commit-msg
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash
# Hook para validar mensagem de commit

commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ ERRO: Mensagem de commit inválida!"
    echo "Formato: tipo(escopo): descrição"
    echo "Tipos: feat, fix, docs, style, refactor, test, chore"
    echo "Exemplo: feat(auth): adicionar login social"
    exit 1
fi
EOF

chmod +x .git/hooks/commit-msg

# Criar arquivo de changelog
cat > CHANGELOG.md << 'EOF'
# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Adicionado
- Funcionalidades novas

### Alterado
- Mudanças em funcionalidades existentes

### Depreciado
- Funcionalidades que serão removidas

### Removido
- Funcionalidades removidas

### Corrigido
- Correções de bugs

### Segurança
- Vulnerabilidades corrigidas
EOF

# Criar arquivo de contribuição
cat > CONTRIBUTING.md << 'EOF'
# 🤝 Guia de Contribuição - Vendemos Sua Casa

## Como Contribuir

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/vendemos-sua-casa.git`
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Faça** suas mudanças
5. **Commit** com mensagem descritiva: `git commit -m "feat(componente): adicionar nova funcionalidade"`
6. **Push** para sua branch: `git push origin feature/nova-funcionalidade`
7. **Abra** um Pull Request

## Padrões de Código

- Use TypeScript
- Siga as convenções do ESLint
- Escreva testes para novas funcionalidades
- Documente mudanças importantes

## Processo de Review

- Todos os PRs precisam de aprovação
- Testes devem passar
- Código deve estar limpo e documentado
EOF

echo "✅ Configuração Git concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Adicione arquivos: git add ."
echo "2. Faça commit inicial: git commit -m 'feat(init): configuração inicial do projeto'"
echo "3. Configure remote: git remote add origin <url-do-repositorio>"
echo "4. Push inicial: git push -u origin develop"
echo ""
echo "🔧 Comandos úteis:"
echo "- git st (status)"
echo "- git co (checkout)"
echo "- git br (branch)"
echo "- git ci (commit)"
echo "- git lg (log com gráfico)"
echo ""
echo "📚 Consulte GIT_BEST_PRACTICES.md para mais informações"
