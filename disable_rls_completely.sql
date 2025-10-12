-- ========================================
-- SCRIPT PARA DESABILITAR RLS COMPLETAMENTE
-- ========================================
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar RLS na tabela user_settings
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON user_settings;
DROP POLICY IF EXISTS "Allow users to select their own settings" ON user_settings;
DROP POLICY IF EXISTS "Allow users to insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Allow users to update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Allow users to delete their own settings" ON user_settings;

-- 3. Verificar se RLS foi desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_settings';

-- 4. Verificar se não há políticas
SELECT 
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'user_settings';

-- 5. Testar inserção manual (substitua o user_id pelo ID real)
-- Primeiro, encontre o ID do usuário de teste
SELECT id, email, nome_completo 
FROM users 
WHERE email = 'teste.config6@example.com';

-- 6. Testar inserção com o ID encontrado (substitua 'USER_ID_AQUI' pelo ID real)
-- INSERT INTO user_settings (user_id, modo_escuro, tema_cor, idioma) 
-- VALUES ('USER_ID_AQUI', true, 'verde', 'en') 
-- RETURNING *;
