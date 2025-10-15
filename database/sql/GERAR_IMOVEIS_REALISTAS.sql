-- =============================================
-- VENDEMOS SUA CASA - SCRIPT DE IMÓVEIS REALISTAS
-- =============================================
-- Gera imóveis realistas com dados e fotos únicas
-- 6 imóveis por usuário proprietário existente
-- Data: 2024-12-19

-- =============================================
-- 1. LIMPAR DADOS EXISTENTES
-- =============================================

-- Limpar dados existentes
DELETE FROM imoveis_media WHERE imovel_id IN (SELECT id FROM imoveis);
DELETE FROM imoveis_amenities WHERE imovel_id IN (SELECT id FROM imoveis);
DELETE FROM imoveis_contatos WHERE imovel_id IN (SELECT id FROM imoveis);
DELETE FROM imoveis_favoritos WHERE imovel_id IN (SELECT id FROM imoveis);
DELETE FROM imoveis_views WHERE imovel_id IN (SELECT id FROM imoveis);
DELETE FROM imoveis;

-- =============================================
-- 2. DADOS REALISTAS DE IMÓVEIS
-- =============================================

-- Dados de apartamentos
INSERT INTO imoveis (
  proprietario_id, imovel_id, titulo, descricao, slug, tipo_imovel, categoria,
  preco_venda, preco_arrendamento, morada, codigo_postal, localidade, distrito, freguesia,
  area_total, area_util, area_terreno, quartos, casas_banho, wc, andar, total_andares,
  elevador, ano_construcao, estado_conservacao, certificado_energetico, orientacao,
  exposicao_solar, status, visibilidade, destaque, premium, visualizacoes, favoritos, contactos
) 
SELECT 
  u.id,
  'APT' || LPAD((ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) + 100)::text, 3, '0'),
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'Apartamento T2 com Varanda - Centro Histórico'
    WHEN 1 THEN 'Apartamento T3 Moderno - Avenidas Novas'
    WHEN 2 THEN 'Apartamento T1 Renovado - Príncipe Real'
    WHEN 3 THEN 'Apartamento T4 de Luxo - Lapa'
    WHEN 4 THEN 'Apartamento T2 com Terraço - Chiado'
    WHEN 5 THEN 'Apartamento T3 Premium - Estrela'
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'Apartamento completamente renovado no coração do centro histórico de Lisboa. Com 2 quartos, sala ampla e varanda com vista para o rio Tejo. Excelente localização com transportes públicos à porta.'
    WHEN 1 THEN 'Apartamento moderno nas Avenidas Novas com 3 quartos e acabamentos de qualidade. Próximo do metro e com todas as comodidades. Ideal para família.'
    WHEN 2 THEN 'Apartamento T1 totalmente renovado no Príncipe Real. Com design contemporâneo e acabamentos de luxo. Localização privilegiada no centro da cidade.'
    WHEN 3 THEN 'Apartamento de luxo na Lapa com 4 quartos e vista panorâmica. Acabamentos premium e localização exclusiva. Ideal para quem procura conforto e elegância.'
    WHEN 4 THEN 'Apartamento T2 com terraço privado no Chiado. Com vista para o rio e acabamentos modernos. Localização central com fácil acesso a transportes.'
    WHEN 5 THEN 'Apartamento premium na Estrela com 3 quartos e acabamentos de luxo. Vista para o jardim e localização privilegiada.'
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'apartamento-t2-varanda-centro-historico-APT' || LPAD((ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) + 100)::text, 3, '0')
    WHEN 1 THEN 'apartamento-t3-moderno-avenidas-novas-APT' || LPAD((ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) + 100)::text, 3, '0')
    WHEN 2 THEN 'apartamento-t1-renovado-principe-real-APT' || LPAD((ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) + 100)::text, 3, '0')
    WHEN 3 THEN 'apartamento-t4-luxo-lapa-APT' || LPAD((ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) + 100)::text, 3, '0')
    WHEN 4 THEN 'apartamento-t2-terraco-chiado-APT' || LPAD((ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) + 100)::text, 3, '0')
    WHEN 5 THEN 'apartamento-t3-premium-estrela-APT' || LPAD((ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) + 100)::text, 3, '0')
  END,
  'apartamento',
  'venda',
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 280000
    WHEN 1 THEN 450000
    WHEN 2 THEN 320000
    WHEN 3 THEN 750000
    WHEN 4 THEN 380000
    WHEN 5 THEN 520000
  END,
  NULL,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'Rua da Alfândega, 45'
    WHEN 1 THEN 'Avenida de Roma, 123'
    WHEN 2 THEN 'Rua da Escola Politécnica, 78'
    WHEN 3 THEN 'Rua de São Bento, 156'
    WHEN 4 THEN 'Rua Garrett, 89'
    WHEN 5 THEN 'Rua da Estrela, 234'
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN '1100-001'
    WHEN 1 THEN '1000-001'
    WHEN 2 THEN '1200-001'
    WHEN 3 THEN '1200-001'
    WHEN 4 THEN '1200-001'
    WHEN 5 THEN '1200-001'
  END,
  'Lisboa',
  'Lisboa',
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'Alfama'
    WHEN 1 THEN 'Avenidas Novas'
    WHEN 2 THEN 'Príncipe Real'
    WHEN 3 THEN 'Lapa'
    WHEN 4 THEN 'Chiado'
    WHEN 5 THEN 'Estrela'
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 75
    WHEN 1 THEN 95
    WHEN 2 THEN 55
    WHEN 3 THEN 140
    WHEN 4 THEN 80
    WHEN 5 THEN 110
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 70
    WHEN 1 THEN 90
    WHEN 2 THEN 50
    WHEN 3 THEN 130
    WHEN 4 THEN 75
    WHEN 5 THEN 105
  END,
  NULL,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 2
    WHEN 1 THEN 3
    WHEN 2 THEN 1
    WHEN 3 THEN 4
    WHEN 4 THEN 2
    WHEN 5 THEN 3
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 1
    WHEN 1 THEN 2
    WHEN 2 THEN 1
    WHEN 3 THEN 3
    WHEN 4 THEN 2
    WHEN 5 THEN 2
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 0
    WHEN 1 THEN 0
    WHEN 2 THEN 0
    WHEN 3 THEN 1
    WHEN 4 THEN 0
    WHEN 5 THEN 0
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 3
    WHEN 1 THEN 2
    WHEN 2 THEN 4
    WHEN 3 THEN 1
    WHEN 4 THEN 2
    WHEN 5 THEN 2
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 4
    WHEN 1 THEN 6
    WHEN 2 THEN 5
    WHEN 3 THEN 8
    WHEN 4 THEN 4
    WHEN 5 THEN 6
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN true
    WHEN 1 THEN true
    WHEN 2 THEN false
    WHEN 3 THEN true
    WHEN 4 THEN true
    WHEN 5 THEN true
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 2015
    WHEN 1 THEN 2020
    WHEN 2 THEN 2018
    WHEN 3 THEN 2022
    WHEN 4 THEN 2019
    WHEN 5 THEN 2021
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'excelente'
    WHEN 1 THEN 'muito_bom'
    WHEN 2 THEN 'excelente'
    WHEN 3 THEN 'excelente'
    WHEN 4 THEN 'muito_bom'
    WHEN 5 THEN 'excelente'
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'B'
    WHEN 1 THEN 'A'
    WHEN 2 THEN 'B+'
    WHEN 3 THEN 'A+'
    WHEN 4 THEN 'B'
    WHEN 5 THEN 'A'
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'sul'
    WHEN 1 THEN 'norte'
    WHEN 2 THEN 'oeste'
    WHEN 3 THEN 'sul'
    WHEN 4 THEN 'este'
    WHEN 5 THEN 'norte'
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN 'manha'
    WHEN 1 THEN 'tarde'
    WHEN 2 THEN 'manha'
    WHEN 3 THEN 'manha'
    WHEN 4 THEN 'tarde'
    WHEN 5 THEN 'manha'
  END,
  'publicado',
  'publico',
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN false
    WHEN 1 THEN false
    WHEN 2 THEN true
    WHEN 3 THEN true
    WHEN 4 THEN false
    WHEN 5 THEN false
  END,
  CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.id) % 6)
    WHEN 0 THEN false
    WHEN 1 THEN false
    WHEN 2 THEN false
    WHEN 3 THEN true
    WHEN 4 THEN false
    WHEN 5 THEN false
  END,
  FLOOR(RANDOM() * 1000) + 50,
  FLOOR(RANDOM() * 50) + 5,
  FLOOR(RANDOM() * 20) + 2
