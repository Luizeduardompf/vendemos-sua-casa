-- Adicionar coluna foto_manual se não existir
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS foto_manual BOOLEAN DEFAULT false;

-- Verificar se foi adicionada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'foto_manual';
