# 🗄️ Database - Vendemos Sua Casa

Esta pasta contém todos os arquivos relacionados ao banco de dados do projeto.

## 📁 Estrutura de Pastas

```
database/
├── sql/                          # Arquivos SQL organizados
│   ├── setup/                    # Scripts de configuração inicial
│   │   ├── supabase_complete_setup.sql
│   │   ├── supabase_users_schema.sql
│   │   └── social_login_integration.sql
│   ├── config/                   # Configurações do banco
│   │   ├── supabase_auth_config.sql
│   │   └── rls_policies_corrected.sql
│   ├── settings/                 # Configurações de usuário
│   │   ├── create_user_settings_complete.sql
│   │   └── fix_user_settings_rls.sql
│   ├── development/              # Scripts para desenvolvimento
│   │   └── disable_rls_completely.sql
│   └── EXECUTAR_NO_SUPABASE.sql  # Script principal para execução
└── README.md                     # Este arquivo
```

## 🚀 Como Usar

### 1. Setup Inicial do Banco
Execute os scripts na seguinte ordem:

```bash
# 1. Setup principal
database/sql/setup/supabase_complete_setup.sql

# 2. Schema da tabela users
database/sql/setup/supabase_users_schema.sql

# 3. Integração com login social
database/sql/setup/social_login_integration.sql
```

### 2. Configurações
```bash
# Configurações de autenticação
database/sql/config/supabase_auth_config.sql

# Políticas RLS
database/sql/config/rls_policies_corrected.sql
```

### 3. Configurações de Usuário
```bash
# Tabela de configurações do usuário
database/sql/settings/create_user_settings_complete.sql

# Correção RLS para user_settings
database/sql/settings/fix_user_settings_rls.sql
```

### 4. Desenvolvimento
```bash
# Desabilitar RLS (apenas para desenvolvimento)
database/sql/development/disable_rls_completely.sql
```

## 📋 Script Principal

Para facilitar, use o script principal que executa tudo em ordem:

```bash
database/sql/EXECUTAR_NO_SUPABASE.sql
```

## ⚠️ Importante

- **NUNCA** execute scripts de desenvolvimento em produção
- **SEMPRE** faça backup antes de executar scripts
- **VERIFIQUE** as permissões RLS após execução
- **TESTE** em ambiente de desenvolvimento primeiro

## 🔧 Convenções

- Todos os arquivos SQL devem estar nesta pasta
- Use subpastas para organizar por categoria
- Nomeie arquivos de forma descritiva
- Documente mudanças importantes
- Mantenha scripts de desenvolvimento separados
