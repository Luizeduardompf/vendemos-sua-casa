-- Script para confirmar utilizador diretamente
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos ver quais utilizadores existem
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email LIKE '%teste%'
ORDER BY created_at DESC
LIMIT 5;

-- Confirmar o utilizador mais recente
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'teste-1760286562845@gmail.com';

-- Verificar se foi confirmado
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'teste-1760286562845@gmail.com';

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Utilizador confirmado com sucesso!';
  RAISE NOTICE '📧 Email: teste-1760286562845@gmail.com';
  RAISE NOTICE '⏰ Confirmado em: %', NOW();
END $$;
