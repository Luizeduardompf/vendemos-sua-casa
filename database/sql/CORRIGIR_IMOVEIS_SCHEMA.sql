-- =============================================
-- VENDEMOS SUA CASA - CORREÇÃO DO SCHEMA DE IMÓVEIS
-- =============================================
-- Script para corrigir problemas no schema de imóveis
-- Data: 2024-12-19

-- =============================================
-- 1. ADICIONAR COLUNA IMOVEL_ID
-- =============================================

-- Adicionar coluna imovel_id se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis' AND column_name = 'imovel_id'
  ) THEN
    ALTER TABLE imoveis ADD COLUMN imovel_id VARCHAR(6) UNIQUE;
    RAISE NOTICE 'Coluna imovel_id adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna imovel_id já existe';
  END IF;
END $$;

-- =============================================
-- 2. CORRIGIR CONSTRAINT DE EXPOSICAO_SOLAR
-- =============================================

-- Remover constraint existente se houver
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'imoveis_exposicao_solar_check'
  ) THEN
    ALTER TABLE imoveis DROP CONSTRAINT imoveis_exposicao_solar_check;
    RAISE NOTICE 'Constraint exposicao_solar removida';
  END IF;
END $$;

-- Adicionar nova constraint com valores válidos
ALTER TABLE imoveis ADD CONSTRAINT imoveis_exposicao_solar_check 
CHECK (exposicao_solar IS NULL OR exposicao_solar IN ('manha', 'tarde', 'todo_dia'));

-- =============================================
-- 3. CORRIGIR CONSTRAINT DE ESTADO_CONSERVACAO
-- =============================================

-- Remover constraint existente se houver
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'imoveis_estado_conservacao_check'
  ) THEN
    ALTER TABLE imoveis DROP CONSTRAINT imoveis_estado_conservacao_check;
    RAISE NOTICE 'Constraint estado_conservacao removida';
  END IF;
END $$;

-- Adicionar nova constraint com valores válidos
ALTER TABLE imoveis ADD CONSTRAINT imoveis_estado_conservacao_check 
CHECK (estado_conservacao IS NULL OR estado_conservacao IN ('excelente', 'muito_bom', 'bom', 'regular', 'ruim'));

-- =============================================
-- 4. CORRIGIR TABELA IMOVEIS_MEDIA
-- =============================================

-- Adicionar colunas obrigatórias se não existirem
DO $$
BEGIN
  -- Adicionar nome_arquivo se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis_media' AND column_name = 'nome_arquivo'
  ) THEN
    ALTER TABLE imoveis_media ADD COLUMN nome_arquivo VARCHAR(255) NOT NULL DEFAULT 'foto.jpg';
    RAISE NOTICE 'Coluna nome_arquivo adicionada';
  END IF;

  -- Adicionar caminho_arquivo se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imoveis_media' AND column_name = 'caminho_arquivo'
  ) THEN
    ALTER TABLE imoveis_media ADD COLUMN caminho_arquivo VARCHAR(500) NOT NULL DEFAULT '/uploads/default.jpg';
    RAISE NOTICE 'Coluna caminho_arquivo adicionada';
  END IF;
END $$;

-- =============================================
-- 5. CORRIGIR TABELA IMOVEIS_AMENITIES
-- =============================================

-- Verificar se a tabela existe e tem as colunas corretas
DO $$
BEGIN
  -- Verificar se a tabela existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'imoveis_amenities'
  ) THEN
    -- Criar tabela se não existir
    CREATE TABLE imoveis_amenities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
      nome_amenity VARCHAR(100) NOT NULL,
      valor VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    RAISE NOTICE 'Tabela imoveis_amenities criada';
  ELSE
    -- Verificar se as colunas existem
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'imoveis_amenities' AND column_name = 'nome_amenity'
    ) THEN
      ALTER TABLE imoveis_amenities ADD COLUMN nome_amenity VARCHAR(100) NOT NULL DEFAULT 'Característica';
      RAISE NOTICE 'Coluna nome_amenity adicionada';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'imoveis_amenities' AND column_name = 'valor'
    ) THEN
      ALTER TABLE imoveis_amenities ADD COLUMN valor VARCHAR(255);
      RAISE NOTICE 'Coluna valor adicionada';
    END IF;
  END IF;
END $$;

-- =============================================
-- 6. ATUALIZAR DADOS EXISTENTES
-- =============================================

-- Atualizar imóveis existentes com imovel_id se não tiverem
UPDATE imoveis 
SET imovel_id = 'APT' || LPAD(EXTRACT(EPOCH FROM created_at)::integer % 1000, 3, '0')
WHERE imovel_id IS NULL;

-- Atualizar mídias existentes com dados obrigatórios
UPDATE imoveis_media 
SET 
  nome_arquivo = 'foto-' || id || '.jpg',
  caminho_arquivo = '/uploads/imoveis/' || imovel_id || '/foto-' || id || '.jpg'
WHERE nome_arquivo IS NULL OR caminho_arquivo IS NULL;

-- =============================================
-- 7. VERIFICAR RESULTADOS
-- =============================================

SELECT 'Schema corrigido com sucesso!' as status;

-- Verificar estrutura das tabelas
SELECT 
  'imoveis' as tabela,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'imoveis' 
ORDER BY ordinal_position;

SELECT 
  'imoveis_media' as tabela,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'imoveis_media' 
ORDER BY ordinal_position;

SELECT 
  'imoveis_amenities' as tabela,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'imoveis_amenities' 
ORDER BY ordinal_position;
