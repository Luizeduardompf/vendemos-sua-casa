-- Função para atualizar status dos imóveis
CREATE OR REPLACE FUNCTION update_imoveis_status()
RETURNS TABLE(
  id UUID,
  titulo TEXT,
  imovel_id VARCHAR,
  status_anterior TEXT,
  status_novo TEXT
) AS $$
DECLARE
  imovel_record RECORD;
  status_options TEXT[] := ARRAY['publicado', 'pendente'];
  selected_status TEXT;
  counter INTEGER := 0;
BEGIN
  -- Atualizar cada imóvel com um status específico
  FOR imovel_record IN 
    SELECT id, titulo, imovel_id, status
    FROM imoveis 
    ORDER BY created_at DESC
  LOOP
    -- Determinar status baseado no contador
    IF counter < 8 THEN
      selected_status := 'publicado';
    ELSE
      selected_status := 'pendente';
    END IF;
    
    -- Atualizar o imóvel
    UPDATE imoveis 
    SET status = selected_status 
    WHERE imoveis.id = imovel_record.id;
    
    -- Retornar o resultado
    RETURN QUERY SELECT 
      imovel_record.id,
      imovel_record.titulo,
      imovel_record.imovel_id,
      imovel_record.status,
      selected_status;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
