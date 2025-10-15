-- =============================================
-- VENDEMOS SUA CASA - DADOS DE EXEMPLO PARA IMÓVEIS
-- =============================================
-- Execute este script após criar o schema de imóveis
-- Data: 2024-12-19
-- Versão: 1.0

-- =============================================
-- 1. INSERIR DADOS DE EXEMPLO
-- =============================================

-- Inserir imóveis de exemplo (assumindo que existe pelo menos um usuário proprietário)
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
) VALUES 
-- Imóvel 1: Apartamento T2
(
  (SELECT id FROM users WHERE user_type = 'proprietario' LIMIT 1),
  'Apartamento T2 com Varanda',
  'Apartamento moderno com excelente localização, próximo ao centro da cidade. Possui 2 quartos, 1 casa de banho completa e varanda com vista para o jardim. Cozinha equipada e sala de estar ampla. Prédio com elevador e garagem.',
  'apartamento-t2-varanda-1',
  'apartamento',
  'venda',
  250000.00,
  NULL,
  'Rua das Flores, 123',
  '1000-001',
  'Lisboa',
  'Lisboa',
  'Santo António',
  85.50,
  75.00,
  NULL,
  2,
  1,
  0,
  3,
  5,
  TRUE,
  2015,
  'excelente',
  'B',
  'sul',
  'muito_boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '5 days',
  TRUE,
  FALSE,
  45,
  8,
  3
),

-- Imóvel 2: Casa T3
(
  (SELECT id FROM users WHERE user_type = 'proprietario' LIMIT 1),
  'Casa T3 com Jardim',
  'Moradia independente com 3 quartos, 2 casas de banho e jardim privado. Localizada em zona residencial calma, com excelente acessibilidade. Garagem para 2 carros e quintal. Ideal para famílias.',
  'casa-t3-jardim-2',
  'casa',
  'venda',
  350000.00,
  NULL,
  'Avenida da Liberdade, 456',
  '1250-096',
  'Lisboa',
  'Lisboa',
  'Avenidas Novas',
  120.00,
  110.00,
  200.00,
  3,
  2,
  1,
  0,
  0,
  FALSE,
  2010,
  'bom',
  'C',
  'oeste',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '3 days',
  FALSE,
  TRUE,
  32,
  12,
  5
),

-- Imóvel 3: Terreno
(
  (SELECT id FROM users WHERE user_type = 'proprietario' LIMIT 1),
  'Terreno para Construção',
  'Terreno urbano com 500m², ideal para construção de moradia unifamiliar. Localizado em zona em expansão, com todas as infraestruturas. Licença de construção incluída.',
  'terreno-construcao-3',
  'terreno',
  'venda',
  180000.00,
  NULL,
  'Rua da Esperança, 789',
  '2800-123',
  'Almada',
  'Setúbal',
  'Almada',
  NULL,
  NULL,
  500.00,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  FALSE,
  NULL,
  'novo',
  NULL,
  'sul',
  'muito_boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '1 day',
  FALSE,
  FALSE,
  18,
  3,
  1
),

-- Imóvel 4: Loja
(
  (SELECT id FROM users WHERE user_type = 'proprietario' LIMIT 1),
  'Loja Comercial no Centro',
  'Loja comercial no centro histórico, com 60m² de área útil. Ideal para comércio tradicional ou escritório. Zona de grande movimento pedonal.',
  'loja-comercial-centro-4',
  'loja',
  'arrendamento',
  NULL,
  1200.00,
  'Rua Augusta, 321',
  '1100-053',
  'Lisboa',
  'Lisboa',
  'Santa Maria Maior',
  60.00,
  60.00,
  NULL,
  NULL,
  NULL,
  1,
  0,
  3,
  TRUE,
  2000,
  'razoavel',
  'D',
  'norte',
  'pouca',
  'publicado',
  'publico',
  NOW() - INTERVAL '7 days',
  FALSE,
  FALSE,
  28,
  5,
  2
),

-- Imóvel 5: Escritório
(
  (SELECT id FROM users WHERE user_type = 'proprietario' LIMIT 1),
  'Escritório Moderno',
  'Escritório moderno com 120m², totalmente equipado. Localizado em edifício de escritórios com estacionamento e segurança 24h. Ideal para empresas em crescimento.',
  'escritorio-moderno-5',
  'escritorio',
  'venda_arrendamento',
  450000.00,
  2500.00,
  'Avenida da República, 654',
  '1050-190',
  'Lisboa',
  'Lisboa',
  'Avenidas Novas',
  120.00,
  120.00,
  NULL,
  NULL,
  2,
  1,
  8,
  15,
  TRUE,
  2018,
  'excelente',
  'A',
  'este',
  'muito_boa',
  'publicado',
  'premium',
  NOW() - INTERVAL '2 days',
  TRUE,
  TRUE,
  67,
  15,
  8
);

-- =============================================
-- 2. INSERIR MÍDIAS DE EXEMPLO
-- =============================================

-- Mídias para o Apartamento T2
INSERT INTO imoveis_media (imovel_id, tipo_media, nome_arquivo, caminho_arquivo, url_publica, largura, altura, ordem, categoria, descricao, principal, ativo) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'foto',
  'apartamento-sala.jpg',
  '/uploads/imoveis/apartamento-sala.jpg',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'interior',
  'Sala de estar ampla e moderna',
  TRUE,
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'foto',
  'apartamento-cozinha.jpg',
  '/uploads/imoveis/apartamento-cozinha.jpg',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
  800,
  600,
  2,
  'cozinha',
  'Cozinha equipada e funcional',
  FALSE,
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'foto',
  'apartamento-quarto.jpg',
  '/uploads/imoveis/apartamento-quarto.jpg',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  800,
  600,
  3,
  'quarto',
  'Quarto principal com roupeiro embutido',
  FALSE,
  TRUE
);

