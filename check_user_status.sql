-- Script para verificar status do utilizador
-- Execute este script no Supabase SQL Editor

-- Verificar utilizador mais recente
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.created_at,
  u.nome_completo,
  u.user_type,
  u.is_verified
FROM auth.users au
LEFT JOIN users u ON au.id = u.auth_user_id
WHERE au.email LIKE '%teste-final%'
ORDER BY au.created_at DESC
LIMIT 3;

-- Verificar se há utilizadores não confirmados
SELECT 
  COUNT(*) as total_nao_confirmados
FROM auth.users 
WHERE email_confirmed_at IS NULL 
  AND email LIKE '%teste%';

-- Verificar configurações de email
SELECT 
  site_url,
  redirect_to,
  enable_email_confirmations
FROM auth.config;

-- Mensagem de status
DO $$
DECLARE
  nao_confirmados INTEGER;
BEGIN
  SELECT COUNT(*) INTO nao_confirmados
  FROM auth.users 
  WHERE email_confirmed_at IS NULL 
    AND email LIKE '%teste%';
    
  RAISE NOTICE '📊 Utilizadores de teste não confirmados: %', nao_confirmados;
  
  IF nao_confirmados > 0 THEN
    RAISE NOTICE '⚠️ Há utilizadores não confirmados!';
  ELSE
    RAISE NOTICE '✅ Todos os utilizadores estão confirmados!';
  END IF;
END $$;
