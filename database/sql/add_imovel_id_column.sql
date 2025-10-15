-- Adicionar coluna imovel_id à tabela imoveis
ALTER TABLE imoveis 
ADD COLUMN IF NOT EXISTS imovel_id VARCHAR(7) UNIQUE;

-- Comentário da coluna
COMMENT ON COLUMN imoveis.imovel_id IS 'ID único do imóvel no formato ABC-123 (3 letras maiúsculas + hífen + 3 números)';

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_imoveis_imovel_id ON imoveis(imovel_id);

-- Atualizar os registros existentes extraindo o ID do slug
UPDATE imoveis
SET imovel_id = (
  SELECT substring(slug from '([A-Z]{3}-[0-9]{3})$')
)
WHERE imovel_id IS NULL AND slug IS NOT NULL;

-- Verificar resultados
SELECT 
  COUNT(*) as total,
  COUNT(imovel_id) as com_imovel_id,
  COUNT(*) - COUNT(imovel_id) as sem_imovel_id
FROM imoveis;

