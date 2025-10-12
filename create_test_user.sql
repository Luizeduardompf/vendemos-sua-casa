-- Script para criar utilizador de teste sem confirmação de email
-- Execute este script no Supabase SQL Editor

-- Inserir utilizador diretamente na tabela auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'teste@example.com',
  crypt('Password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Inserir perfil na tabela users
INSERT INTO users (
  auth_user_id,
  email,
  nome_completo,
  user_type,
  is_verified,
  is_active,
  aceita_termos,
  aceita_privacidade,
  aceita_marketing
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'teste@example.com'),
  'teste@example.com',
  'Utilizador de Teste',
  'proprietario',
  true,
  true,
  true,
  true,
  false
);

-- Verificar se foi criado
SELECT 
  u.id,
  u.email,
  u.nome_completo,
  u.user_type,
  u.is_verified,
  au.email_confirmed_at
FROM users u
JOIN auth.users au ON u.auth_user_id = au.id
WHERE u.email = 'teste@example.com';

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Utilizador de teste criado com sucesso!';
  RAISE NOTICE '📧 Email: teste@example.com';
  RAISE NOTICE '🔑 Password: Password123';
  RAISE NOTICE '✅ Email já confirmado!';
END $$;
