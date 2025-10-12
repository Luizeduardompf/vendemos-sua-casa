-- Script para corrigir URLs do Supabase para porta 3000
-- Execute este script no Supabase SQL Editor

-- Atualizar configurações para usar porta 3000
UPDATE auth.config 
SET 
  site_url = 'http://localhost:3000',
  redirect_to = 'http://localhost:3000/auth/confirm',
  enable_email_confirmations = false
WHERE id = 1;

-- Se não existir, criar configuração
INSERT INTO auth.config (
  id, 
  site_url, 
  redirect_to,
  enable_email_confirmations
) VALUES (
  1, 
  'http://localhost:3000', 
  'http://localhost:3000/auth/confirm',
  false
) ON CONFLICT (id) DO UPDATE SET
  site_url = EXCLUDED.site_url,
  redirect_to = EXCLUDED.redirect_to,
  enable_email_confirmations = EXCLUDED.enable_email_confirmations;

-- Verificar se foi atualizado
SELECT * FROM auth.config;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ URLs corrigidas para porta 3000!';
  RAISE NOTICE '🌐 Site URL: http://localhost:3000';
  RAISE NOTICE '🔗 Redirect URL: http://localhost:3000/auth/confirm';
  RAISE NOTICE '📧 Email confirmations: DESABILITADO';
END $$;
