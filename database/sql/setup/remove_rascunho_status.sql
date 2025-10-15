-- Script para remover referências ao status 'rascunho' e ajustar para 'pendente'

-- 1. Atualizar todos os registros que têm status 'rascunho' para 'pendente'
UPDATE imoveis 
SET status = 'pendente' 
WHERE status = 'rascunho';

-- 2. Atualizar a constraint para remover 'rascunho' e manter apenas os status válidos
ALTER TABLE imoveis 
DROP CONSTRAINT IF EXISTS imoveis_status_check;

ALTER TABLE imoveis 
ADD CONSTRAINT imoveis_status_check 
CHECK (status IN ('publicado', 'pendente', 'inativo', 'finalizado'));

-- 3. Atualizar o valor padrão da coluna status
ALTER TABLE imoveis 
ALTER COLUMN status SET DEFAULT 'pendente';

-- 4. Adicionar comentário na constraint
COMMENT ON CONSTRAINT imoveis_status_check ON imoveis IS 'Status permitidos: publicado, pendente, inativo, finalizado';

-- 5. Verificar quantos registros foram atualizados
SELECT 
  status,
  COUNT(*) as quantidade
FROM imoveis 
GROUP BY status 
ORDER BY quantidade DESC;

