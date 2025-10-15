-- =============================================
-- VENDEMOS SUA CASA - SCRIPT FINAL DE IMÓVEIS
-- =============================================
-- Execute este script no SQL Editor do Supabase
-- Data: 2024-12-19
-- Versão: 1.0 - Script que analisa e cria tudo corretamente

-- =============================================
-- 1. VERIFICAR E LIMPAR DADOS EXISTENTES
-- =============================================

DO $$
BEGIN
  -- Verificar se existem tabelas de imóveis
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'imoveis') THEN
    RAISE NOTICE '🧹 Limpando dados existentes de imóveis...';
    
    -- Dropar views primeiro
    DROP VIEW IF EXISTS imoveis_detalhes CASCADE;
    DROP VIEW IF EXISTS imoveis_estatisticas CASCADE;
    DROP VIEW IF EXISTS imoveis_favoritos_view CASCADE;
    
    -- Dropar triggers
    DROP TRIGGER IF EXISTS trigger_update_imoveis_updated_at ON imoveis;
    DROP TRIGGER IF EXISTS trigger_update_imoveis_media_updated_at ON imoveis_media;
    DROP TRIGGER IF EXISTS trigger_update_imoveis_amenities_updated_at ON imoveis_amenities;
    DROP TRIGGER IF EXISTS trigger_update_imoveis_contatos_updated_at ON imoveis_contatos;
    
    -- Dropar tabelas em ordem de dependência
    DROP TABLE IF EXISTS imoveis_contatos CASCADE;
    DROP TABLE IF EXISTS imoveis_favoritos CASCADE;
    DROP TABLE IF EXISTS imoveis_views CASCADE;
    DROP TABLE IF EXISTS imoveis_amenities CASCADE;
    DROP TABLE IF EXISTS imoveis_media CASCADE;
    DROP TABLE IF EXISTS imoveis CASCADE;
    
    RAISE NOTICE '✅ Dados existentes removidos';
  ELSE
    RAISE NOTICE 'ℹ️ Nenhuma tabela de imóveis encontrada, prosseguindo com criação';
  END IF;
END $$;

-- =============================================
-- 2. VERIFICAR ESTRUTURA DA TABELA USERS
-- =============================================

DO $$
DECLARE
  users_exists BOOLEAN;
  proprietarios_count INTEGER;
  users_columns TEXT[];
BEGIN
  -- Verificar se tabela users existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'users'
  ) INTO users_exists;
  
  IF NOT users_exists THEN
    RAISE EXCEPTION '❌ Tabela users não existe! Execute primeiro o setup básico do sistema.';
  END IF;
  
  -- Verificar se existem proprietários
  SELECT COUNT(*) INTO proprietarios_count 
  FROM users 
  WHERE user_type = 'proprietario';
  
  IF proprietarios_count = 0 THEN
    RAISE EXCEPTION '❌ Nenhum proprietário encontrado! Crie usuários proprietários primeiro.';
  END IF;
  
  RAISE NOTICE '✅ Encontrados % proprietários na tabela users', proprietarios_count;
  
  -- Verificar colunas importantes
  SELECT ARRAY_AGG(column_name) INTO users_columns
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'users'
    AND column_name IN ('id', 'nome_completo', 'localidade', 'distrito', 'user_type');
  
  IF NOT ('id' = ANY(users_columns) AND 'nome_completo' = ANY(users_columns) AND 'user_type' = ANY(users_columns)) THEN
    RAISE EXCEPTION '❌ Tabela users não tem as colunas necessárias!';
  END IF;
  
  RAISE NOTICE '✅ Estrutura da tabela users verificada';
END $$;

-- =============================================
-- 3. CRIAR TABELAS DE IMÓVEIS
-- =============================================

