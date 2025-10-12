-- Verificar utilizadores na tabela
SELECT 
  id,
  email,
  nome_completo,
  user_type,
  is_verified,
  is_active,
  created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
