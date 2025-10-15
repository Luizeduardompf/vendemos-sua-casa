-- =============================================
-- VENDEMOS SUA CASA - DADOS VARIADOS DE IMÓVEIS
-- =============================================
-- Execute este script após criar o schema de imóveis
-- Data: 2024-12-19
-- Versão: 1.0 - Variados para múltiplos proprietários

-- =============================================
-- 1. VERIFICAR E CRIAR PROPRIETÁRIOS DE EXEMPLO
-- =============================================

-- Criar proprietários de exemplo se não existirem
INSERT INTO users (
  auth_user_id,
  email,
  nome_completo,
  telefone,
  user_type,
  nif,
  tipo_pessoa,
  morada,
  codigo_postal,
  localidade,
  distrito,
  is_verified,
  is_active,
  aceita_termos,
  aceita_privacidade
) VALUES 
-- Proprietário 1: João Silva (Lisboa)
(
  gen_random_uuid(),
  'joao.silva@email.com',
  'João Silva',
  '+351 912 345 678',
  'proprietario',
  '123456789',
  'singular',
  'Rua das Flores, 123',
  '1000-001',
  'Lisboa',
  'Lisboa',
  TRUE,
  TRUE,
  TRUE,
  TRUE
),
-- Proprietário 2: Maria Santos (Porto)
(
  gen_random_uuid(),
  'maria.santos@email.com',
  'Maria Santos',
  '+351 923 456 789',
  'proprietario',
  '987654321',
  'singular',
  'Avenida da Boavista, 456',
  '4100-123',
  'Porto',
  'Porto',
  TRUE,
  TRUE,
  TRUE,
  TRUE
),
-- Proprietário 3: Carlos Oliveira (Coimbra)
(
  gen_random_uuid(),
  'carlos.oliveira@email.com',
  'Carlos Oliveira',
  '+351 934 567 890',
  'proprietario',
  '456789123',
  'singular',
  'Rua da Universidade, 789',
  '3000-456',
  'Coimbra',
  'Coimbra',
  TRUE,
  TRUE,
  TRUE,
  TRUE
),
-- Proprietário 4: Ana Costa (Braga)
(
  gen_random_uuid(),
  'ana.costa@email.com',
  'Ana Costa',
  '+351 945 678 901',
  'proprietario',
  '789123456',
  'singular',
  'Praça da República, 321',
  '4700-789',
  'Braga',
  'Braga',
  TRUE,
  TRUE,
  TRUE,
  TRUE
),
-- Proprietário 5: Pedro Martins (Faro)
(
  gen_random_uuid(),
  'pedro.martins@email.com',
  'Pedro Martins',
  '+351 956 789 012',
  'proprietario',
  '321654987',
  'singular',
  'Rua do Comércio, 654',
  '8000-321',
  'Faro',
  'Faro',
  TRUE,
  TRUE,
  TRUE,
  TRUE
),
-- Proprietário 6: Sofia Rodrigues (Aveiro)
(
  gen_random_uuid(),
  'sofia.rodrigues@email.com',
  'Sofia Rodrigues',
  '+351 967 890 123',
  'proprietario',
  '654987321',
  'singular',
  'Avenida Dr. Lourenço Peixinho, 987',
  '3800-654',
  'Aveiro',
  'Aveiro',
  TRUE,
  TRUE,
  TRUE,
  TRUE
)
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 2. INSERIR IMÓVEIS VARIADOS POR PROPRIETÁRIO
-- =============================================

