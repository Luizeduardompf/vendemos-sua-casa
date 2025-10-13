# 🔧 Corrigir Colunas de Perfil - Vendemos Sua Casa

## 🚨 **PROBLEMA IDENTIFICADO:**
As colunas necessárias para armazenar dados do Google não existem na tabela `users`.

## ✅ **SOLUÇÃO:**

### **Passo 1: Adicionar Colunas**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Execute o script `add-missing-columns.sql`:

```sql
-- Adicionar colunas de perfil do Google à tabela users
ALTER TABLE users 
ADD COLUMN foto_perfil TEXT,
ADD COLUMN primeiro_nome TEXT,
ADD COLUMN ultimo_nome TEXT,
ADD COLUMN nome_exibicao TEXT,
ADD COLUMN provedor TEXT,
ADD COLUMN provedor_id TEXT,
ADD COLUMN localizacao TEXT,
ADD COLUMN email_verificado BOOLEAN DEFAULT false,
ADD COLUMN dados_sociais JSONB;
```

### **Passo 2: Atualizar Usuário Existente**
1. No mesmo **SQL Editor**
2. Execute o script `update-user-profile.sql`:

```sql
-- Atualizar usuário existente com dados de perfil
UPDATE users 
SET 
  foto_perfil = 'https://lh3.googleusercontent.com/a/ACg8ocK...',
  primeiro_nome = 'Luiz Eduardo',
  ultimo_nome = 'de Menescal Pinto Filho',
  nome_exibicao = 'Luiz Eduardo de Menescal Pinto Filho',
  provedor = 'google',
  provedor_id = '1234567890',
  localizacao = 'pt-BR',
  email_verificado = true,
  dados_sociais = '{
    "google_id": "1234567890",
    "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK...",
    "locale": "pt-BR",
    "verified_email": true,
    "raw_data": {
      "full_name": "Luiz Eduardo de Menescal Pinto Filho",
      "given_name": "Luiz Eduardo",
      "family_name": "de Menescal Pinto Filho",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocK...",
      "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK...",
      "locale": "pt-BR",
      "email_verified": true,
      "sub": "1234567890"
    }
  }'::jsonb
WHERE email = 'luizeduardompf@gmail.com';
```

### **Passo 3: Verificar**
Após executar os scripts, teste:
1. Acesse: http://localhost:3000/dashboard/proprietario/meus-dados
2. Deve aparecer a foto e os dados do perfil

## 📊 **COLUNAS ADICIONADAS:**
- `foto_perfil`: URL da foto do Google
- `primeiro_nome`: Primeiro nome
- `ultimo_nome`: Último nome  
- `nome_exibicao`: Nome completo de exibição
- `provedor`: Provedor de autenticação (google, facebook, etc.)
- `provedor_id`: ID do usuário no provedor
- `localizacao`: Idioma/região
- `email_verificado`: Status de verificação
- `dados_sociais`: Dados completos em JSON

## 🎯 **RESULTADO ESPERADO:**
Após executar os scripts, o sistema deve:
- ✅ Mostrar foto no sidebar do dashboard
- ✅ Exibir dados completos em "Meus Dados"
- ✅ Capturar automaticamente dados do Google no futuro
