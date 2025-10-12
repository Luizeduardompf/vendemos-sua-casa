# 🔧 Configuração do Supabase

## Erro atual:
```
Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

## Solução:

### 1. Criar projeto no Supabase
1. Acesse: https://supabase.com
2. Faça login ou crie conta
3. Clique em "New Project"
4. Configure:
   - **Name:** `vendemos-sua-casa`
   - **Database Password:** (crie uma senha forte)
   - **Region:** South America - São Paulo

### 2. Obter credenciais
1. No dashboard, vá em **Settings** → **API**
2. Copie as seguintes informações:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Editar .env.local
Substitua os valores no arquivo `.env.local`:

```bash
# Editar o arquivo
nano .env.local
```

Substitua:
- `your_supabase_project_url` → sua URL real
- `your_supabase_anon_key` → sua chave anon real
- `your_supabase_service_role_key` → sua chave service_role real

### 4. Reiniciar o container
```bash
docker-compose restart
```

### 5. Configurar banco de dados
Execute o SQL do README.md no Supabase Dashboard:
- Vá em **SQL Editor**
- Cole o código SQL do README.md
- Execute

## Exemplo de .env.local correto:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2ODAwMCwiZXhwIjoyMDE0MzQ0MDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk4NzY4MDAwLCJleHAiOjIwMTQzNDQwMDB9.example
```

## Após configurar:
- Acesse: http://localhost:3000
- O erro deve desaparecer
- A aplicação funcionará normalmente