-- IMÓVEIS DO JOÃO SILVA (Lisboa) - 4 imóveis
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
-- João Silva - Imóvel 1: Apartamento T2
(
  (SELECT id FROM users WHERE email = 'joao.silva@email.com'),
  'Apartamento T2 com Varanda',
  'Apartamento moderno com excelente localização, próximo ao centro da cidade. Possui 2 quartos, 1 casa de banho completa e varanda com vista para o jardim. Cozinha equipada e sala de estar ampla. Prédio com elevador e garagem.',
  'apartamento-t2-varanda-joao-1',
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
-- João Silva - Imóvel 2: Loja Comercial
(
  (SELECT id FROM users WHERE email = 'joao.silva@email.com'),
  'Loja Comercial no Centro Histórico',
  'Loja comercial no centro histórico de Lisboa, com 60m² de área útil. Ideal para comércio tradicional ou escritório. Zona de grande movimento pedonal e turístico.',
  'loja-centro-historico-joao-2',
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
-- João Silva - Imóvel 3: Garagem
(
  (SELECT id FROM users WHERE email = 'joao.silva@email.com'),
  'Garagem Coberta no Centro',
  'Garagem coberta no centro de Lisboa, ideal para apartamento. Localização privilegiada com fácil acesso. Segurança 24h.',
  'garagem-centro-joao-3',
  'garagem',
  'venda',
  45000.00,
  NULL,
  'Rua da Prata, 456',
  '1100-123',
  'Lisboa',
  'Lisboa',
  'Santa Maria Maior',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  -2,
  5,
  TRUE,
  2010,
  'bom',
  NULL,
  'norte',
  'pouca',
  'publicado',
  'publico',
  NOW() - INTERVAL '3 days',
  FALSE,
  FALSE,
  12,
  2,
  1
),
-- João Silva - Imóvel 4: Escritório
(
  (SELECT id FROM users WHERE email = 'joao.silva@email.com'),
  'Escritório Moderno com Vista',
  'Escritório moderno com 120m², totalmente equipado e com vista para o rio. Localizado em edifício de escritórios com estacionamento e segurança 24h. Ideal para empresas em crescimento.',
  'escritorio-vista-rio-joao-4',
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
),

-- IMÓVEIS DA MARIA SANTOS (Porto) - 5 imóveis
-- Maria Santos - Imóvel 1: Casa T4
(
  (SELECT id FROM users WHERE email = 'maria.santos@email.com'),
  'Casa T4 com Jardim Privado',
  'Moradia independente com 4 quartos, 3 casas de banho e jardim privado. Localizada em zona residencial calma do Porto, com excelente acessibilidade. Garagem para 2 carros e quintal. Ideal para famílias grandes.',
  'casa-t4-jardim-maria-1',
  'casa',
  'venda',
  420000.00,
  NULL,
  'Rua da Constituição, 789',
  '4200-123',
  'Porto',
  'Porto',
  'Cedofeita',
  180.00,
  160.00,
  300.00,
  4,
  3,
  1,
  0,
  0,
  FALSE,
  2012,
  'bom',
  'C',
  'oeste',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '6 days',
  TRUE,
  FALSE,
  52,
  12,
  6
),
-- Maria Santos - Imóvel 2: Apartamento T1
(
  (SELECT id FROM users WHERE email = 'maria.santos@email.com'),
  'Apartamento T1 Estudante',
  'Apartamento T1 ideal para estudantes, próximo à Universidade do Porto. Mobiliado e equipado. Zona com muitos transportes públicos.',
  'apartamento-t1-estudante-maria-2',
  'apartamento',
  'arrendamento',
  NULL,
  450.00,
  'Rua do Campo Alegre, 123',
  '4150-179',
  'Porto',
  'Porto',
  'Lordelo do Ouro',
  35.00,
  35.00,
  NULL,
  1,
  1,
  0,
  2,
  4,
  TRUE,
  2005,
  'razoavel',
  'D',
  'sul',
  'razoavel',
  'publicado',
  'publico',
  NOW() - INTERVAL '4 days',
  FALSE,
  FALSE,
  23,
  4,
  2
),
-- Maria Santos - Imóvel 3: Quinta
(
  (SELECT id FROM users WHERE email = 'maria.santos@email.com'),
  'Quinta com Casa de Campo',
  'Quinta com 2 hectares, casa de campo renovada e terreno agrícola. Ideal para turismo rural ou residência permanente. Localização privilegiada no Douro.',
  'quinta-casa-campo-maria-3',
  'quinta',
  'venda',
  280000.00,
  NULL,
  'Estrada Nacional 108, km 45',
  '5100-456',
  'Lamego',
  'Viseu',
  'Lamego',
  200.00,
  150.00,
  20000.00,
  3,
  2,
  1,
  0,
  0,
  FALSE,
  1980,
  'razoavel',
  'E',
  'sul',
  'muito_boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '8 days',
  FALSE,
  FALSE,
  18,
  3,
  1
),
-- Maria Santos - Imóvel 4: Armazém
(
  (SELECT id FROM users WHERE email = 'maria.santos@email.com'),
  'Armazém Industrial',
  'Armazém industrial com 500m², ideal para armazenamento ou pequena indústria. Localização estratégica com acesso fácil a autoestradas.',
  'armazem-industrial-maria-4',
  'armazem',
  'arrendamento',
  NULL,
  1800.00,
  'Zona Industrial de Perafita',
  '4465-123',
  'Matosinhos',
  'Porto',
  'Perafita',
  500.00,
  500.00,
  NULL,
  NULL,
  NULL,
  NULL,
  0,
  1,
  FALSE,
  1995,
  'razoavel',
  'F',
  'norte',
  'pouca',
  'publicado',
  'publico',
  NOW() - INTERVAL '10 days',
  FALSE,
  FALSE,
  8,
  1,
  0
),
-- Maria Santos - Imóvel 5: Villa
(
  (SELECT id FROM users WHERE email = 'maria.santos@email.com'),
  'Villa de Luxo com Piscina',
  'Villa de luxo com 5 quartos, 4 casas de banho, piscina privada e jardim paisagístico. Localizada em zona exclusiva do Porto. Vista panorâmica para o mar.',
  'villa-luxo-piscina-maria-5',
  'villa',
  'venda',
  850000.00,
  NULL,
  'Rua do Ouro, 999',
  '4150-789',
  'Porto',
  'Porto',
  'Foz do Douro',
  300.00,
  280.00,
  800.00,
  5,
  4,
  2,
  0,
  0,
  FALSE,
  2020,
  'excelente',
  'A+',
  'sul',
  'muito_boa',
  'publicado',
  'premium',
  NOW() - INTERVAL '1 day',
  TRUE,
  TRUE,
  89,
  25,
  12
),

-- IMÓVEIS DO CARLOS OLIVEIRA (Coimbra) - 3 imóveis
-- Carlos Oliveira - Imóvel 1: Apartamento T3
(
  (SELECT id FROM users WHERE email = 'carlos.oliveira@email.com'),
  'Apartamento T3 Universitário',
  'Apartamento T3 próximo à Universidade de Coimbra, ideal para estudantes ou jovens profissionais. Zona com muitos serviços e transportes.',
  'apartamento-t3-universitario-carlos-1',
  'apartamento',
  'arrendamento',
  NULL,
  650.00,
  'Rua da Sofia, 456',
  '3000-123',
  'Coimbra',
  'Coimbra',
  'Sé Nova',
  95.00,
  85.00,
  NULL,
  3,
  2,
  0,
  2,
  4,
  TRUE,
  2008,
  'bom',
  'C',
  'este',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '9 days',
  FALSE,
  FALSE,
  34,
  7,
  4
),
-- Carlos Oliveira - Imóvel 2: Casa T2
(
  (SELECT id FROM users WHERE email = 'carlos.oliveira@email.com'),
  'Casa T2 Renovada',
  'Casa T2 totalmente renovada, com acabamentos de qualidade. Jardim privado e garagem. Localização calma e familiar.',
  'casa-t2-renovada-carlos-2',
  'casa',
  'venda',
  180000.00,
  NULL,
  'Rua da Liberdade, 789',
  '3030-456',
  'Coimbra',
  'Coimbra',
  'Santo António dos Olivais',
  110.00,
  100.00,
  150.00,
  2,
  2,
  0,
  0,
  0,
  FALSE,
  2015,
  'excelente',
  'B',
  'sul',
  'muito_boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '11 days',
  FALSE,
  FALSE,
  27,
  5,
  3
),
-- Carlos Oliveira - Imóvel 3: Terreno
(
  (SELECT id FROM users WHERE email = 'carlos.oliveira@email.com'),
  'Terreno para Construção',
  'Terreno urbano com 800m², ideal para construção de moradia unifamiliar. Localizado em zona em expansão de Coimbra, com todas as infraestruturas.',
  'terreno-construcao-carlos-3',
  'terreno',
  'venda',
  95000.00,
  NULL,
  'Rua da Esperança, 321',
  '3040-789',
  'Coimbra',
  'Coimbra',
  'Santo António dos Olivais',
  NULL,
  NULL,
  800.00,
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
  NOW() - INTERVAL '12 days',
  FALSE,
  FALSE,
  15,
  2,
  1
),

-- IMÓVEIS DA ANA COSTA (Braga) - 4 imóveis
-- Ana Costa - Imóvel 1: Apartamento T2
(
  (SELECT id FROM users WHERE email = 'ana.costa@email.com'),
  'Apartamento T2 Moderno',
  'Apartamento T2 moderno com acabamentos de qualidade. Localização central em Braga, próximo a todos os serviços.',
  'apartamento-t2-moderno-ana-1',
  'apartamento',
  'venda',
  165000.00,
  NULL,
  'Rua do Souto, 123',
  '4700-123',
  'Braga',
  'Braga',
  'São José de São Lázaro',
  75.00,
  70.00,
  NULL,
  2,
  1,
  0,
  3,
  6,
  TRUE,
  2017,
  'excelente',
  'B',
  'oeste',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '13 days',
  FALSE,
  FALSE,
  31,
  6,
  3
),
-- Ana Costa - Imóvel 2: Casa T3
(
  (SELECT id FROM users WHERE email = 'ana.costa@email.com'),
  'Casa T3 com Quintal',
  'Casa T3 com quintal e garagem. Localização familiar em Braga. Ideal para famílias com crianças.',
  'casa-t3-quintal-ana-2',
  'casa',
  'venda',
  195000.00,
  NULL,
  'Rua da Liberdade, 456',
  '4710-456',
  'Braga',
  'Braga',
  'São Vicente',
  130.00,
  120.00,
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
  'sul',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '14 days',
  FALSE,
  FALSE,
  22,
  4,
  2
),
-- Ana Costa - Imóvel 3: Loja
(
  (SELECT id FROM users WHERE email = 'ana.costa@email.com'),
  'Loja Comercial no Centro',
  'Loja comercial no centro histórico de Braga. Ideal para comércio tradicional ou escritório.',
  'loja-centro-braga-ana-3',
  'loja',
  'arrendamento',
  NULL,
  800.00,
  'Rua do Anjo, 789',
  '4700-789',
  'Braga',
  'Braga',
  'São José de São Lázaro',
  45.00,
  45.00,
  NULL,
  NULL,
  NULL,
  1,
  0,
  2,
  TRUE,
  1990,
  'razoavel',
  'E',
  'norte',
  'pouca',
  'publicado',
  'publico',
  NOW() - INTERVAL '15 days',
  FALSE,
  FALSE,
  16,
  2,
  1
),
-- Ana Costa - Imóvel 4: Garagem
(
  (SELECT id FROM users WHERE email = 'ana.costa@email.com'),
  'Garagem no Centro',
  'Garagem coberta no centro de Braga. Localização privilegiada com fácil acesso.',
  'garagem-centro-braga-ana-4',
  'garagem',
  'venda',
  25000.00,
  NULL,
  'Rua da Misericórdia, 321',
  '4700-321',
  'Braga',
  'Braga',
  'São José de São Lázaro',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  -1,
  3,
  TRUE,
  2000,
  'bom',
  NULL,
  'norte',
  'pouca',
  'publicado',
  'publico',
  NOW() - INTERVAL '16 days',
  FALSE,
  FALSE,
  9,
  1,
  0
),

-- IMÓVEIS DO PEDRO MARTINS (Faro) - 4 imóveis
-- Pedro Martins - Imóvel 1: Apartamento T2
(
  (SELECT id FROM users WHERE email = 'pedro.martins@email.com'),
  'Apartamento T2 com Vista Mar',
  'Apartamento T2 com vista para o mar, localizado na zona histórica de Faro. Ideal para férias ou residência permanente.',
  'apartamento-t2-vista-mar-pedro-1',
  'apartamento',
  'venda_arrendamento',
  220000.00,
  900.00,
  'Rua da Liberdade, 123',
  '8000-123',
  'Faro',
  'Faro',
  'Sé',
  80.00,
  75.00,
  NULL,
  2,
  1,
  0,
  2,
  4,
  TRUE,
  2019,
  'excelente',
  'A',
  'sul',
  'muito_boa',
  'publicado',
  'premium',
  NOW() - INTERVAL '17 days',
  TRUE,
  TRUE,
  73,
  18,
  9
),
-- Pedro Martins - Imóvel 2: Casa T3
(
  (SELECT id FROM users WHERE email = 'pedro.martins@email.com'),
  'Casa T3 Algarve',
  'Casa T3 típica do Algarve, com pátio interior e azulejos tradicionais. Localização calma e familiar.',
  'casa-t3-algarve-pedro-2',
  'casa',
  'venda',
  185000.00,
  NULL,
  'Rua da Igreja, 456',
  '8000-456',
  'Faro',
  'Faro',
  'Sé',
  120.00,
  110.00,
  180.00,
  3,
  2,
  1,
  0,
  0,
  FALSE,
  2014,
  'bom',
  'C',
  'sul',
  'muito_boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '18 days',
  FALSE,
  FALSE,
  41,
  8,
  4
),
-- Pedro Martins - Imóvel 3: Terreno
(
  (SELECT id FROM users WHERE email = 'pedro.martins@email.com'),
  'Terreno com Vista Mar',
  'Terreno com vista para o mar, ideal para construção de villa. Localização privilegiada no Algarve.',
  'terreno-vista-mar-pedro-3',
  'terreno',
  'venda',
  320000.00,
  NULL,
  'Estrada da Praia, km 2',
  '8200-123',
  'Albufeira',
  'Faro',
  'Albufeira',
  NULL,
  NULL,
  1200.00,
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
  'premium',
  NOW() - INTERVAL '19 days',
  TRUE,
  TRUE,
  56,
  12,
  6
),
-- Pedro Martins - Imóvel 4: Loja
(
  (SELECT id FROM users WHERE email = 'pedro.martins@email.com'),
  'Loja na Zona Turística',
  'Loja na zona turística de Faro, ideal para comércio ou restaurante. Grande movimento de turistas.',
  'loja-zona-turistica-pedro-4',
  'loja',
  'arrendamento',
  NULL,
  1100.00,
  'Rua de Santo António, 789',
  '8000-789',
  'Faro',
  'Faro',
  'Sé',
  55.00,
  55.00,
  NULL,
  NULL,
  NULL,
  1,
  0,
  2,
  TRUE,
  1985,
  'razoavel',
  'D',
  'sul',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '20 days',
  FALSE,
  FALSE,
  29,
  5,
  2
),

-- IMÓVEIS DA SOFIA RODRIGUES (Aveiro) - 3 imóveis
-- Sofia Rodrigues - Imóvel 1: Apartamento T2
(
  (SELECT id FROM users WHERE email = 'sofia.rodrigues@email.com'),
  'Apartamento T2 com Varanda',
  'Apartamento T2 com varanda e vista para os canais de Aveiro. Localização central e moderna.',
  'apartamento-t2-varanda-sofia-1',
  'apartamento',
  'venda',
  175000.00,
  NULL,
  'Rua Dr. Barbosa de Magalhães, 123',
  '3800-123',
  'Aveiro',
  'Aveiro',
  'Glória e Vera Cruz',
  85.00,
  80.00,
  NULL,
  2,
  1,
  0,
  4,
  8,
  TRUE,
  2016,
  'excelente',
  'B',
  'oeste',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '21 days',
  FALSE,
  FALSE,
  38,
  7,
  3
),
-- Sofia Rodrigues - Imóvel 2: Casa T3
(
  (SELECT id FROM users WHERE email = 'sofia.rodrigues@email.com'),
  'Casa T3 com Jardim',
  'Casa T3 com jardim privado e garagem. Localização familiar em Aveiro.',
  'casa-t3-jardim-sofia-2',
  'casa',
  'venda',
  210000.00,
  NULL,
  'Rua da Paz, 456',
  '3810-456',
  'Aveiro',
  'Aveiro',
  'Nariz',
  140.00,
  130.00,
  250.00,
  3,
  2,
  1,
  0,
  0,
  FALSE,
  2011,
  'bom',
  'C',
  'sul',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '22 days',
  FALSE,
  FALSE,
  25,
  4,
  2
),
-- Sofia Rodrigues - Imóvel 3: Escritório
(
  (SELECT id FROM users WHERE email = 'sofia.rodrigues@email.com'),
  'Escritório Moderno',
  'Escritório moderno com 90m², totalmente equipado. Localização central em Aveiro.',
  'escritorio-moderno-sofia-3',
  'escritorio',
  'arrendamento',
  NULL,
  1200.00,
  'Avenida Dr. Lourenço Peixinho, 789',
  '3800-789',
  'Aveiro',
  'Aveiro',
  'Glória e Vera Cruz',
  90.00,
  90.00,
  NULL,
  NULL,
  1,
  1,
  5,
  10,
  TRUE,
  2018,
  'excelente',
  'A',
  'este',
  'boa',
  'publicado',
  'publico',
  NOW() - INTERVAL '23 days',
  FALSE,
  FALSE,
  19,
  3,
  1
);

-- =============================================
-- 3. INSERIR MÍDIAS VARIADAS
-- =============================================

-- Mídias para alguns imóveis selecionados
INSERT INTO imoveis_media (imovel_id, tipo_media, nome_arquivo, caminho_arquivo, url_publica, largura, altura, ordem, categoria, descricao, principal, ativo) VALUES
-- Apartamento T2 do João
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-joao-1'),
  'foto',
  'apartamento-sala-joao.jpg',
  '/uploads/imoveis/apartamento-sala-joao.jpg',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'interior',
  'Sala de estar ampla e moderna',
  TRUE,
  TRUE
),
-- Casa T4 da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t4-jardim-maria-1'),
  'foto',
  'casa-exterior-maria.jpg',
  '/uploads/imoveis/casa-exterior-maria.jpg',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'exterior',
  'Fachada da casa com jardim',
  TRUE,
  TRUE
),
-- Villa de Luxo da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'villa-luxo-piscina-maria-5'),
  'foto',
  'villa-exterior-maria.jpg',
  '/uploads/imoveis/villa-exterior-maria.jpg',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'exterior',
  'Villa de luxo com piscina',
  TRUE,
  TRUE
),
-- Apartamento T2 da Ana
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-moderno-ana-1'),
  'foto',
  'apartamento-moderno-ana.jpg',
  '/uploads/imoveis/apartamento-moderno-ana.jpg',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'interior',
  'Apartamento moderno e elegante',
  TRUE,
  TRUE
),
-- Apartamento T2 do Pedro
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-vista-mar-pedro-1'),
  'foto',
  'apartamento-vista-mar-pedro.jpg',
  '/uploads/imoveis/apartamento-vista-mar-pedro.jpg',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  800,
  600,
  1,
  'exterior',
  'Apartamento com vista para o mar',
  TRUE,
  TRUE
);

