# 📊 Análise dos Arquivos SQL - Vendemos Sua Casa

## 🟢 **ARQUIVOS ESSENCIAIS** (MANTER)

### Setup Inicial do Banco
- **`supabase_complete_setup.sql`** - Setup completo e final do banco
- **`supabase_users_schema.sql`** - Schema da tabela users
- **`social_login_integration.sql`** - Integração com login social

### Configurações de Usuário
- **`create_user_settings_complete.sql`** - Tabela de configurações do usuário (FINAL)

## 🟡 **ARQUIVOS DE CONFIGURAÇÃO** (MANTER PARA REFERÊNCIA)

### Configurações do Supabase
- **`supabase_auth_config.sql`** - Configurações de autenticação
- **`disable_rls_completely.sql`** - Para desenvolvimento (desabilitar RLS)

### RLS Policies
- **`rls_policies_corrected.sql`** - Políticas RLS corrigidas
- **`fix_user_settings_rls.sql`** - Correção específica para user_settings

## 🔴 **ARQUIVOS TEMPORÁRIOS** (PODEM SER REMOVIDOS)

### Arquivos de Debug/Teste
- `check_supabase_settings.sql`
- `check_user_status.sql`
- `check_users.sql`
- `confirm_user.sql`
- `confirm_user_direct.sql`
- `create_test_user.sql`

### Arquivos de Correção (já aplicados)
- `create_rpc_function.sql`
- `create_rpc_upsert_function.sql`
- `create_user_configuracoes_table.sql` (substituído por user_settings)
- `create_user_settings_table.sql` (versão anterior)
- `disable_email_confirmation.sql`
- `disable_rls_temporarily.sql`
- `disable_trigger.sql`
- `drop_existing_table.sql`
- `fix_rls_policies.sql`
- `fix_rls_policies_configuracoes.sql`
- `fix_rls_simple.sql`
- `fix_supabase_port_3000.sql`
- `fix_table_constraints.sql`
- `update_supabase_port.sql`

### Versões Antigas (substituídas)
- `supabase_final_setup.sql` (versão anterior)
- `supabase_fixed_setup.sql` (versão anterior)
- `supabase_reset_and_setup.sql` (versão anterior)

## 📋 **RECOMENDAÇÃO FINAL**

### Manter (8 arquivos):
1. `supabase_complete_setup.sql` - Setup principal
2. `supabase_users_schema.sql` - Schema users
3. `social_login_integration.sql` - Login social
4. `create_user_settings_complete.sql` - Configurações
5. `supabase_auth_config.sql` - Config auth
6. `disable_rls_completely.sql` - Para dev
7. `rls_policies_corrected.sql` - RLS policies
8. `fix_user_settings_rls.sql` - RLS user_settings

### Remover (24 arquivos):
- Todos os arquivos de debug/teste
- Arquivos de correção já aplicados
- Versões antigas dos setups
