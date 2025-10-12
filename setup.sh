#!/bin/bash

# Script de configuração inicial para VendemosSuaCasa
echo "🏠 Configurando VendemosSuaCasa..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker Desktop primeiro."
    exit 1
fi

# Verificar se Docker Compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp env.example .env.local
    echo "✅ Arquivo .env.local criado. Configure suas variáveis de ambiente do Supabase."
else
    echo "✅ Arquivo .env.local já existe."
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Construir e iniciar containers
echo "🐳 Construindo e iniciando containers Docker..."
docker-compose down -v
docker-compose up --build -d

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure suas credenciais do Supabase em .env.local"
echo "2. Execute o SQL de configuração do banco no Supabase Dashboard"
echo "3. Acesse http://localhost:3000"
echo ""
echo "🔧 Comandos úteis:"
echo "- Ver logs: docker-compose logs -f"
echo "- Parar: docker-compose down"
echo "- Reiniciar: docker-compose up --build"
echo ""
echo "📚 Documentação completa em README.md"