-- =============================================
-- 4. INSERIR COMODIDADES VARIADAS
-- =============================================

-- Comodidades para alguns imóveis
INSERT INTO imoveis_amenities (imovel_id, categoria, nome, descricao, disponivel) VALUES
-- Apartamento T2 do João
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-joao-1'),
  'exterior',
  'Varanda',
  'Varanda privada com vista para jardim',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-joao-1'),
  'interior',
  'Roupeiro embutido',
  'Roupeiro embutido no quarto principal',
  TRUE
),
-- Casa T4 da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t4-jardim-maria-1'),
  'exterior',
  'Jardim privado',
  'Jardim privado com relvado e árvores',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t4-jardim-maria-1'),
  'exterior',
  'Garagem dupla',
  'Garagem para 2 carros',
  TRUE
),
-- Villa de Luxo da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'villa-luxo-piscina-maria-5'),
  'exterior',
  'Piscina privada',
  'Piscina privada com sistema de aquecimento',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'villa-luxo-piscina-maria-5'),
  'exterior',
  'Jardim paisagístico',
  'Jardim paisagístico com sistema de rega automático',
  TRUE
),
-- Apartamento T2 do Pedro
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-vista-mar-pedro-1'),
  'exterior',
  'Vista mar',
  'Vista panorâmica para o mar',
  TRUE
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-vista-mar-pedro-1'),
  'interior',
  'Ar condicionado',
  'Sistema de ar condicionado central',
  TRUE
);