-- Mídias para a Casa T3
INSERT INTO imoveis_media (imovel_id, tipo_media, nome_arquivo, caminho_arquivo, url_publica, largura, altura, ordem, categoria, descricao, principal, ativo) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  'foto',
  'casa-exterior.jpg',
  '/uploads/imoveis/casa-exterior.jpg',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'exterior',
  'Fachada da casa com jardim',
  TRUE,
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  'foto',
  'casa-jardim.jpg',
  '/uploads/imoveis/casa-jardim.jpg',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
  800,
  600,
  2,
  'exterior',
  'Jardim privado com relvado',
  FALSE,
  TRUE
);

-- Mídias para o Terreno
INSERT INTO imoveis_media (imovel_id, tipo_media, nome_arquivo, caminho_arquivo, url_publica, largura, altura, ordem, categoria, descricao, principal, ativo) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'terreno-construcao-3'),
  'foto',
  'terreno-vista.jpg',
  '/uploads/imoveis/terreno-vista.jpg',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'exterior',
  'Vista geral do terreno',
  TRUE,
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'terreno-construcao-3'),
  'documento',
  'licenca-construcao.pdf',
  '/uploads/imoveis/licenca-construcao.pdf',
  'https://example.com/docs/licenca-construcao.pdf',
  NULL,
  NULL,
  2,
  'documento',
  'Licença de construção',
  FALSE,
  TRUE
);

-- =============================================
-- 3. INSERIR COMODIDADES DE EXEMPLO
-- =============================================

-- Comodidades para o Apartamento T2
INSERT INTO imoveis_amenities (imovel_id, categoria, nome, descricao, disponivel) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'exterior',
  'Varanda',
  'Varanda privada com vista para jardim',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'interior',
  'Roupeiro embutido',
  'Roupeiro embutido no quarto principal',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'aquecimento',
  'Aquecimento central',
  'Sistema de aquecimento central',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'estacionamento',
  'Garagem',
  'Garagem coberta no prédio',
  TRUE
);

-- Comodidades para a Casa T3
INSERT INTO imoveis_amenities (imovel_id, categoria, nome, descricao, disponivel) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  'exterior',
  'Jardim privado',
  'Jardim privado com relvado e árvores',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  'exterior',
  'Quintal',
  'Quintal com churrasqueira',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  'estacionamento',
  'Garagem dupla',
  'Garagem para 2 carros',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  'seguranca',
  'Alarme',
  'Sistema de alarme instalado',
  TRUE
);

-- =============================================
-- 4. INSERIR VISUALIZAÇÕES DE EXEMPLO
-- =============================================

-- Visualizações para o Apartamento T2
INSERT INTO imoveis_views (imovel_id, ip_address, user_agent, tipo_visualizacao, pais, regiao, cidade) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  '192.168.1.100',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'pagina',
  'Portugal',
  'Lisboa',
  'Lisboa'
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  '192.168.1.101',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'lista',
  'Portugal',
  'Lisboa',
  'Lisboa'
);

-- Visualizações para a Casa T3
INSERT INTO imoveis_views (imovel_id, ip_address, user_agent, tipo_visualizacao, pais, regiao, cidade) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  '192.168.1.102',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1) AppleWebKit/605.1.15',
  'pagina',
  'Portugal',
  'Lisboa',
  'Lisboa'
);

-- =============================================
-- 5. INSERIR FAVORITOS DE EXEMPLO
-- =============================================

-- Favoritos (assumindo que existem utilizadores)
INSERT INTO imoveis_favoritos (imovel_id, user_id) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  (SELECT id FROM users WHERE user_type = 'proprietario' LIMIT 1)
),
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-jardim-2'),
  (SELECT id FROM users WHERE user_type = 'proprietario' LIMIT 1)
);

-- =============================================
-- 6. INSERIR CONTATOS DE EXEMPLO
-- =============================================

-- Contatos para o Apartamento T2
INSERT INTO imoveis_contatos (imovel_id, nome, email, telefone, mensagem, tipo_interesse, status) VALUES
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'João Silva',
  'joao.silva@email.com',
  '+351 912 345 678',
  'Gostaria de agendar uma visita para ver o apartamento.',
  'visita',
  'pendente'
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-1'),
  'Maria Santos',
  'maria.santos@email.com',
  '+351 923 456 789',
  'Tem mais informações sobre o apartamento?',
  'informacao',
  'respondido'
);

-- =============================================
-- 7. VERIFICAÇÃO FINAL
-- =============================================

-- Verificar se os dados foram inseridos corretamente
DO $$
DECLARE
  imoveis_count INTEGER;
  media_count INTEGER;
  amenities_count INTEGER;
  views_count INTEGER;
  favoritos_count INTEGER;
  contatos_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO imoveis_count FROM imoveis;
  SELECT COUNT(*) INTO media_count FROM imoveis_media;
  SELECT COUNT(*) INTO amenities_count FROM imoveis_amenities;
  SELECT COUNT(*) INTO views_count FROM imoveis_views;
  SELECT COUNT(*) INTO favoritos_count FROM imoveis_favoritos;
  SELECT COUNT(*) INTO contatos_count FROM imoveis_contatos;
  
  RAISE NOTICE '✅ Dados de exemplo inseridos com sucesso:';
  RAISE NOTICE '   - Imóveis: %', imoveis_count;
  RAISE NOTICE '   - Mídias: %', media_count;
  RAISE NOTICE '   - Comodidades: %', amenities_count;
  RAISE NOTICE '   - Visualizações: %', views_count;
  RAISE NOTICE '   - Favoritos: %', favoritos_count;
  RAISE NOTICE '   - Contatos: %', contatos_count;
END $$;
