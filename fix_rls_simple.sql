-- CORRIGIR POLÍTICAS RLS - VERSÃO SIMPLES
-- Execute no Supabase SQL Editor

-- 1. DESATIVAR RLS TEMPORARIAMENTE
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Super admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Agents can view agency data" ON users;

-- 3. CRIAR POLÍTICAS BÁSICAS
-- Política simples: todos podem inserir (para teste)
CREATE POLICY "Allow insert for testing" ON users
  FOR INSERT WITH CHECK (true);

-- Política simples: todos podem ver (para teste)
CREATE POLICY "Allow select for testing" ON users
  FOR SELECT USING (true);

-- Política simples: todos podem atualizar (para teste)
CREATE POLICY "Allow update for testing" ON users
  FOR UPDATE USING (true);

-- 4. ATIVAR RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. VERIFICAR
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'users' 
  AND schemaname = 'public';

-- 6. MENSAGEM
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS simplificadas criadas!';
  RAISE NOTICE '🧪 Modo de teste ativado - todos podem aceder';
  RAISE NOTICE '🚀 Agora pode testar o registo!';
END $$;
