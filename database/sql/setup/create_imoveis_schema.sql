-- =============================================
-- VENDEMOS SUA CASA - SCHEMA DE IMÓVEIS
-- =============================================
-- Execute este script no SQL Editor do Supabase
-- Data: 2024-12-19
-- Versão: 1.0

-- =============================================
-- 1. TABELA PRINCIPAL DE IMÓVEIS
-- =============================================

CREATE TABLE IF NOT EXISTS imoveis (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proprietario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informações básicas
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  
  -- Tipo e categoria
  tipo_imovel VARCHAR(50) NOT NULL CHECK (tipo_imovel IN (
    'apartamento', 'casa', 'moradia', 'villa', 'quinta', 'terreno', 
    'loja', 'escritorio', 'armazem', 'garagem', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'venda', 'arrendamento', 'venda_arrendamento'
  )),
  
  -- Preço e condições
  preco_venda DECIMAL(12,2),
  preco_arrendamento DECIMAL(10,2),
  moeda VARCHAR(3) DEFAULT 'EUR',
  condicoes_pagamento TEXT,
  
  -- Localização
  morada TEXT NOT NULL,
  codigo_postal VARCHAR(10),
  localidade VARCHAR(100) NOT NULL,
  distrito VARCHAR(50) NOT NULL,
  freguesia VARCHAR(100),
  coordenadas POINT, -- PostGIS point para geolocalização
  
  -- Características físicas
  area_total DECIMAL(8,2), -- m²
  area_util DECIMAL(8,2), -- m²
  area_terreno DECIMAL(10,2), -- m²
  quartos INTEGER CHECK (quartos >= 0),
  casas_banho INTEGER CHECK (casas_banho >= 0),
  wc INTEGER CHECK (wc >= 0),
  andar INTEGER,
  total_andares INTEGER,
  elevador BOOLEAN DEFAULT FALSE,
  
  -- Ano e estado
  ano_construcao INTEGER,
  ano_renovacao INTEGER,
  estado_conservacao VARCHAR(50) CHECK (estado_conservacao IN (
    'novo', 'excelente', 'bom', 'razoavel', 'precisa_obras'
  )),
  
  -- Energia e certificação
  certificado_energetico VARCHAR(10) CHECK (certificado_energetico IN (
    'A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F', 'G'
  )),
  valor_energetico DECIMAL(6,2), -- kWh/m²/ano
  emissao_co2 DECIMAL(6,2), -- kg CO2/m²/ano
  
  -- Características especiais
  orientacao VARCHAR(20) CHECK (orientacao IN (
    'norte', 'sul', 'este', 'oeste', 'nordeste', 'noroeste', 
    'sudeste', 'sudoeste', 'variavel'
  )),
  exposição_solar VARCHAR(20) CHECK (exposição_solar IN (
    'muito_boa', 'boa', 'razoavel', 'pouca', 'muito_pouca'
  )),
  
  -- Status e visibilidade
  status VARCHAR(20) NOT NULL DEFAULT 'rascunho' CHECK (status IN (
    'rascunho', 'pendente', 'aprovado', 'publicado', 'vendido', 
    'arrendado', 'pausado', 'rejeitado', 'expirado'
  )),
  visibilidade VARCHAR(20) DEFAULT 'privado' CHECK (visibilidade IN (
    'privado', 'publico', 'agentes', 'premium'
  )),
  
  -- Dados de publicação
  data_publicacao TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE,
  destaque BOOLEAN DEFAULT FALSE,
  premium BOOLEAN DEFAULT FALSE,
  
  -- Estatísticas
  visualizacoes INTEGER DEFAULT 0,
  favoritos INTEGER DEFAULT 0,
  contactos INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 2. TABELA DE MÍDIAS DOS IMÓVEIS
-- =============================================

CREATE TABLE IF NOT EXISTS imoveis_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  
  -- Tipo de mídia
  tipo_media VARCHAR(20) NOT NULL CHECK (tipo_media IN (
    'foto', 'video', 'documento', 'planta', 'certificado', 'outro'
  )),
  
  -- Arquivo
  nome_arquivo VARCHAR(255) NOT NULL,
  caminho_arquivo TEXT NOT NULL,
  url_publica TEXT,
  tamanho_bytes BIGINT,
  mime_type VARCHAR(100),
  
  -- Metadados da imagem
  largura INTEGER,
  altura INTEGER,
  resolucao VARCHAR(20), -- ex: "1920x1080"
  
  -- Organização
  ordem INTEGER DEFAULT 0,
  categoria VARCHAR(50), -- ex: "exterior", "interior", "cozinha", "quarto"
  descricao TEXT,
  tags TEXT[], -- Array de tags
  
  -- Status
  ativo BOOLEAN DEFAULT TRUE,
  principal BOOLEAN DEFAULT FALSE, -- Foto principal do imóvel
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. TABELA DE COMODIDADES E CARACTERÍSTICAS
-- =============================================

CREATE TABLE IF NOT EXISTS imoveis_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  
  -- Categoria da comodidade
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'exterior', 'interior', 'cozinha', 'casa_banho', 'aquecimento', 
    'ar_condicionado', 'seguranca', 'estacionamento', 'outros'
  )),
  
  -- Comodidade específica
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  disponivel BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. TABELA DE VISUALIZAÇÕES E ESTATÍSTICAS
-- =============================================

