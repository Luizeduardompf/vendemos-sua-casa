-- ========================================
-- SCRIPT PARA CORRIGIR RLS DA TABELA user_settings
-- ========================================
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar RLS temporariamente para modificar políticas
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON user_settings;

-- 3. Habilitar RLS novamente
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS simplificadas que funcionam
-- Política para SELECT: usuários autenticados podem ver suas próprias configurações
CREATE POLICY "Allow users to select their own settings" ON user_settings
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Política para INSERT: usuários autenticados podem criar suas próprias configurações
CREATE POLICY "Allow users to insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Política para UPDATE: usuários autenticados podem atualizar suas próprias configurações
CREATE POLICY "Allow users to update their own settings" ON user_settings
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Política para DELETE: usuários autenticados podem deletar suas próprias configurações
CREATE POLICY "Allow users to delete their own settings" ON user_settings
  FOR DELETE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- 5. Verificar se as políticas foram criadas corretamente
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_settings'
ORDER BY policyname;

-- 6. Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_settings';

-- 7. Testar inserção (substitua USER_ID pelo ID real de um usuário)
-- Primeiro, encontre o ID do usuário de teste
SELECT id, email, nome_completo 
FROM users 
WHERE email = 'teste.config6@example.com';

-- 8. Testar inserção com o ID encontrado (substitua 'USER_ID_AQUI' pelo ID real)
-- INSERT INTO user_settings (user_id, modo_escuro, tema_cor, idioma) 
-- VALUES ('USER_ID_AQUI', true, 'verde', 'en') 
-- RETURNING *;
