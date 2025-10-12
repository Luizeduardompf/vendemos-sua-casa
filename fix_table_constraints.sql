-- ========================================
-- SCRIPT PARA CORRIGIR A TABELA user_configuracoes
-- ========================================
-- Execute este script no SQL Editor do Supabase para corrigir a tabela

-- 1. Criar índice único na coluna user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_configuracoes_user_id_unique 
ON user_configuracoes(user_id);

-- 2. Verificar se o índice foi criado
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'user_configuracoes';

-- 3. Remover políticas RLS problemáticas
DROP POLICY IF EXISTS "Utilizadores podem ver suas próprias configurações" ON user_configuracoes;
DROP POLICY IF EXISTS "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes;
DROP POLICY IF EXISTS "Utilizadores podem criar suas próprias configurações" ON user_configuracoes;

-- 4. Criar política simples
CREATE POLICY "Permitir todas as operações para utilizadores autenticados" ON user_configuracoes
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

-- 5. Verificar políticas
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_configuracoes';

-- 6. Testar inserção manual (substitua o user_id pelo ID real)
-- Primeiro, encontre o ID do usuário de teste
SELECT id, email, nome_completo 
FROM users 
WHERE email = 'teste.config6@example.com';

-- 7. Testar inserção com o ID encontrado (substitua 'USER_ID_AQUI' pelo ID real)
-- INSERT INTO user_configuracoes (user_id, configuracoes) 
-- VALUES ('USER_ID_AQUI', '{"modo_escuro": true, "teste": "inserção_direta"}') 
-- ON CONFLICT (user_id) 
-- DO UPDATE SET configuracoes = EXCLUDED.configuracoes, updated_at = NOW()
-- RETURNING *;
