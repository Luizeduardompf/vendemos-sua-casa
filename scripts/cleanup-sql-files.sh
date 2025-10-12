#!/bin/bash

# 🧹 Script de Limpeza de Arquivos SQL - Vendemos Sua Casa
# Remove arquivos SQL temporários e mantém apenas os essenciais

echo "🧹 Limpando arquivos SQL desnecessários..."

# Arquivos essenciais que DEVEM ser mantidos
ESSENTIAL_FILES=(
    "database/sql/setup/supabase_complete_setup.sql"
    "database/sql/setup/supabase_users_schema.sql"
    "database/sql/setup/social_login_integration.sql"
    "database/sql/settings/create_user_settings_complete.sql"
    "database/sql/config/supabase_auth_config.sql"
    "database/sql/development/disable_rls_completely.sql"
    "database/sql/config/rls_policies_corrected.sql"
    "database/sql/settings/fix_user_settings_rls.sql"
)

# Arquivos que podem ser removidos
FILES_TO_REMOVE=(
    # Debug/Teste
    "check_supabase_settings.sql"
    "check_user_status.sql"
    "check_users.sql"
    "confirm_user.sql"
    "confirm_user_direct.sql"
    "create_test_user.sql"
    
    # Correções já aplicadas
    "create_rpc_function.sql"
    "create_rpc_upsert_function.sql"
    "create_user_configuracoes_table.sql"
    "create_user_settings_table.sql"
    "disable_email_confirmation.sql"
    "disable_rls_temporarily.sql"
    "disable_trigger.sql"
    "drop_existing_table.sql"
    "fix_rls_policies.sql"
    "fix_rls_policies_configuracoes.sql"
    "fix_rls_simple.sql"
    "fix_supabase_port_3000.sql"
    "fix_table_constraints.sql"
    "update_supabase_port.sql"
    
    # Versões antigas
    "supabase_final_setup.sql"
    "supabase_fixed_setup.sql"
    "supabase_reset_and_setup.sql"
)

echo "📋 Arquivos essenciais que serão mantidos:"
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (não encontrado)"
    fi
done

echo ""
echo "🗑️ Arquivos que serão removidos:"
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        echo "🗑️ $file"
    fi
done

echo ""
read -p "🤔 Deseja continuar com a remoção? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removendo arquivos..."
    
    removed_count=0
    for file in "${FILES_TO_REMOVE[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
            echo "✅ Removido: $file"
            ((removed_count++))
        fi
    done
    
    echo ""
    echo "✅ Limpeza concluída!"
    echo "📊 Arquivos removidos: $removed_count"
    echo ""
    echo "📋 Arquivos SQL restantes:"
    ls -la *.sql 2>/dev/null | wc -l | xargs echo "Total:"
    ls -la *.sql 2>/dev/null || echo "Nenhum arquivo SQL encontrado"
    
else
    echo "❌ Operação cancelada pelo usuário"
fi