FROM users u 
WHERE u.user_type = 'proprietario'
ORDER BY u.id;

-- =============================================
-- 3. INSERIR MÍDIAS REALISTAS
-- =============================================

-- Fotos realistas para apartamentos
INSERT INTO imoveis_media (imovel_id, url_publica, tipo_media, descricao, ordem, principal)
SELECT 
  i.id,
  CASE (ROW_NUMBER() OVER (PARTITION BY i.id ORDER BY i.id) % 6)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    WHEN 5 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
  END,
  'foto',
  'Foto principal do apartamento',
  1,
  true
FROM imoveis i
WHERE i.tipo_imovel = 'apartamento';

-- Fotos adicionais para cada apartamento
INSERT INTO imoveis_media (imovel_id, url_publica, tipo_media, descricao, ordem, principal)
SELECT 
  i.id,
  CASE (ROW_NUMBER() OVER (PARTITION BY i.id ORDER BY i.id) % 4)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
  END,
  'foto',
  'Sala de estar',
  2,
  false
FROM imoveis i
WHERE i.tipo_imovel = 'apartamento';

INSERT INTO imoveis_media (imovel_id, url_publica, tipo_media, descricao, ordem, principal)
SELECT 
  i.id,
  CASE (ROW_NUMBER() OVER (PARTITION BY i.id ORDER BY i.id) % 4)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
  END,
  'foto',
  'Quarto principal',
  3,
  false
