-- Atualizar a constraint de status para incluir os novos status
-- Primeiro, remover a constraint existente
ALTER TABLE imoveis DROP CONSTRAINT IF EXISTS imoveis_status_check;

-- Criar nova constraint com todos os status permitidos
ALTER TABLE imoveis ADD CONSTRAINT imoveis_status_check 
CHECK (status IN ('publicado', 'pendente', 'inativo', 'finalizado'));

-- Comentário explicativo
COMMENT ON CONSTRAINT imoveis_status_check ON imoveis IS 'Status permitidos: publicado, pendente, inativo, finalizado';
