-- ========================================
-- SCRIPT PARA CRIAR FUNÇÃO RPC NO SUPABASE
-- ========================================
-- Execute este script no SQL Editor do Supabase para criar a função RPC

-- 1. Criar função RPC para upsert de configurações
CREATE OR REPLACE FUNCTION upsert_user_configuracoes(
  p_user_id UUID,
  p_configuracoes JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Inserir ou atualizar configurações
  INSERT INTO user_configuracoes (user_id, configuracoes, created_at, updated_at)
  VALUES (p_user_id, p_configuracoes, NOW(), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    configuracoes = p_configuracoes,
    updated_at = NOW();
  
  -- Retornar as configurações salvas
  RETURN p_configuracoes;
END;
$$;

-- 2. Dar permissão para a função ser executada por usuários autenticados
GRANT EXECUTE ON FUNCTION upsert_user_configuracoes(UUID, JSONB) TO authenticated;

-- 3. Verificar se a função foi criada
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'upsert_user_configuracoes';

-- 4. Testar a função (substitua o user_id pelo ID real)
-- SELECT upsert_user_configuracoes('USER_ID_AQUI', '{"modo_escuro": true, "teste": "rpc"}');