-- Tabela principal de imóveis
CREATE TABLE imoveis (
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
  coordenadas POINT,
  
  -- Características físicas
  area_total DECIMAL(8,2),
  area_util DECIMAL(8,2),
  area_terreno DECIMAL(10,2),
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
  valor_energetico DECIMAL(6,2),
  emissao_co2 DECIMAL(6,2),
  
  -- Características especiais
  orientacao VARCHAR(20) CHECK (orientacao IN (
    'norte', 'sul', 'este', 'oeste', 'nordeste', 'noroeste', 
    'sudeste', 'sudoeste', 'variavel'
  )),
  exposicao_solar VARCHAR(20) CHECK (exposicao_solar IN (
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

-- Tabela de mídias dos imóveis
CREATE TABLE imoveis_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  tipo_media VARCHAR(20) NOT NULL CHECK (tipo_media IN (
    'foto', 'video', 'documento', 'planta', 'certificado', 'outro'
  )),
  nome_arquivo VARCHAR(255) NOT NULL,
  caminho_arquivo TEXT NOT NULL,
  url_publica TEXT,
  tamanho_bytes BIGINT,
  mime_type VARCHAR(100),
  largura INTEGER,
  altura INTEGER,
  resolucao VARCHAR(20),
  ordem INTEGER DEFAULT 0,
  categoria VARCHAR(50),
  descricao TEXT,
  tags TEXT[],
  ativo BOOLEAN DEFAULT TRUE,
  principal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comodidades e características
CREATE TABLE imoveis_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'exterior', 'interior', 'cozinha', 'casa_banho', 'aquecimento', 
    'ar_condicionado', 'seguranca', 'estacionamento', 'outros'
  )),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  disponivel BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de visualizações e estatísticas
CREATE TABLE imoveis_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  session_id VARCHAR(255),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tipo_visualizacao VARCHAR(20) DEFAULT 'pagina' CHECK (tipo_visualizacao IN (
    'pagina', 'lista', 'destaque', 'busca', 'favorito'
  )),
  pais VARCHAR(50),
  regiao VARCHAR(100),
  cidade VARCHAR(100),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE imoveis_favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(imovel_id, user_id)
);

-- Tabela de contatos/interesses
CREATE TABLE imoveis_contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  mensagem TEXT,
  tipo_interesse VARCHAR(20) DEFAULT 'informacao' CHECK (tipo_interesse IN (
    'informacao', 'visita', 'proposta', 'negociacao'
  )),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'contactado', 'respondido', 'fechado', 'cancelado'
  )),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. CRIAR ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_imoveis_proprietario ON imoveis(proprietario_id);
CREATE INDEX idx_imoveis_tipo ON imoveis(tipo_imovel);
CREATE INDEX idx_imoveis_categoria ON imoveis(categoria);
CREATE INDEX idx_imoveis_status ON imoveis(status);
CREATE INDEX idx_imoveis_visibilidade ON imoveis(visibilidade);
CREATE INDEX idx_imoveis_localizacao ON imoveis(distrito, localidade);
CREATE INDEX idx_imoveis_preco_venda ON imoveis(preco_venda) WHERE preco_venda IS NOT NULL;
CREATE INDEX idx_imoveis_preco_arrendamento ON imoveis(preco_arrendamento) WHERE preco_arrendamento IS NOT NULL;
CREATE INDEX idx_imoveis_quartos ON imoveis(quartos) WHERE quartos IS NOT NULL;
CREATE INDEX idx_imoveis_area ON imoveis(area_total) WHERE area_total IS NOT NULL;
CREATE INDEX idx_imoveis_publicacao ON imoveis(data_publicacao) WHERE data_publicacao IS NOT NULL;
CREATE INDEX idx_imoveis_slug ON imoveis(slug);

-- =============================================
-- 5. CRIAR TRIGGERS PARA UPDATED_AT
-- =============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas as tabelas
CREATE TRIGGER trigger_update_imoveis_updated_at
  BEFORE UPDATE ON imoveis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_imoveis_media_updated_at
  BEFORE UPDATE ON imoveis_media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_imoveis_contatos_updated_at
  BEFORE UPDATE ON imoveis_contatos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. INSERIR DADOS DE EXEMPLO
-- =============================================

