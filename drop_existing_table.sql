-- ========================================
-- SCRIPT PARA APAGAR TABELA EXISTENTE
-- ========================================
-- Execute este script no SQL Editor do Supabase

-- 1. Apagar tabela user_configuracoes se existir
DROP TABLE IF EXISTS user_configuracoes CASCADE;

-- 2. Verificar se a tabela foi removida
SELECT 
  schemaname,
  tablename
FROM pg_tables 
WHERE tablename IN ('user_configuracoes', 'user_settings');

-- 3. Verificar se há políticas RLS restantes
SELECT 
  policyname,
  tablename
FROM pg_policies 
WHERE tablename IN ('user_configuracoes', 'user_settings');