-- =============================================
-- 5. INSERIR VISUALIZAÇÕES VARIADAS
-- =============================================

-- Visualizações para alguns imóveis
INSERT INTO imoveis_views (imovel_id, ip_address, user_agent, tipo_visualizacao, pais, regiao, cidade) VALUES
-- Apartamento T2 do João
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-joao-1'),
  '192.168.1.100',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'pagina',
  'Portugal',
  'Lisboa',
  'Lisboa'
),
-- Casa T4 da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t4-jardim-maria-1'),
  '192.168.1.101',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'pagina',
  'Portugal',
  'Porto',
  'Porto'
),
-- Villa de Luxo da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'villa-luxo-piscina-maria-5'),
  '192.168.1.102',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1) AppleWebKit/605.1.15',
  'pagina',
  'Portugal',
  'Porto',
  'Porto'
),
-- Apartamento T2 do Pedro
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-vista-mar-pedro-1'),
  '192.168.1.103',
  'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
  'pagina',
  'Portugal',
  'Faro',
  'Faro'
);

-- =============================================
-- 6. INSERIR FAVORITOS VARIADOS
-- =============================================

-- Favoritos distribuídos entre proprietários
INSERT INTO imoveis_favoritos (imovel_id, user_id) VALUES
-- João favorita imóveis de outros proprietários
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t4-jardim-maria-1'),
  (SELECT id FROM users WHERE email = 'joao.silva@email.com')
),
(
  (SELECT id FROM imoveis WHERE slug = 'villa-luxo-piscina-maria-5'),
  (SELECT id FROM users WHERE email = 'joao.silva@email.com')
),
-- Maria favorita imóveis de outros proprietários
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-joao-1'),
  (SELECT id FROM users WHERE email = 'maria.santos@email.com')
),
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-vista-mar-pedro-1'),
  (SELECT id FROM users WHERE email = 'maria.santos@email.com')
),
-- Carlos favorita imóveis de outros proprietários
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-moderno-ana-1'),
  (SELECT id FROM users WHERE email = 'carlos.oliveira@email.com')
),
-- Ana favorita imóveis de outros proprietários
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t3-universitario-carlos-1'),
  (SELECT id FROM users WHERE email = 'ana.costa@email.com')
),
-- Pedro favorita imóveis de outros proprietários
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t3-renovada-carlos-2'),
  (SELECT id FROM users WHERE email = 'pedro.martins@email.com')
),
-- Sofia favorita imóveis de outros proprietários
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-vista-mar-pedro-1'),
  (SELECT id FROM users WHERE email = 'sofia.rodrigues@email.com')
);

