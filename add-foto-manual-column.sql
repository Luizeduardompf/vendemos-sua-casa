-- Adicionar coluna para rastrear se a foto foi alterada manualmente
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS foto_manual BOOLEAN DEFAULT false;

-- Comentário para documentar a coluna
COMMENT ON COLUMN users.foto_manual IS 'Indica se a foto foi alterada manualmente pelo usuário (true) ou é do Google (false)';

-- Atualizar usuários existentes para marcar fotos do Google como não manuais
UPDATE users 
SET foto_manual = false 
WHERE provedor = 'google' AND foto_manual IS NULL;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'foto_manual';
