-- Script para confirmar utilizador no Supabase
-- Execute este script no Supabase SQL Editor

-- Atualizar utilizador para confirmado
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'teste-dashboard@gmail.com';

-- Verificar se foi atualizado
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'teste-dashboard@gmail.com';

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Utilizador confirmado com sucesso!';
  RAISE NOTICE '📧 Email: teste-dashboard@gmail.com';
  RAISE NOTICE '⏰ Confirmado em: %', NOW();
END $$;
