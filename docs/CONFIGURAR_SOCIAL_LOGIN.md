# 🔐 Configuração Social Login - Vendemos Sua Casa

Este guia explica como configurar corretamente o social login (Google, Facebook, LinkedIn) no Supabase.

## 🚨 **Problemas Identificados**

### **1. Social Login não funciona**
- ❌ Redirecionamento OAuth falha
- ❌ Callback não processa corretamente
- ❌ Usuário não é criado na tabela `users`

### **2. Confirmação de email não funciona**
- ❌ Email de confirmação não é enviado
- ❌ Link de confirmação não funciona
- ❌ Usuário fica pendente de verificação

## 🔧 **Soluções**

### **1. Configurar OAuth no Supabase Dashboard**

#### **Passo 1: Acessar Configurações de Auth**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: `xbsrabobcleosovskqaf`
3. Vá para **Authentication** → **Providers**

#### **Passo 2: Configurar Google OAuth**
1. Clique em **Google**
2. Ative o provider
3. Configure as URLs de redirecionamento:

```
Site URL: http://localhost:3000
Redirect URLs:
- http://localhost:3000/auth/callback
- https://seu-dominio.vercel.app/auth/callback
```

4. **IMPORTANTE**: Obtenha as credenciais OAuth do Google:
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto ou selecione um existente
   - Ative a Google+ API
   - Crie credenciais OAuth 2.0
   - Configure as URLs autorizadas:
     - `http://localhost:3000/auth/callback`
     - `https://seu-dominio.vercel.app/auth/callback`
   - Copie o **Client ID** e **Client Secret** para o Supabase

#### **Passo 3: Configurar Facebook OAuth**
1. Clique em **Facebook**
2. Ative o provider
3. Configure as URLs de redirecionamento:

```
Site URL: http://localhost:3000
Redirect URLs:
- http://localhost:3000/auth/callback
- https://seu-dominio.vercel.app/auth/callback
```

4. **IMPORTANTE**: Obtenha as credenciais OAuth do Facebook:
   - Acesse [Facebook Developers](https://developers.facebook.com/)
   - Crie um app ou selecione um existente
   - Adicione o produto "Facebook Login"
   - Configure as URLs válidas:
     - `http://localhost:3000/auth/callback`
     - `https://seu-dominio.vercel.app/auth/callback`
   - Copie o **App ID** e **App Secret** para o Supabase

#### **Passo 4: Configurar LinkedIn OAuth**
1. Clique em **LinkedIn**
2. Ative o provider
3. Configure as URLs de redirecionamento:

```
Site URL: http://localhost:3000
Redirect URLs:
- http://localhost:3000/auth/callback
- https://seu-dominio.vercel.app/auth/callback
```

4. **IMPORTANTE**: Obtenha as credenciais OAuth do LinkedIn:
   - Acesse [LinkedIn Developers](https://www.linkedin.com/developers/)
   - Crie um app ou selecione um existente
   - Configure as URLs de redirecionamento:
     - `http://localhost:3000/auth/callback`
     - `https://seu-dominio.vercel.app/auth/callback`
   - Copie o **Client ID** e **Client Secret** para o Supabase

### **2. Configurar Email**

#### **Passo 1: Configurar SMTP**
1. Vá para **Authentication** → **Settings**
2. Configure **SMTP Settings**:

```
SMTP Host: smtp.gmail.com (ou seu provedor)
SMTP Port: 587
SMTP User: seu-email@gmail.com
SMTP Pass: sua-senha-de-app
```

#### **Passo 2: Configurar Templates de Email**
1. Vá para **Authentication** → **Email Templates**
2. Configure os templates de confirmação e recuperação de senha

### **3. Executar Scripts SQL**

#### **Passo 1: Executar Script de Social Login**
```bash
# No terminal, execute:
node -e "
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Carregar variáveis de ambiente
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key] = valueParts.join('=');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Executar script SQL
const sqlContent = fs.readFileSync('database/sql/setup/social_login_integration_fixed.sql', 'utf8');
supabase.rpc('exec_sql', { sql: sqlContent }).then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro ao executar SQL:', error);
  } else {
    console.log('✅ SQL executado com sucesso');
  }
});
"
```

#### **Passo 2: Verificar Configuração**
```bash
# Testar conexão
curl -s http://localhost:3000/auth/login | grep -o "Google\|Facebook\|LinkedIn" | head -3
```

### **4. Testar Social Login**

#### **Passo 1: Testar no Navegador**
1. Acesse: http://localhost:3000/auth/login
2. Clique em "Continuar com Google"
3. Verifique se redireciona para o Google
4. Após autorizar, deve redirecionar para `/auth/callback`
5. Verifique se o usuário é criado na tabela `users`

#### **Passo 2: Verificar Logs**
```bash
# Monitorar logs do servidor
tail -f .next/server.log
```

#### **Passo 3: Verificar Banco de Dados**
```bash
# Verificar se usuário foi criado
node -e "
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key] = valueParts.join('=');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

supabase.from('users').select('*').then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro:', error);
  } else {
    console.log('✅ Usuários na tabela:', data.length);
    data.forEach(user => {
      console.log(`- ${user.email} (${user.user_type})`);
    });
  }
});
"
```

## 🎯 **Checklist de Configuração**

### **Google OAuth**
- [ ] Projeto criado no Google Cloud Console
- [ ] Google+ API ativada
- [ ] Credenciais OAuth 2.0 criadas
- [ ] URLs de redirecionamento configuradas
- [ ] Client ID e Secret configurados no Supabase

### **Facebook OAuth**
- [ ] App criado no Facebook Developers
- [ ] Facebook Login adicionado
- [ ] URLs válidas configuradas
- [ ] App ID e Secret configurados no Supabase

### **LinkedIn OAuth**
- [ ] App criado no LinkedIn Developers
- [ ] URLs de redirecionamento configuradas
- [ ] Client ID e Secret configurados no Supabase

### **Email**
- [ ] SMTP configurado no Supabase
- [ ] Templates de email configurados
- [ ] Teste de envio de email funcionando

### **Banco de Dados**
- [ ] Script SQL executado com sucesso
- [ ] Trigger `on_auth_user_created` criado
- [ ] Função `handle_new_user()` criada
- [ ] Tabela `users` atualizada

## 🚀 **Próximos Passos**

1. **Configurar OAuth** nos providers (Google, Facebook, LinkedIn)
2. **Executar scripts SQL** para integração
3. **Testar social login** no navegador
4. **Verificar criação de usuários** na tabela `users`
5. **Configurar email** para confirmação

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do servidor Next.js
3. Verifique a configuração no Supabase Dashboard
4. Teste a conexão com o banco de dados

---

**Status**: Aguardando configuração OAuth nos providers
**Última atualização**: $(date)
