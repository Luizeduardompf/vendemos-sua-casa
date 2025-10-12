-- ========================================
-- SCRIPT PARA DESABILITAR RLS TEMPORARIAMENTE
-- ========================================
-- Execute este script no SQL Editor do Supabase para desabilitar RLS

-- 1. Desabilitar RLS na tabela user_configuracoes
ALTER TABLE user_configuracoes DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se RLS foi desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_configuracoes';

-- 3. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Utilizadores podem ver suas próprias configurações" ON user_configuracoes;
DROP POLICY IF EXISTS "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes;
DROP POLICY IF EXISTS "Utilizadores podem criar suas próprias configurações" ON user_configuracoes;
DROP POLICY IF EXISTS "Permitir todas as operações para utilizadores autenticados" ON user_configuracoes;

-- 4. Verificar se não há políticas
SELECT 
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'user_configuracoes';

-- 5. Testar inserção manual (substitua o user_id pelo ID real)
-- Primeiro, encontre o ID do usuário de teste
SELECT id, email, nome_completo 
FROM users 
WHERE email = 'teste.config6@example.com';

-- 6. Testar inserção com o ID encontrado (substitua 'USER_ID_AQUI' pelo ID real)
-- INSERT INTO user_configuracoes (user_id, configuracoes) 
-- VALUES ('USER_ID_AQUI', '{"modo_escuro": true, "teste": "sem_rls"}') 
-- RETURNING *;
