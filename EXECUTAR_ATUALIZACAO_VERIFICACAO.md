# 🔧 Atualização: Campos de Verificação e Análise

## 📋 **O que foi implementado:**

### **1. Novos Campos na Tabela `users`:**
- ✅ `email_verificado` → Indica se o email foi verificado
- ✅ `telefone_verificado` → Indica se o telefone foi verificado via OTP
- ✅ `conta_analisada` → Indica se a conta foi analisada por um funcionário
- ✅ `status_analise` → Status da análise (`pending`, `approved`, `rejected`, `under_review`)
- ✅ Datas de verificação para auditoria

### **2. Lógica Implementada:**
- 🔐 **Login Google** → `email_verificado = true` (Google já verificou)
- 📧 **Registro Email** → `email_verificado = false` (precisa confirmar)
- 📱 **Telefone** → Sempre `false` no início (futura verificação OTP)
- 🔍 **Análise** → Todas as contas iniciam como `pending`

### **3. Interface:**
- ✅ Botão de status no header (aparece quando conta está pendente)
- ✅ Modal explicativo com detalhes do processo
- ✅ Indicadores visuais para email e telefone verificados
- ✅ Ícone de notificação correto (sino)

---

## 🚀 **Como Executar a Atualização:**

### **Passo 1: Acessar Supabase Dashboard**
1. Vá para: https://supabase.com/dashboard
2. Selecione o seu projeto
3. No menu lateral, clique em **SQL Editor**

### **Passo 2: Executar o Script SQL**
1. Clique em **New query**
2. Copie o conteúdo do arquivo `database/sql/updates/add_verification_fields.sql`
3. Cole no editor SQL
4. Clique em **Run** (ou pressione `Ctrl+Enter`)

### **Passo 3: Verificar Resultado**
O script irá:
- ✅ Adicionar os novos campos à tabela `users`
- ✅ Definir valores padrão para contas existentes
- ✅ Criar índices para performance
- ✅ Criar view `users_with_verification`

### **Passo 4: Confirmar**
Execute esta consulta para verificar:

```sql
SELECT 
  id, 
  email, 
  email_verificado, 
  telefone_verificado, 
  conta_analisada, 
  status_analise
FROM users
LIMIT 5;
```

Você deve ver os novos campos com valores:
- `email_verificado`: `false` (contas antigas) ou `true` (Google)
- `telefone_verificado`: `false` (todas)
- `conta_analisada`: `false` (todas)
- `status_analise`: `pending` (todas)

---

## 📊 **Status das Contas:**

### **pending** (Pendente)
- Conta aguardando análise
- Aparece botão amarelo "Análise Pendente"
- Modal explica o processo (24-48h)

### **approved** (Aprovada)
- Conta verificada e ativa
- Não aparece botão de status
- Acesso completo à plataforma

### **rejected** (Rejeitada)
- Conta rejeitada após análise
- Aparece botão vermelho "Conta Rejeitada"
- Modal orienta sobre próximos passos

### **under_review** (Em Análise)
- Conta sendo analisada ativamente
- Aparece botão amarelo "Análise Pendente"
- Modal informa que análise está em andamento

---

## 🔄 **Fluxo de Verificação:**

### **Novo Usuário (Google):**
1. Faz login com Google
2. `email_verificado = true` (automático)
3. `telefone_verificado = false`
4. `status_analise = 'pending'`
5. Aparece "Análise Pendente" no dashboard

### **Novo Usuário (Email):**
1. Registra com email/senha
2. `email_verificado = false`
3. Precisa confirmar email
4. `telefone_verificado = false`
5. `status_analise = 'pending'`

### **Análise da Conta:**
1. Funcionário revisa cadastro
2. Atualiza `status_analise` para `approved` ou `rejected`
3. Define `conta_analisada = true`
4. Define `data_analise_conta = NOW()`

```sql
-- Aprovar conta:
UPDATE users 
SET 
  status_analise = 'approved',
  conta_analisada = true,
  data_analise_conta = NOW()
WHERE id = 'USER_ID';

-- Rejeitar conta:
UPDATE users 
SET 
  status_analise = 'rejected',
  conta_analisada = true,
  data_analise_conta = NOW()
WHERE id = 'USER_ID';
```

---

## 🎯 **Próximos Passos (Futuro):**

### **Verificação de Email (Email/Senha):**
- Implementar OTP via email
- Atualizar `email_verificado = true` após confirmação

### **Verificação de Telefone:**
- Implementar OTP via SMS
- Atualizar `telefone_verificado = true` após confirmação

### **Painel de Administração:**
- Interface para funcionários analisarem contas
- Aprovar/rejeitar com motivos
- Histórico de análises

---

## ❓ **Perguntas Frequentes:**

### **1. Contas antigas ficam pendentes?**
Sim, todas as contas existentes terão `status_analise = 'pending'`. Você pode aprovar em massa:

```sql
UPDATE users 
SET 
  status_analise = 'approved',
  conta_analisada = true,
  data_analise_conta = NOW()
WHERE created_at < '2025-01-13'; -- Ajuste a data conforme necessário
```

### **2. Como verificar email manualmente?**
```sql
UPDATE users 
SET 
  email_verificado = true,
  data_verificacao_email = NOW()
WHERE email = 'usuario@email.com';
```

### **3. Como verificar telefone manualmente?**
```sql
UPDATE users 
SET 
  telefone_verificado = true,
  data_verificacao_telefone = NOW()
WHERE telefone = '+351912345678';
```

---

## ✅ **Checklist de Execução:**

- [ ] Executar `database/sql/updates/add_verification_fields.sql`
- [ ] Verificar se campos foram criados
- [ ] Testar login com Google (email deve ser verificado)
- [ ] Testar registro com email (email deve estar pendente)
- [ ] Verificar se modal de status aparece
- [ ] Confirmar que ícone de notificação está correto

---

**Após executar o SQL, reinicie o servidor Next.js para garantir que as mudanças sejam refletidas!**

```bash
npm run dev
```

