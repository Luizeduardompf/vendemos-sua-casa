# 🔍 Verificar Configuração do Google OAuth

## Problema
A foto do perfil do Google não está sendo capturada durante o login social.

## Verificações Necessárias

### 1. Supabase Dashboard - Authentication > Providers

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione o seu projeto

2. **Navegue para Authentication > Providers**
   - No menu lateral, clique em "Authentication"
   - Clique em "Providers"

3. **Verifique a configuração do Google**
   - O Google deve estar **HABILITADO** (toggle ON)
   - **Client ID**: Deve estar preenchido com o ID do seu projeto Google
   - **Client Secret**: Deve estar preenchido com o secret do seu projeto Google
   - **Redirect URL**: Deve ser exatamente `http://localhost:3000/auth/callback`

### 2. Google Cloud Console - OAuth 2.0

1. **Acesse o Google Cloud Console**
   - Vá para: https://console.cloud.google.com/
   - Selecione o seu projeto

2. **Navegue para APIs & Services > Credentials**
   - No menu lateral, clique em "APIs & Services"
   - Clique em "Credentials"

3. **Verifique a configuração do OAuth 2.0**
   - Clique no seu OAuth 2.0 Client ID
   - **Authorized redirect URIs** deve incluir:
     - `http://localhost:3000/auth/callback`
     - `https://xbsrabobcleosovskqaf.supabase.co/auth/v1/callback`

4. **Verifique os scopes**
   - Clique em "OAuth consent screen"
   - Verifique se os scopes incluem:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`

### 3. Teste Manual

1. **Faça login com Google**
   - Vá para: http://localhost:3000/auth/login
   - Clique em "Continuar com Google"
   - **IMPORTANTE**: Abra o console do navegador (F12) e verifique os logs

2. **Verifique os logs no console**
   - Procure por logs que começam com `🔵`
   - Especialmente:
     - `🔵 Google metadata:`
     - `🔵 Avatar URL:`
     - `🔵 Picture:`
     - `🔵 Foto capturada:`

3. **Se os logs mostram dados vazios**
   - O problema está na configuração do OAuth
   - Verifique se o Client ID e Secret estão corretos
   - Verifique se os scopes estão configurados

4. **Se os logs mostram dados mas a foto não aparece**
   - O problema está na exibição da foto
   - Verifique se a URL da foto é válida
   - Verifique se não há bloqueios de CORS

## Possíveis Problemas

### ❌ Google não retorna dados
- **Causa**: OAuth mal configurado
- **Solução**: Verificar Client ID, Secret e scopes

### ❌ Google retorna dados mas foto não aparece
- **Causa**: URL da foto inválida ou bloqueada
- **Solução**: Verificar se a URL é acessível

### ❌ Dados são salvos mas não exibidos
- **Causa**: Problema na interface
- **Solução**: Verificar se a foto está sendo carregada corretamente

## Próximos Passos

1. **Execute o teste manual** e envie os logs do console
2. **Verifique a configuração** do OAuth no Supabase e Google
3. **Se necessário**, reconfigurar o OAuth do zero

## Logs Esperados

Se tudo estiver funcionando, você deve ver logs como:

```
🔵 Google metadata: {avatar_url: "https://...", full_name: "Nome Completo", ...}
🔵 Avatar URL: https://lh3.googleusercontent.com/a/...
🔵 Picture: https://lh3.googleusercontent.com/a/...
🔵 Foto capturada: https://lh3.googleusercontent.com/a/...
```
