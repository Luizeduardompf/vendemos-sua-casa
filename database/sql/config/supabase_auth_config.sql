-- Configurar URLs de redirecionamento no Supabase
-- Execute este script no Supabase SQL Editor

-- Atualizar configurações de autenticação
UPDATE auth.config 
SET 
  site_url = 'http://localhost:3000',
  redirect_to = 'http://localhost:3000/auth/confirm'
WHERE id = 1;

-- Se a tabela não existir, criar configuração
INSERT INTO auth.config (id, site_url, redirect_to)
VALUES (1, 'http://localhost:3000', 'http://localhost:3000/auth/confirm')
ON CONFLICT (id) DO UPDATE SET
  site_url = EXCLUDED.site_url,
  redirect_to = EXCLUDED.redirect_to;

-- Verificar configuração
SELECT * FROM auth.config;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ URLs de redirecionamento configuradas!';
  RAISE NOTICE '🌐 Site URL: http://localhost:3000';
  RAISE NOTICE '🔗 Redirect URL: http://localhost:3000/auth/confirm';
END $$;