DO $$
DECLARE
  proprietario_record RECORD;
  imovel_counter INTEGER := 1;
  total_imoveis INTEGER := 0;
  
  -- Arrays de dados para geração aleatória
  tipos_imoveis TEXT[] := ARRAY['apartamento', 'casa', 'moradia', 'villa', 'quinta', 'terreno', 'loja', 'escritorio', 'armazem', 'garagem'];
  categorias TEXT[] := ARRAY['venda', 'arrendamento', 'venda_arrendamento'];
  estados TEXT[] := ARRAY['novo', 'excelente', 'bom', 'razoavel', 'precisa_obras'];
  orientacoes TEXT[] := ARRAY['norte', 'sul', 'este', 'oeste', 'nordeste', 'noroeste', 'sudeste', 'sudoeste'];
  exposicoes TEXT[] := ARRAY['muito_boa', 'boa', 'razoavel', 'pouca', 'muito_pouca'];
  certificados TEXT[] := ARRAY['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F', 'G'];
  distritos TEXT[] := ARRAY['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro', 'Setúbal', 'Leiria', 'Viseu', 'Vila Real'];
  localidades TEXT[] := ARRAY['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro', 'Almada', 'Leiria', 'Viseu', 'Vila Real', 'Sintra', 'Cascais', 'Oeiras', 'Amadora', 'Vila Nova de Gaia'];
  freguesias TEXT[] := ARRAY['Centro', 'Sé', 'Santo António', 'Avenidas Novas', 'Alvalade', 'Benfica', 'Carnide', 'Lumiar', 'Marvila', 'Olivais'];
  moradas TEXT[] := ARRAY['Rua das Flores', 'Avenida da Liberdade', 'Rua Augusta', 'Rua do Comércio', 'Praça do Comércio', 'Rua da Prata', 'Rua do Ouro', 'Rua da Misericórdia', 'Rua do Carmo', 'Rua Garrett'];
  titulos TEXT[] := ARRAY['Apartamento Moderno', 'Casa com Jardim', 'Villa de Luxo', 'Loja Comercial', 'Escritório', 'Terreno Urbano', 'Garagem Coberta', 'Armazém Industrial', 'Moradia Típica', 'Quinta Rural'];
  descricoes TEXT[] := ARRAY['Excelente localização', 'Próximo ao centro', 'Zona calma e familiar', 'Com todas as comodidades', 'Ideal para famílias', 'Vista panorâmica', 'Totalmente equipado', 'Pronto a habitar', 'Com garagem', 'Com elevador'];
  
  -- Variáveis para geração de dados
  codigo_postal_base INTEGER;
  codigo_postal_sufixo INTEGER;
  codigo_postal_final TEXT;
  morada_final TEXT;
  titulo_final TEXT;
  descricao_final TEXT;
  localidade_final TEXT;
  distrito_final TEXT;
  