FROM imoveis i
WHERE i.tipo_imovel = 'apartamento';

-- =============================================
-- 4. INSERIR COMODIDADES
-- =============================================

-- Comodidades para apartamentos
INSERT INTO imoveis_amenities (imovel_id, nome_amenity, valor)
SELECT 
  i.id,
  'Elevador',
  'Sim'
FROM imoveis i
WHERE i.elevador = true;

INSERT INTO imoveis_amenities (imovel_id, nome_amenity, valor)
SELECT 
  i.id,
  'Varanda',
  'Sim'
FROM imoveis i
WHERE i.tipo_imovel = 'apartamento';

INSERT INTO imoveis_amenities (imovel_id, nome_amenity, valor)
SELECT 
  i.id,
  'Ar Condicionado',
  'Sim'
FROM imoveis i
WHERE i.tipo_imovel = 'apartamento';

INSERT INTO imoveis_amenities (imovel_id, nome_amenity, valor)
SELECT 
  i.id,
  'Aquecimento Central',
  'Sim'
FROM imoveis i
WHERE i.tipo_imovel = 'apartamento';

INSERT INTO imoveis_amenities (imovel_id, nome_amenity, valor)
SELECT 
  i.id,
  'Internet',
  'Fibra óptica'
FROM imoveis i
WHERE i.tipo_imovel = 'apartamento';

-- =============================================
-- 5. ATUALIZAR SLUGS COM IDS CORRETOS
-- =============================================

UPDATE imoveis 
SET slug = titulo || '-' || imovel_id
WHERE imovel_id IS NOT NULL;

-- =============================================
-- 6. VERIFICAR RESULTADOS
-- =============================================

SELECT 
  'Imóveis criados: ' || COUNT(*) as resultado
FROM imoveis;

SELECT 
  'Mídias criadas: ' || COUNT(*) as resultado
FROM imoveis_media;

SELECT 
  'Comodidades criadas: ' || COUNT(*) as resultado
FROM imoveis_amenities;
