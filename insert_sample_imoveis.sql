-- Inserir dados de exemplo de imóveis
INSERT INTO imoveis (proprietario_id, titulo, descricao, slug, tipo_imovel, categoria, preco_venda, morada, codigo_postal, localidade, distrito, freguesia, area_total, area_util, quartos, casas_banho, status, visibilidade) 
SELECT 
  u.id, 
  'Apartamento T2 com Varanda', 
  'Apartamento moderno com excelente localização', 
  'apartamento-t2-varanda-1', 
  'apartamento', 
  'venda', 
  250000, 
  'Rua das Flores, 123', 
  '1000-001', 
  'Lisboa', 
  'Lisboa', 
  'Santo António', 
  85, 
  85, 
  2, 
  1, 
  'publicado', 
  'publico' 
FROM users u 
WHERE u.user_type = 'proprietario' 
LIMIT 1;

INSERT INTO imoveis (proprietario_id, titulo, descricao, slug, tipo_imovel, categoria, preco_venda, morada, codigo_postal, localidade, distrito, freguesia, area_total, area_util, quartos, casas_banho, status, visibilidade) 
SELECT 
  u.id, 
  'Casa T3 com Jardim', 
  'Casa espaçosa com jardim privado', 
  'casa-t3-jardim-1', 
  'casa', 
  'venda', 
  350000, 
  'Rua da Paz, 456', 
  '1000-002', 
  'Lisboa', 
  'Lisboa', 
  'Campo de Ourique', 
  120, 
  100, 
  3, 
  2, 
  'publicado', 
  'publico' 
FROM users u 
WHERE u.user_type = 'proprietario' 
LIMIT 1;

-- Inserir mídias para os imóveis
INSERT INTO imoveis_media (imovel_id, url_publica, tipo_media, descricao, ordem, principal) 
SELECT 
  i.id, 
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', 
  'foto', 
  'Foto principal do imóvel', 
  1, 
  true 
FROM imoveis i;
