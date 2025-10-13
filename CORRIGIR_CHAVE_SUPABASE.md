# 🔑 CORRIGIR CHAVE DO SUPABASE

## ❌ **PROBLEMA IDENTIFICADO**

O erro "Invalid API key" indica que a chave `NEXT_PUBLIC_SUPABASE_ANON_KEY` no arquivo `.env.local` não é válida.

## 🔧 **SOLUÇÃO**

### **1. Obter a chave correta do Supabase**

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto: `xbsrabobcleosovskqaf`
   - Clique em **Settings** → **API**

2. **Copie a chave correta:**
   - Procure por **"anon public"** key
   - Copie a chave completa (começa com `eyJ...`)

### **2. Atualizar o arquivo .env.local**

**Opção A - Via terminal:**
```bash
# Substitua SUA_CHAVE_AQUI pela chave copiada
sed -i '' 's|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_AQUI|' .env.local
```

**Opção B - Editar manualmente:**
1. Abra o arquivo `.env.local`
2. Substitua a linha `NEXT_PUBLIC_SUPABASE_ANON_KEY=...` pela chave correta
3. Salve o arquivo

### **3. Reiniciar o servidor**

```bash
# Parar servidor atual
pkill -f "next dev"

# Iniciar servidor
npm run dev
```

### **4. Testar o login**

1. Acesse: http://localhost:3000/auth/login
2. Tente fazer login com um usuário existente
3. Ou registre um novo usuário

## 🧪 **VERIFICAR SE FUNCIONOU**

Execute este comando para verificar se a chave está correta:
```bash
node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); console.log('✅ Cliente Supabase criado com sucesso!');"
```

## 📋 **EXEMPLO DE CHAVE VÁLIDA**

Uma chave válida deve ter aproximadamente 200+ caracteres e começar com `eyJ`:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhic3JhYm9iY2xlb3NvdnNrcWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NzQ4NzQsImV4cCI6MjA1MjI1MDg3NH0.8QZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ
```

## ⚠️ **IMPORTANTE**

- **NUNCA** compartilhe sua chave pública
- **NUNCA** commite o arquivo `.env.local` no Git
- Use sempre a chave do seu projeto específico
- A chave deve ser a "anon public" key, não a "service role" key