CREATE TABLE IF NOT EXISTS imoveis_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  
  -- Dados da visualização
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  session_id VARCHAR(255),
  
  -- Dados do utilizador (se logado)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Tipo de visualização
  tipo_visualizacao VARCHAR(20) DEFAULT 'pagina' CHECK (tipo_visualizacao IN (
    'pagina', 'lista', 'destaque', 'busca', 'favorito'
  )),
  
  -- Dados de localização (se disponível)
  pais VARCHAR(50),
  regiao VARCHAR(100),
  cidade VARCHAR(100),
  
  -- Timestamps
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. TABELA DE FAVORITOS
-- =============================================

CREATE TABLE IF NOT EXISTS imoveis_favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para evitar duplicatas
  UNIQUE(imovel_id, user_id)
);

-- =============================================
-- 6. TABELA DE CONTATOS/INTERESSES
-- =============================================

CREATE TABLE IF NOT EXISTS imoveis_contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  
  -- Dados do interessado
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  mensagem TEXT,
  
  -- Tipo de interesse
  tipo_interesse VARCHAR(20) DEFAULT 'informacao' CHECK (tipo_interesse IN (
    'informacao', 'visita', 'proposta', 'negociacao'
  )),
  
  -- Status do contacto
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'contactado', 'respondido', 'fechado', 'cancelado'
  )),
  
  -- Dados do utilizador (se logado)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices da tabela imoveis