BEGIN
  RAISE NOTICE '🏠 Iniciando criação de exemplos de imóveis...';
  
  -- Para cada proprietário existente, criar vários imóveis
  FOR proprietario_record IN 
    SELECT id, nome_completo, COALESCE(localidade, 'Lisboa') as localidade, COALESCE(distrito, 'Lisboa') as distrito
    FROM users 
    WHERE user_type = 'proprietario' 
    ORDER BY created_at
  LOOP
    RAISE NOTICE '👤 Criando imóveis para: %', proprietario_record.nome_completo;
    
    -- Criar 5-8 imóveis para cada proprietário
    FOR i IN 1..(5 + (random() * 4)::INTEGER) LOOP
      -- Gerar código postal válido (formato: XXXX-XXX)
      codigo_postal_base := 1000 + (random() * 8999)::INTEGER;
      codigo_postal_sufixo := 100 + (random() * 899)::INTEGER;
      codigo_postal_final := codigo_postal_base::TEXT || '-' || codigo_postal_sufixo::TEXT;
      
      -- Gerar morada
      morada_final := moradas[1 + (random() * (array_length(moradas, 1) - 1))::INTEGER] || ', ' || (100 + (random() * 900))::TEXT;
      
      -- Gerar título
      titulo_final := titulos[1 + (random() * (array_length(titulos, 1) - 1))::INTEGER] || ' ' || (100 + imovel_counter)::TEXT;
      
      -- Gerar descrição
      descricao_final := descricoes[1 + (random() * (array_length(descricoes, 1) - 1))::INTEGER] || '. ' || 
        'Localizado em ' || localidades[1 + (random() * (array_length(localidades, 1) - 1))::INTEGER] || 
        ', este imóvel oferece excelentes condições para ' || 
        CASE WHEN categorias[1 + (random() * (array_length(categorias, 1) - 1))::INTEGER] = 'venda' THEN 'compra' ELSE 'arrendamento' END || '.';
      
      -- Usar localização do proprietário ou gerar aleatória
      localidade_final := CASE 
        WHEN random() > 0.3 THEN proprietario_record.localidade 
        ELSE localidades[1 + (random() * (array_length(localidades, 1) - 1))::INTEGER] 
      END;
      
      distrito_final := CASE 
        WHEN random() > 0.3 THEN proprietario_record.distrito 
        ELSE distritos[1 + (random() * (array_length(distritos, 1) - 1))::INTEGER] 
      END;
      
      -- Inserir imóvel
      INSERT INTO imoveis (
        proprietario_id,
        titulo,
        descricao,
        slug,
        tipo_imovel,
        categoria,
        preco_venda,
        preco_arrendamento,
        morada,
        codigo_postal,
        localidade,
        distrito,
        freguesia,
        area_total,
        area_util,
        area_terreno,
        quartos,
        casas_banho,
        wc,
        andar,
        total_andares,
        elevador,
        ano_construcao,
        estado_conservacao,
        certificado_energetico,
        orientacao,
        exposicao_solar,
        status,
        visibilidade,
        data_publicacao,
        destaque,
        premium,
        visualizacoes,
        favoritos,
        contactos
      ) VALUES (
        proprietario_record.id,
        titulo_final,
        descricao_final,
        'imovel-' || imovel_counter,
        tipos_imoveis[1 + (random() * (array_length(tipos_imoveis, 1) - 1))::INTEGER],
        categorias[1 + (random() * (array_length(categorias, 1) - 1))::INTEGER],
        CASE WHEN random() > 0.3 THEN (50000 + (random() * 950000))::DECIMAL(12,2) ELSE NULL END,
        CASE WHEN random() > 0.7 THEN (300 + (random() * 4700))::DECIMAL(10,2) ELSE NULL END,
        morada_final,
        codigo_postal_final,
        localidade_final,
        distrito_final,
        freguesias[1 + (random() * (array_length(freguesias, 1) - 1))::INTEGER],
        CASE WHEN random() > 0.2 THEN (30 + (random() * 470))::DECIMAL(8,2) ELSE NULL END,
        CASE WHEN random() > 0.2 THEN (25 + (random() * 425))::DECIMAL(8,2) ELSE NULL END,
        CASE WHEN random() > 0.5 THEN (100 + (random() * 1900))::DECIMAL(10,2) ELSE NULL END,
        CASE WHEN random() > 0.3 THEN (1 + (random() * 6))::INTEGER ELSE NULL END,
        CASE WHEN random() > 0.3 THEN (1 + (random() * 4))::INTEGER ELSE NULL END,
        CASE WHEN random() > 0.7 THEN (1 + (random() * 2))::INTEGER ELSE 0 END,
        CASE WHEN random() > 0.4 THEN (1 + (random() * 15))::INTEGER ELSE NULL END,
        CASE WHEN random() > 0.4 THEN (2 + (random() * 18))::INTEGER ELSE NULL END,
        random() > 0.6,
        CASE WHEN random() > 0.1 THEN (1950 + (random() * 74))::INTEGER ELSE NULL END,
        estados[1 + (random() * (array_length(estados, 1) - 1))::INTEGER],
        CASE WHEN random() > 0.3 THEN certificados[1 + (random() * (array_length(certificados, 1) - 1))::INTEGER] ELSE NULL END,
        orientacoes[1 + (random() * (array_length(orientacoes, 1) - 1))::INTEGER],
        exposicoes[1 + (random() * (array_length(exposicoes, 1) - 1))::INTEGER],
        CASE WHEN random() > 0.1 THEN 'publicado' ELSE 'pendente' END,
        CASE WHEN random() > 0.2 THEN 'publico' ELSE 'privado' END,
        CASE WHEN random() > 0.1 THEN NOW() - (random() * INTERVAL '30 days') ELSE NULL END,
        random() > 0.8,
        random() > 0.9,
        (random() * 200)::INTEGER,
        (random() * 50)::INTEGER,
        (random() * 20)::INTEGER
      );
      
      imovel_counter := imovel_counter + 1;
      total_imoveis := total_imoveis + 1;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '✅ Criados % imóveis para % proprietários', total_imoveis, (SELECT COUNT(*) FROM users WHERE user_type = 'proprietario');
END $$;

-- =============================================
-- 7. INSERIR DADOS RELACIONADOS
-- =============================================

