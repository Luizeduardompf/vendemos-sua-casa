#!/bin/bash

# 🚀 Script para Executar SQLs - Vendemos Sua Casa
# Facilita a execução dos scripts SQL organizados

echo "🚀 Executor de Scripts SQL - Vendemos Sua Casa"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar menu
show_menu() {
    echo -e "${BLUE}📋 Escolha uma opção:${NC}"
    echo ""
    echo "1. 🏗️  Setup Completo (Recomendado para primeira vez)"
    echo "2. 🔧 Setup Básico (Apenas tabelas principais)"
    echo "3. ⚙️  Configurações"
    echo "4. 👤 Configurações de Usuário"
    echo "5. 🛠️  Desenvolvimento (Desabilitar RLS)"
    echo "6. 📋 Listar todos os arquivos SQL"
    echo "7. ❌ Sair"
    echo ""
}

# Função para executar setup completo
run_complete_setup() {
    echo -e "${GREEN}🏗️ Executando Setup Completo...${NC}"
    echo ""
    echo "1. Executando setup principal..."
    echo "2. Executando schema users..."
    echo "3. Executando integração social login..."
    echo "4. Executando configurações de auth..."
    echo "5. Executando políticas RLS..."
    echo "6. Executando configurações de usuário..."
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Execute estes scripts no Supabase SQL Editor na ordem mostrada acima.${NC}"
    echo ""
    echo "Arquivos a executar:"
    echo "📄 database/sql/setup/supabase_complete_setup.sql"
    echo "📄 database/sql/setup/supabase_users_schema.sql"
    echo "📄 database/sql/setup/social_login_integration.sql"
    echo "📄 database/sql/config/supabase_auth_config.sql"
    echo "📄 database/sql/config/rls_policies_corrected.sql"
    echo "📄 database/sql/settings/create_user_settings_complete.sql"
    echo "📄 database/sql/settings/fix_user_settings_rls.sql"
}

# Função para executar setup básico
run_basic_setup() {
    echo -e "${GREEN}🔧 Executando Setup Básico...${NC}"
    echo ""
    echo "Arquivos essenciais:"
    echo "📄 database/sql/setup/supabase_complete_setup.sql"
    echo "📄 database/sql/setup/supabase_users_schema.sql"
    echo "📄 database/sql/setup/social_login_integration.sql"
}

# Função para executar configurações
run_config() {
    echo -e "${GREEN}⚙️ Executando Configurações...${NC}"
    echo ""
    echo "Arquivos de configuração:"
    echo "📄 database/sql/config/supabase_auth_config.sql"
    echo "📄 database/sql/config/rls_policies_corrected.sql"
}

# Função para executar configurações de usuário
run_user_settings() {
    echo -e "${GREEN}👤 Executando Configurações de Usuário...${NC}"
    echo ""
    echo "Arquivos de configurações de usuário:"
    echo "📄 database/sql/settings/create_user_settings_complete.sql"
    echo "📄 database/sql/settings/fix_user_settings_rls.sql"
}

# Função para desenvolvimento
run_development() {
    echo -e "${YELLOW}🛠️ Executando Scripts de Desenvolvimento...${NC}"
    echo ""
    echo -e "${RED}⚠️  ATENÇÃO: Estes scripts são apenas para desenvolvimento!${NC}"
    echo ""
    echo "Arquivos de desenvolvimento:"
    echo "📄 database/sql/development/disable_rls_completely.sql"
    echo ""
    echo -e "${YELLOW}Não execute em produção!${NC}"
}

# Função para listar arquivos
list_files() {
    echo -e "${BLUE}📋 Listando todos os arquivos SQL:${NC}"
    echo ""
    find database/sql -name "*.sql" -type f | sort | while read file; do
        echo "📄 $file"
    done
    echo ""
    echo "Total: $(find database/sql -name "*.sql" -type f | wc -l) arquivos"
}

# Loop principal
while true; do
    show_menu
    read -p "Digite sua opção (1-7): " choice
    
    case $choice in
        1)
            run_complete_setup
            ;;
        2)
            run_basic_setup
            ;;
        3)
            run_config
            ;;
        4)
            run_user_settings
            ;;
        5)
            run_development
            ;;
        6)
            list_files
            ;;
        7)
            echo -e "${GREEN}👋 Até logo!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opção inválida! Tente novamente.${NC}"
            ;;
    esac
    
    echo ""
    read -p "Pressione Enter para continuar..."
    clear
done
