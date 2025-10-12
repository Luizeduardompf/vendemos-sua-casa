-- Script para atualizar URLs do Supabase para porta 3001
-- Execute este script no Supabase SQL Editor

-- Atualizar configurações para usar porta 3001
UPDATE auth.config 
SET 
  site_url = 'http://localhost:3001',
  redirect_to = 'http://localhost:3001/auth/confirm'
WHERE id = 1;

-- Se não existir, criar configuração
INSERT INTO auth.config (
  id, 
  site_url, 
  redirect_to
) VALUES (
  1, 
  'http://localhost:3001', 
  'http://localhost:3001/auth/confirm'
) ON CONFLICT (id) DO UPDATE SET
  site_url = EXCLUDED.site_url,
  redirect_to = EXCLUDED.redirect_to;

-- Verificar se foi atualizado
SELECT * FROM auth.config;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ URLs atualizadas para porta 3001!';
  RAISE NOTICE '🌐 Site URL: http://localhost:3001';
  RAISE NOTICE '🔗 Redirect URL: http://localhost:3001/auth/confirm';
END $$;
