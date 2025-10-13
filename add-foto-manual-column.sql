-- Adicionar coluna foto_manual à tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS foto_manual BOOLEAN DEFAULT FALSE;

-- Comentário explicativo
COMMENT ON COLUMN users.foto_manual IS 'Indica se a foto foi enviada manualmente pelo usuário (true) ou veio do Google (false)';