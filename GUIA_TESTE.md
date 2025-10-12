# 🧪 Guia de Teste - Vendemos Sua Casa

## ✅ Status Atual
- ✅ Backend Supabase configurado
- ✅ Tabela `users` criada
- ✅ RLS (Row Level Security) ativo
- ✅ Social login integrado
- ✅ Aplicação rodando em Docker

---

## 🔍 **TESTE 1: Verificar Setup do Supabase**

### 1.1 Executar Script de Verificação
1. **Aceder ao Supabase Dashboard**
2. **Ir para "SQL Editor"**
3. **Executar o script `test_supabase_setup.sql`**
4. **Verificar se aparecem as mensagens de sucesso**

### 1.2 Verificar Tabela no Dashboard
1. **Ir para "Table Editor"**
2. **Verificar se existe a tabela `users`**
3. **Verificar se tem as colunas:**
   - `id`, `auth_user_id`, `email`, `nome_completo`
   - `user_type`, `admin_level`, `is_verified`
   - `created_at`, `updated_at`

---

## 🌐 **TESTE 2: Testar Aplicação Web**

### 2.1 Aceder à Aplicação
- **URL:** http://localhost:3000
- **Verificar se carrega a página inicial**

### 2.2 Testar Navegação
1. **Clicar em "Entrar"** → Deve ir para `/auth/select-type`
2. **Clicar em "VENDER"** → Deve ir para `/auth/register?type=proprietario`
3. **Testar menu hamburger** no mobile
4. **Verificar responsividade** em diferentes tamanhos

### 2.3 Testar Páginas de Autenticação
1. **Ir para `/auth/login`**
2. **Verificar se aparecem os botões de social login**
3. **Testar formulário de login**
4. **Ir para `/auth/register`**
5. **Testar formulário de registo**

---

## 🔐 **TESTE 3: Testar Autenticação Social**

### 3.1 Configurar Social Login no Supabase
1. **Ir para "Authentication" → "Providers"**
2. **Ativar Google, Facebook, LinkedIn**
3. **Configurar OAuth URLs:**
   - **Redirect URL:** `http://localhost:3000/auth/callback`

### 3.2 Testar Login Social
1. **Clicar em "Continuar com Google"**
2. **Verificar se redireciona para Google**
3. **Após login, verificar se volta para a aplicação**
4. **Verificar se utilizador foi criado na tabela `users`**

---

## 📊 **TESTE 4: Verificar Dados na Base de Dados**

### 4.1 Verificar Utilizador Criado
```sql
-- Executar no SQL Editor do Supabase
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

### 4.2 Verificar Views
```sql
-- Verificar proprietários ativos
SELECT * FROM proprietarios_ativos;

-- Verificar dashboard admin
SELECT * FROM admin_dashboard;

-- Verificar utilizadores pendentes
SELECT * FROM users_pending_approval;
```

---

## ⚙️ **TESTE 5: Testar Funções de Admin**

### 5.1 Criar Utilizador Admin
```sql
-- Executar no SQL Editor (substituir pelo auth_user_id real)
INSERT INTO users (
  auth_user_id,
  email,
  nome_completo,
  user_type,
  admin_level,
  is_verified,
  is_active
) VALUES (
  'seu-auth-user-id-aqui',
  'admin@vendemossuacasa.pt',
  'Administrador',
  'super_admin',
  3,
  true,
  true
);
```

### 5.2 Testar Funções
```sql
-- Testar função de aprovação
SELECT approve_user('user-uuid-aqui');

-- Testar função de promoção
SELECT promote_to_admin('user-uuid-aqui', 2);

-- Testar função de perfil
SELECT * FROM get_user_profile('auth-user-id-aqui');
```

---

## 🚨 **TESTE 6: Verificar Segurança (RLS)**

### 6.1 Testar Acesso Restrito
1. **Fazer login com utilizador normal**
2. **Tentar aceder a dados de outros utilizadores**
3. **Verificar se RLS bloqueia o acesso**

### 6.2 Verificar Logs
1. **Ir para "Logs" no Supabase**
2. **Verificar se aparecem tentativas de acesso**
3. **Verificar se RLS está a funcionar**

---

## 📱 **TESTE 7: Testar Responsividade**

### 7.1 Testar em Diferentes Dispositivos
1. **Desktop (1920x1080)**
2. **Tablet (768x1024)**
3. **Mobile (375x667)**
4. **Mobile grande (414x896)**

### 7.2 Verificar Elementos
- ✅ Header com logo e navegação
- ✅ Botões "Entrar" e "VENDER" sempre visíveis
- ✅ Menu hamburger funcional no mobile
- ✅ Footer com links e informações
- ✅ Formulários responsivos

---

## 🐛 **TESTE 8: Verificar Erros**

### 8.1 Verificar Console do Browser
1. **Abrir DevTools (F12)**
2. **Ir para "Console"**
3. **Verificar se há erros JavaScript**
4. **Verificar se há erros de rede**

### 8.2 Verificar Logs da Aplicação
```bash
# Ver logs do Docker
docker-compose logs --tail=50

# Ver logs em tempo real
docker-compose logs -f
```

---

## ✅ **CHECKLIST DE SUCESSO**

- [ ] ✅ Supabase configurado e funcionando
- [ ] ✅ Tabela `users` criada com todas as colunas
- [ ] ✅ RLS ativo e funcionando
- [ ] ✅ Aplicação web carrega sem erros
- [ ] ✅ Páginas de autenticação funcionais
- [ ] ✅ Social login configurado (opcional)
- [ ] ✅ Formulários responsivos
- [ ] ✅ Navegação funcional
- [ ] ✅ Sem erros no console
- [ ] ✅ Logs limpos

---

## 🆘 **RESOLUÇÃO DE PROBLEMAS**

### Problema: Aplicação não carrega
**Solução:**
```bash
docker-compose down
docker-compose up --build
```

### Problema: Erro de conexão com Supabase
**Solução:**
1. Verificar variáveis de ambiente
2. Verificar se Supabase está ativo
3. Verificar URL e chave da API

### Problema: Social login não funciona
**Solução:**
1. Verificar configuração no Supabase
2. Verificar URLs de redirecionamento
3. Verificar se providers estão ativos

---

## 📞 **PRÓXIMOS PASSOS**

Após todos os testes passarem:
1. **Configurar domínio de produção**
2. **Configurar variáveis de ambiente de produção**
3. **Implementar sistema de imóveis**
4. **Implementar sistema de agendamentos**
5. **Implementar sistema de propostas**

---

**🎉 Parabéns! O sistema está funcionando!**
