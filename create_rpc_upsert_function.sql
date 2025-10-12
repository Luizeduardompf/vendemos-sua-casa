-- ========================================
-- SCRIPT PARA CRIAR FUNÇÃO RPC upsert_user_settings
-- ========================================
-- Execute este script no SQL Editor do Supabase

-- 1. Criar função RPC para upsert de configurações
CREATE OR REPLACE FUNCTION upsert_user_settings(
  p_user_id UUID,
  p_modo_escuro BOOLEAN DEFAULT NULL,
  p_tema_cor VARCHAR(20) DEFAULT NULL,
  p_tamanho_fonte VARCHAR(20) DEFAULT NULL,
  p_compacto BOOLEAN DEFAULT NULL,
  p_animacoes BOOLEAN DEFAULT NULL,
  p_notificacoes_email BOOLEAN DEFAULT NULL,
  p_notificacoes_push BOOLEAN DEFAULT NULL,
  p_notificacoes_sms BOOLEAN DEFAULT NULL,
  p_som_notificacoes BOOLEAN DEFAULT NULL,
  p_vibracao BOOLEAN DEFAULT NULL,
  p_idioma VARCHAR(10) DEFAULT NULL,
  p_fuso_horario VARCHAR(50) DEFAULT NULL,
  p_privacidade_perfil VARCHAR(20) DEFAULT NULL,
  p_marketing_emails BOOLEAN DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Inserir ou atualizar configurações
  INSERT INTO user_settings (
    user_id,
    modo_escuro,
    tema_cor,
    tamanho_fonte,
    compacto,
    animacoes,
    notificacoes_email,
    notificacoes_push,
    notificacoes_sms,
    som_notificacoes,
    vibracao,
    idioma,
    fuso_horario,
    privacidade_perfil,
    marketing_emails,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    COALESCE(p_modo_escuro, false),
    COALESCE(p_tema_cor, 'azul'),
    COALESCE(p_tamanho_fonte, 'medio'),
    COALESCE(p_compacto, false),
    COALESCE(p_animacoes, true),
    COALESCE(p_notificacoes_email, true),
    COALESCE(p_notificacoes_push, true),
    COALESCE(p_notificacoes_sms, false),
    COALESCE(p_som_notificacoes, true),
    COALESCE(p_vibracao, true),
    COALESCE(p_idioma, 'pt'),
    COALESCE(p_fuso_horario, 'Europe/Lisbon'),
    COALESCE(p_privacidade_perfil, 'publico'),
    COALESCE(p_marketing_emails, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    modo_escuro = COALESCE(p_modo_escuro, user_settings.modo_escuro),
    tema_cor = COALESCE(p_tema_cor, user_settings.tema_cor),
    tamanho_fonte = COALESCE(p_tamanho_fonte, user_settings.tamanho_fonte),
    compacto = COALESCE(p_compacto, user_settings.compacto),
    animacoes = COALESCE(p_animacoes, user_settings.animacoes),
    notificacoes_email = COALESCE(p_notificacoes_email, user_settings.notificacoes_email),
    notificacoes_push = COALESCE(p_notificacoes_push, user_settings.notificacoes_push),
    notificacoes_sms = COALESCE(p_notificacoes_sms, user_settings.notificacoes_sms),
    som_notificacoes = COALESCE(p_som_notificacoes, user_settings.som_notificacoes),
    vibracao = COALESCE(p_vibracao, user_settings.vibracao),
    idioma = COALESCE(p_idioma, user_settings.idioma),
    fuso_horario = COALESCE(p_fuso_horario, user_settings.fuso_horario),
    privacidade_perfil = COALESCE(p_privacidade_perfil, user_settings.privacidade_perfil),
    marketing_emails = COALESCE(p_marketing_emails, user_settings.marketing_emails),
    updated_at = NOW()
  RETURNING *;
  
  -- Retornar as configurações salvas
  SELECT to_jsonb(result) INTO result;
  RETURN result;
END;
$$;

-- 2. Dar permissão para a função ser executada por usuários autenticados
GRANT EXECUTE ON FUNCTION upsert_user_settings(UUID, BOOLEAN, VARCHAR, VARCHAR, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, VARCHAR, VARCHAR, VARCHAR, BOOLEAN) TO authenticated;

-- 3. Verificar se a função foi criada
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'upsert_user_settings';

-- 4. Testar a função (substitua o user_id pelo ID real)
-- SELECT upsert_user_settings('USER_ID_AQUI', true, 'verde', 'grande', false, true, false, true, false, true, true, 'en', 'Europe/London', 'privado', false);
