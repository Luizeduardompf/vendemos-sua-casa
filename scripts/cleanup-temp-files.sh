#!/bin/bash

# 🧹 Script de Limpeza - Vendemos Sua Casa
# Remove arquivos temporários e de teste do repositório

echo "🧹 Limpando arquivos temporários..."

# Arquivos de teste que podem ser removidos
echo "📁 Removendo arquivos de teste temporários..."
rm -f test_*.js
rm -f test_*.sql
rm -f debug_*.js
rm -f check_*.js
rm -f create_*.js
rm -f *_test.js
rm -f *_temp.sql
rm -f *_backup.sql
rm -f *_old.sql

# Arquivos de configuração temporários
echo "⚙️ Removendo arquivos de configuração temporários..."
rm -f config.local.js
rm -f config.local.json

# Arquivos de cache
echo "🗑️ Removendo arquivos de cache..."
rm -rf .cache/
rm -rf .temp/
rm -rf .tmp/

# Arquivos de backup
echo "💾 Removendo arquivos de backup..."
rm -f *.bak
rm -f *.backup
rm -f *.old

# Logs
echo "📝 Removendo logs..."
rm -f *.log
rm -rf logs/

# Arquivos do sistema
echo "🖥️ Removendo arquivos do sistema..."
rm -f .DS_Store
rm -f Thumbs.db
rm -f ehthumbs.db

# Arquivos de IDE
echo "💻 Removendo arquivos de IDE..."
rm -f *.swp
rm -f *.swo
rm -f *~

# Verificar se há arquivos sensíveis
echo "🔍 Verificando arquivos sensíveis..."
if find . -name "*.env" -not -name ".env.example" | grep -q .; then
    echo "⚠️  AVISO: Arquivos .env encontrados!"
    find . -name "*.env" -not -name ".env.example"
fi

if find . -name "*.key" | grep -q .; then
    echo "⚠️  AVISO: Arquivos .key encontrados!"
    find . -name "*.key"
fi

if find . -name "*.pem" | grep -q .; then
    echo "⚠️  AVISO: Arquivos .pem encontrados!"
    find . -name "*.pem"
fi

echo "✅ Limpeza concluída!"
echo ""
echo "📋 Arquivos que foram removidos:"
echo "- Arquivos de teste temporários"
echo "- Arquivos de debug"
echo "- Arquivos de cache"
echo "- Arquivos de backup"
echo "- Logs"
echo "- Arquivos do sistema"
echo ""
echo "🔒 Verifique se não há arquivos sensíveis antes de fazer commit!"
