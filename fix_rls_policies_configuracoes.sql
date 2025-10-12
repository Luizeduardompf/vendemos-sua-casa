-- ========================================
-- SCRIPT PARA CORRIGIR AS POLÍTICAS RLS
-- ========================================
-- Execute este script no SQL Editor do Supabase para corrigir as políticas RLS

-- 1. Remover as políticas existentes
DROP POLICY IF EXISTS "Utilizadores podem ver suas próprias configurações" ON user_configuracoes;
DROP POLICY IF EXISTS "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes;
DROP POLICY IF EXISTS "Utilizadores podem criar suas próprias configurações" ON user_configuracoes;

-- 2. Criar políticas mais simples que funcionam com JWT
CREATE POLICY "Permitir todas as operações para utilizadores autenticados" ON user_configuracoes
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

-- 3. Verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_configuracoes';

-- 4. Testar inserção manual (substitua o user_id pelo ID real do usuário)
-- Primeiro, encontre o ID do usuário de teste
SELECT id, email, nome_completo 
FROM users 
WHERE email = 'teste.config6@example.com';

-- 5. Testar inserção com o ID encontrado (substitua 'USER_ID_AQUI' pelo ID real)
-- INSERT INTO user_configuracoes (user_id, configuracoes) 
-- VALUES ('USER_ID_AQUI', '{"modo_escuro": true, "teste": "inserção_direta"}') RETURNING *;

-- 6. Verificar se a inserção funcionou
-- SELECT * FROM user_configuracoes WHERE user_id = 'USER_ID_AQUI';
