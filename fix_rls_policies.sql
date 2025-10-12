-- =============================================
-- CORRIGIR POLÍTICAS RLS - VENDEMOS SUA CASA
-- =============================================
-- Execute este script no Supabase SQL Editor

-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Super admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Agents can view agency data" ON users;

-- 2. CRIAR POLÍTICAS SIMPLES E FUNCIONAIS
-- Política: Utilizadores podem ver apenas os seus próprios dados
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Política: Utilizadores podem inserir apenas os seus próprios dados
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Política: Utilizaradores podem atualizar apenas os seus próprios dados
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Política: Admins podem ver todos os utilizadores
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
        AND admin_level >= 1
    )
  );

-- Política: Admins podem inserir utilizadores
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
        AND admin_level >= 2
    )
  );

-- Política: Super admins podem atualizar qualquer utilizador
CREATE POLICY "Super admins can update any user" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
        AND admin_level >= 3
    )
  );

-- 3. VERIFICAR SE RLS ESTÁ ATIVO
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. VERIFICAR POLÍTICAS CRIADAS
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users' 
  AND schemaname = 'public'
ORDER BY policyname;

-- 5. MENSAGEM DE SUCESSO
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS corrigidas com sucesso!';
  RAISE NOTICE '🔐 % políticas criadas', (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users');
  RAISE NOTICE '🚀 Sistema pronto para teste!';
END $$;
