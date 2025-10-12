-- Script para verificar configurações do Supabase
-- Execute este script no Supabase SQL Editor

-- Verificar se existem tabelas de configuração
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth' 
  AND table_name LIKE '%config%';

-- Verificar configurações de autenticação
SELECT 
  'auth.users' as tabela,
  COUNT(*) as total_utilizadores,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmados,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as nao_confirmados
FROM auth.users;

-- Verificar utilizadores de teste
SELECT 
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ Não confirmado'
  END as status
FROM auth.users 
WHERE email LIKE '%teste%' OR email LIKE '%gmail%'
ORDER BY created_at DESC
LIMIT 5;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Mensagem de status
DO $$
DECLARE
  total_users INTEGER;
  confirmed_users INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT COUNT(*) INTO confirmed_users FROM auth.users WHERE email_confirmed_at IS NOT NULL;
  
  RAISE NOTICE '📊 Total de utilizadores: %', total_users;
  RAISE NOTICE '✅ Utilizadores confirmados: %', confirmed_users;
  RAISE NOTICE '❌ Utilizadores não confirmados: %', (total_users - confirmed_users);
  
  IF confirmed_users = total_users THEN
    RAISE NOTICE '🎉 Todos os utilizadores estão confirmados!';
  ELSE
    RAISE NOTICE '⚠️ Há utilizadores não confirmados. Desabilite a confirmação de email no Dashboard.';
  END IF;
END $$;