-- Inserir mídias de exemplo
INSERT INTO imoveis_media (imovel_id, tipo_media, nome_arquivo, caminho_arquivo, url_publica, largura, altura, ordem, categoria, descricao, principal, ativo)
SELECT 
  i.id,
  'foto',
  'imovel-' || i.id || '-principal.jpg',
  '/uploads/imoveis/imovel-' || i.id || '-principal.jpg',
  'https://images.unsplash.com/photo-' || (1560448204 + (random() * 1000000))::INTEGER || '?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'exterior',
  'Foto principal do imóvel',
  TRUE,
  TRUE
FROM imoveis i
WHERE random() > 0.3
LIMIT 20;

-- Inserir comodidades de exemplo
INSERT INTO imoveis_amenities (imovel_id, categoria, nome, descricao, disponivel)
SELECT 
  i.id,
  'exterior',
  'Jardim',
  'Jardim privado',
  TRUE
FROM imoveis i
WHERE i.tipo_imovel IN ('casa', 'villa', 'quinta') AND random() > 0.3
LIMIT 10;

INSERT INTO imoveis_amenities (imovel_id, categoria, nome, descricao, disponivel)
SELECT 
  i.id,
  'estacionamento',
  'Garagem',
  'Garagem coberta',
  TRUE
FROM imoveis i
WHERE random() > 0.4
LIMIT 15;

-- Inserir visualizações de exemplo
INSERT INTO imoveis_views (imovel_id, ip_address, user_agent, tipo_visualizacao, pais, regiao, cidade)
SELECT 
  i.id,
  ('192.168.1.' || (100 + (random() * 155))::INTEGER)::INET,
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'pagina',
  'Portugal',
  i.distrito,
  i.localidade
FROM imoveis i
WHERE random() > 0.7
LIMIT 30;

-- Inserir favoritos de exemplo
INSERT INTO imoveis_favoritos (imovel_id, user_id)
SELECT 
  i.id,
  u.id
FROM imoveis i
CROSS JOIN users u
WHERE u.user_type = 'proprietario' 
  AND u.id != i.proprietario_id
  AND random() > 0.8
LIMIT 20;

-- Inserir contatos de exemplo
INSERT INTO imoveis_contatos (imovel_id, nome, email, telefone, mensagem, tipo_interesse, status)
SELECT 
  i.id,
  'Cliente ' || (100 + (random() * 900))::TEXT,
  'cliente' || (100 + (random() * 900))::TEXT || '@email.com',
  '+351 9' || (10000000 + (random() * 90000000))::INTEGER,
  'Gostaria de mais informações sobre este imóvel.',
  'informacao',
  'pendente'
FROM imoveis i
WHERE random() > 0.6
LIMIT 15;

-- =============================================
-- 8. VERIFICAÇÃO FINAL
-- =============================================

DO $$
DECLARE
  table_count INTEGER;
  imoveis_count INTEGER;
  proprietarios_count INTEGER;
  media_count INTEGER;
  amenities_count INTEGER;
  views_count INTEGER;
  favoritos_count INTEGER;
  contatos_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name IN ('imoveis', 'imoveis_media', 'imoveis_amenities', 
                       'imoveis_views', 'imoveis_favoritos', 'imoveis_contatos');
  
  SELECT COUNT(*) INTO imoveis_count FROM imoveis;
  SELECT COUNT(*) INTO proprietarios_count FROM users WHERE user_type = 'proprietario';
  SELECT COUNT(*) INTO media_count FROM imoveis_media;
  SELECT COUNT(*) INTO amenities_count FROM imoveis_amenities;
  SELECT COUNT(*) INTO views_count FROM imoveis_views;
  SELECT COUNT(*) INTO favoritos_count FROM imoveis_favoritos;
  SELECT COUNT(*) INTO contatos_count FROM imoveis_contatos;
  
  RAISE NOTICE '';
  RAISE NOTICE '🎉 SCRIPT EXECUTADO COM SUCESSO!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Estatísticas Finais:';
  RAISE NOTICE '   - Tabelas criadas: %', table_count;
  RAISE NOTICE '   - Proprietários: %', proprietarios_count;
  RAISE NOTICE '   - Imóveis: %', imoveis_count;
  RAISE NOTICE '   - Mídias: %', media_count;
  RAISE NOTICE '   - Comodidades: %', amenities_count;
  RAISE NOTICE '   - Visualizações: %', views_count;
  RAISE NOTICE '   - Favoritos: %', favoritos_count;
  RAISE NOTICE '   - Contatos: %', contatos_count;
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Sistema de imóveis pronto para uso!';
  RAISE NOTICE '';
END $$;