-- =============================================
-- 7. INSERIR CONTATOS VARIADOS
-- =============================================

-- Contatos distribuídos entre imóveis
INSERT INTO imoveis_contatos (imovel_id, nome, email, telefone, mensagem, tipo_interesse, status) VALUES
-- Contatos para Apartamento T2 do João
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-varanda-joao-1'),
  'António Silva',
  'antonio.silva@email.com',
  '+351 911 222 333',
  'Gostaria de agendar uma visita para ver o apartamento.',
  'visita',
  'pendente'
),
-- Contatos para Casa T4 da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'casa-t4-jardim-maria-1'),
  'Isabel Santos',
  'isabel.santos@email.com',
  '+351 922 333 444',
  'Tem mais informações sobre a casa?',
  'informacao',
  'respondido'
),
-- Contatos para Villa de Luxo da Maria
(
  (SELECT id FROM imoveis WHERE slug = 'villa-luxo-piscina-maria-5'),
  'Roberto Costa',
  'roberto.costa@email.com',
  '+351 933 444 555',
  'Interessado na villa. Qual o preço final?',
  'proposta',
  'pendente'
),
-- Contatos para Apartamento T2 do Pedro
(
  (SELECT id FROM imoveis WHERE slug = 'apartamento-t2-vista-mar-pedro-1'),
  'Carla Mendes',
  'carla.mendes@email.com',
  '+351 944 555 666',
  'Gostaria de ver o apartamento com vista mar.',
  'visita',
  'pendente'
);

