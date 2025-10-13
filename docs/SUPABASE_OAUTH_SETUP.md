# 🔐 Configuração OAuth Supabase - Vendemos Sua Casa

Este guia explica como configurar corretamente o OAuth no Supabase para resolver os problemas de social login.

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
2. Selecione seu projeto
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
2. Configure o template de confirmação:

```html
<h2>Confirme seu email</h2>
<p>Clique no link abaixo para confirmar sua conta:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Email</a>
```

### **3. Executar Scripts SQL**

Execute os scripts na seguinte ordem no **SQL Editor**:

```sql
-- 1. Setup principal
-- Execute: database/sql/setup/supabase_complete_setup.sql

-- 2. Schema da tabela users
-- Execute: database/sql/setup/supabase_users_schema.sql

-- 3. Integração com login social
-- Execute: database/sql/setup/social_login_integration.sql

-- 4. Configurações de autenticação
-- Execute: database/sql/config/supabase_auth_config.sql

-- 5. Políticas RLS
-- Execute: database/sql/config/rls_policies_corrected.sql

-- 6. Configurações de usuário
-- Execute: database/sql/settings/create_user_settings_complete.sql
```

### **4. Verificar Configurações**

#### **Verificar URLs de Redirecionamento**
No Supabase Dashboard:
1. **Authentication** → **URL Configuration**
2. Verifique se está configurado:

```
Site URL: http://localhost:3000
Redirect URLs:
- http://localhost:3000/auth/callback
- http://localhost:3000/auth/confirm
```

#### **Verificar RLS Policies**
1. Vá para **Table Editor** → **users**
2. Verifique se as políticas RLS estão ativas
3. Teste com um usuário de teste

## 🧪 **Testando as Correções**

### **1. Teste de Social Login**
```bash
# 1. Iniciar o servidor
npm run dev

# 2. Acessar http://localhost:3000/auth/login
# 3. Clicar em "Continuar com Google"
# 4. Verificar logs no console do navegador
# 5. Verificar se redireciona para /auth/callback
# 6. Verificar se usuário é criado na tabela users
```

### **2. Teste de Confirmação de Email**
```bash
# 1. Acessar http://localhost:3000/auth/register
# 2. Preencher formulário com email válido
# 3. Verificar se email é enviado
# 4. Clicar no link de confirmação
# 5. Verificar se redireciona para /auth/confirm
# 6. Verificar se usuário é ativado
```

## 🔍 **Debugging**

### **Logs do Navegador**
Abra o **Developer Tools** (F12) e verifique:
1. **Console** - Erros JavaScript
2. **Network** - Requisições falhando
3. **Application** - Local Storage e Session Storage

### **Logs do Supabase**
1. Vá para **Logs** no Supabase Dashboard
2. Verifique erros de autenticação
3. Verifique erros de RLS

### **Comandos de Debug**
```bash
# Verificar configurações
node scripts/diagnose-auth.js

# Testar APIs
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## 📋 **Checklist de Verificação**

### **Configurações OAuth**
- [ ] Google OAuth configurado
- [ ] Facebook OAuth configurado
- [ ] LinkedIn OAuth configurado
- [ ] URLs de redirecionamento corretas
- [ ] Site URL configurado

### **Configurações de Email**
- [ ] SMTP configurado
- [ ] Template de confirmação configurado
- [ ] Email de teste enviado

### **Banco de Dados**
- [ ] Tabela `users` criada
- [ ] RLS policies ativas
- [ ] Triggers funcionando
- [ ] Scripts SQL executados

### **Aplicação**
- [ ] Variáveis de ambiente configuradas
- [ ] Callback funcionando
- [ ] Confirmação de email funcionando
- [ ] Social login funcionando

## 🚨 **Problemas Comuns**

### **"Invalid redirect URL"**
- Verifique se a URL está configurada no Supabase
- Verifique se não há espaços extras
- Verifique se está usando HTTP/HTTPS correto

### **"User not found in users table"**
- Execute o script `social_login_integration.sql`
- Verifique se o trigger está ativo
- Verifique se as políticas RLS permitem INSERT

### **"Email not sent"**
- Verifique configurações SMTP
- Verifique se o email não está na pasta spam
- Teste com um email diferente

## 📞 **Suporte**

Se os problemas persistirem:
1. Verifique os logs do Supabase
2. Verifique os logs do navegador
3. Execute o script de diagnóstico
4. Consulte a documentação do Supabase

---

**Lembre-se: Sempre teste em ambiente de desenvolvimento primeiro!** 🧪