CREATE INDEX IF NOT EXISTS idx_imoveis_proprietario ON imoveis(proprietario_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_tipo ON imoveis(tipo_imovel);
CREATE INDEX IF NOT EXISTS idx_imoveis_categoria ON imoveis(categoria);
CREATE INDEX IF NOT EXISTS idx_imoveis_status ON imoveis(status);
CREATE INDEX IF NOT EXISTS idx_imoveis_visibilidade ON imoveis(visibilidade);
CREATE INDEX IF NOT EXISTS idx_imoveis_localizacao ON imoveis(distrito, localidade);
CREATE INDEX IF NOT EXISTS idx_imoveis_preco_venda ON imoveis(preco_venda) WHERE preco_venda IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_imoveis_preco_arrendamento ON imoveis(preco_arrendamento) WHERE preco_arrendamento IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_imoveis_quartos ON imoveis(quartos) WHERE quartos IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_imoveis_area ON imoveis(area_total) WHERE area_total IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_imoveis_publicacao ON imoveis(data_publicacao) WHERE data_publicacao IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_imoveis_slug ON imoveis(slug);

-- Índices da tabela imoveis_media
CREATE INDEX IF NOT EXISTS idx_imoveis_media_imovel ON imoveis_media(imovel_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_media_tipo ON imoveis_media(tipo_media);
CREATE INDEX IF NOT EXISTS idx_imoveis_media_principal ON imoveis_media(imovel_id, principal) WHERE principal = TRUE;
CREATE INDEX IF NOT EXISTS idx_imoveis_media_ordem ON imoveis_media(imovel_id, ordem);

-- Índices da tabela imoveis_amenities
CREATE INDEX IF NOT EXISTS idx_imoveis_amenities_imovel ON imoveis_amenities(imovel_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_amenities_categoria ON imoveis_amenities(categoria);

-- Índices da tabela imoveis_views
CREATE INDEX IF NOT EXISTS idx_imoveis_views_imovel ON imoveis_views(imovel_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_views_user ON imoveis_views(user_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_views_data ON imoveis_views(viewed_at);

-- Índices da tabela imoveis_favoritos
CREATE INDEX IF NOT EXISTS idx_imoveis_favoritos_imovel ON imoveis_favoritos(imovel_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_favoritos_user ON imoveis_favoritos(user_id);

-- Índices da tabela imoveis_contatos
CREATE INDEX IF NOT EXISTS idx_imoveis_contatos_imovel ON imoveis_contatos(imovel_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_contatos_user ON imoveis_contatos(user_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_contatos_status ON imoveis_contatos(status);

-- =============================================
-- 8. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =============================================

-- Trigger para atualizar updated_at na tabela imoveis
CREATE OR REPLACE FUNCTION update_imoveis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_imoveis_updated_at
  BEFORE UPDATE ON imoveis
  FOR EACH ROW
  EXECUTE FUNCTION update_imoveis_updated_at();

-- Trigger para atualizar updated_at na tabela imoveis_media
CREATE OR REPLACE FUNCTION update_imoveis_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_imoveis_media_updated_at
  BEFORE UPDATE ON imoveis_media
  FOR EACH ROW
  EXECUTE FUNCTION update_imoveis_media_updated_at();

-- Trigger para atualizar updated_at na tabela imoveis_contatos
CREATE OR REPLACE FUNCTION update_imoveis_contatos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_imoveis_contatos_updated_at
  BEFORE UPDATE ON imoveis_contatos
  FOR EACH ROW
  EXECUTE FUNCTION update_imoveis_contatos_updated_at();

-- =============================================
-- 9. FUNÇÕES ÚTEIS
-- =============================================

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_imovel_slug(titulo TEXT, imovel_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Normalizar título para slug
  base_slug := lower(trim(regexp_replace(titulo, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := substring(base_slug from 1 for 50); -- Limitar tamanho
  
  final_slug := base_slug;
  
  -- Verificar se slug já existe
  WHILE EXISTS (SELECT 1 FROM imoveis WHERE slug = final_slug AND id != imovel_id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar estatísticas de visualizações
CREATE OR REPLACE FUNCTION update_imovel_stats(imovel_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE imoveis 
  SET 
    visualizacoes = (
      SELECT COUNT(*) 
      FROM imoveis_views 
      WHERE imovel_id = imovel_uuid
    ),
    favoritos = (
      SELECT COUNT(*) 
      FROM imoveis_favoritos 
      WHERE imovel_id = imovel_uuid
    ),
    contactos = (
      SELECT COUNT(*) 
      FROM imoveis_contatos 
      WHERE imovel_id = imovel_uuid
    )
  WHERE id = imovel_uuid;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 10. VIEWS ÚTEIS
-- =============================================

-- View para imóveis com dados completos
CREATE OR REPLACE VIEW imoveis_completos AS
SELECT 
  i.*,
  u.nome_completo as proprietario_nome,
  u.email as proprietario_email,
  u.telefone as proprietario_telefone,
  -- Foto principal
  (SELECT url_publica FROM imoveis_media 
   WHERE imovel_id = i.id AND principal = TRUE AND ativo = TRUE 
   LIMIT 1) as foto_principal,
  -- Contagem de fotos
  (SELECT COUNT(*) FROM imoveis_media 
   WHERE imovel_id = i.id AND tipo_media = 'foto' AND ativo = TRUE) as total_fotos
FROM imoveis i
LEFT JOIN users u ON i.proprietario_id = u.id;

-- View para imóveis públicos (aprovados e visíveis)
CREATE OR REPLACE VIEW imoveis_publicos AS
SELECT * FROM imoveis_completos
WHERE status = 'aprovado' 
  AND visibilidade = 'publico'
  AND (data_expiracao IS NULL OR data_expiracao > NOW());

-- View para estatísticas de imóveis por proprietário
CREATE OR REPLACE VIEW imoveis_stats_proprietario AS
SELECT 
  proprietario_id,
  COUNT(*) as total_imoveis,
  COUNT(*) FILTER (WHERE status = 'publicado') as imoveis_publicados,
  COUNT(*) FILTER (WHERE status = 'vendido') as imoveis_vendidos,
  COUNT(*) FILTER (WHERE status = 'arrendado') as imoveis_arrendados,
  SUM(visualizacoes) as total_visualizacoes,
  SUM(favoritos) as total_favoritos,
  SUM(contactos) as total_contactos
FROM imoveis
GROUP BY proprietario_id;

-- =============================================
-- 11. COMENTÁRIOS
-- =============================================

COMMENT ON TABLE imoveis IS 'Tabela principal de imóveis do sistema Vendemos Sua Casa';
COMMENT ON TABLE imoveis_media IS 'Mídias associadas aos imóveis (fotos, vídeos, documentos)';
COMMENT ON TABLE imoveis_amenities IS 'Comodidades e características dos imóveis';
COMMENT ON TABLE imoveis_views IS 'Registro de visualizações dos imóveis';
COMMENT ON TABLE imoveis_favoritos IS 'Favoritos dos utilizadores';
COMMENT ON TABLE imoveis_contatos IS 'Contactos e interesses nos imóveis';

COMMENT ON COLUMN imoveis.coordenadas IS 'Coordenadas geográficas (PostGIS POINT)';
COMMENT ON COLUMN imoveis.slug IS 'URL amigável para o imóvel';
COMMENT ON COLUMN imoveis_media.principal IS 'Indica se é a foto principal do imóvel';
COMMENT ON COLUMN imoveis_media.ordem IS 'Ordem de exibição das mídias';

-- =============================================
-- 12. VERIFICAÇÃO FINAL
-- =============================================

-- Verificar se todas as tabelas foram criadas
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name IN ('imoveis', 'imoveis_media', 'imoveis_amenities', 
                       'imoveis_views', 'imoveis_favoritos', 'imoveis_contatos');
  
  IF table_count = 6 THEN
    RAISE NOTICE '✅ Todas as tabelas de imóveis foram criadas com sucesso!';
  ELSE
    RAISE NOTICE '❌ Erro: Apenas % de 6 tabelas foram criadas', table_count;
  END IF;
END $$;