-- =============================================
-- 8. VERIFICAÇÃO FINAL
-- =============================================

-- Verificar se os dados foram inseridos corretamente
DO $$
DECLARE
  proprietarios_count INTEGER;
  imoveis_count INTEGER;
  media_count INTEGER;
  amenities_count INTEGER;
  views_count INTEGER;
  favoritos_count INTEGER;
  contatos_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO proprietarios_count FROM users WHERE user_type = 'proprietario';
  SELECT COUNT(*) INTO imoveis_count FROM imoveis;
  SELECT COUNT(*) INTO media_count FROM imoveis_media;
  SELECT COUNT(*) INTO amenities_count FROM imoveis_amenities;
  SELECT COUNT(*) INTO views_count FROM imoveis_views;
  SELECT COUNT(*) INTO favoritos_count FROM imoveis_favoritos;
  SELECT COUNT(*) INTO contatos_count FROM imoveis_contatos;
  
  RAISE NOTICE '✅ Dados variados inseridos com sucesso:';
  RAISE NOTICE '   - Proprietários: %', proprietarios_count;
  RAISE NOTICE '   - Imóveis: %', imoveis_count;
  RAISE NOTICE '   - Mídias: %', media_count;
  RAISE NOTICE '   - Comodidades: %', amenities_count;
  RAISE NOTICE '   - Visualizações: %', views_count;
  RAISE NOTICE '   - Favoritos: %', favoritos_count;
  RAISE NOTICE '   - Contatos: %', contatos_count;
  
  -- Mostrar distribuição por proprietário
  RAISE NOTICE '';
  RAISE NOTICE '📊 Distribuição de imóveis por proprietário:';
  FOR rec IN 
    SELECT u.nome_completo, COUNT(i.id) as total_imoveis
    FROM users u
    LEFT JOIN imoveis i ON u.id = i.proprietario_id
    WHERE u.user_type = 'proprietario'
    GROUP BY u.id, u.nome_completo
    ORDER BY total_imoveis DESC
  LOOP
    RAISE NOTICE '   - %: % imóveis', rec.nome_completo, rec.total_imoveis;
  END LOOP;
END $$;
