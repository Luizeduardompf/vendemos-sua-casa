-- =============================================
-- VENDEMOS SUA CASA - EXECUÇÃO COMPLETA DO SCHEMA DE IMÓVEIS
-- =============================================
-- Execute este script no SQL Editor do Supabase
-- Data: 2024-12-19
-- Versão: 1.0

-- =============================================
-- INSTRUÇÕES DE EXECUÇÃO
-- =============================================
-- 1. Execute este script completo no SQL Editor do Supabase
-- 2. Verifique se não há erros na execução
-- 3. Confirme que todas as tabelas foram criadas
-- 4. Os dados de exemplo serão inseridos automaticamente

-- =============================================
-- 1. CRIAR SCHEMA DE IMÓVEIS
-- =============================================

-- Executar o schema completo de imóveis
\i database/sql/setup/create_imoveis_schema.sql

-- =============================================
-- 2. INSERIR DADOS DE EXEMPLO
-- =============================================

-- Executar dados de exemplo
\i database/sql/setup/insert_imoveis_sample_data.sql

-- =============================================
-- 3. VERIFICAÇÃO FINAL
-- =============================================

-- Verificar estrutura das tabelas
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name LIKE 'imoveis%'
ORDER BY table_name, ordinal_position;

-- Verificar dados inseridos
SELECT 
  'imoveis' as tabela,
  COUNT(*) as registos
FROM imoveis
UNION ALL
SELECT 
  'imoveis_media' as tabela,
  COUNT(*) as registos
FROM imoveis_media
UNION ALL
SELECT 
  'imoveis_amenities' as tabela,
  COUNT(*) as registos
FROM imoveis_amenities
UNION ALL
SELECT 
  'imoveis_views' as tabela,
  COUNT(*) as registos
FROM imoveis_views
UNION ALL
SELECT 
  'imoveis_favoritos' as tabela,
  COUNT(*) as registos
FROM imoveis_favoritos
UNION ALL
SELECT 
  'imoveis_contatos' as tabela,
  COUNT(*) as registos
FROM imoveis_contatos;

-- =============================================
-- 4. MENSAGEM DE SUCESSO
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '🎉 SCHEMA DE IMÓVEIS CRIADO COM SUCESSO!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tabelas criadas:';
  RAISE NOTICE '   ✅ imoveis - Tabela principal de imóveis';
  RAISE NOTICE '   ✅ imoveis_media - Mídias dos imóveis';
  RAISE NOTICE '   ✅ imoveis_amenities - Comodidades';
  RAISE NOTICE '   ✅ imoveis_views - Visualizações';
  RAISE NOTICE '   ✅ imoveis_favoritos - Favoritos';
  RAISE NOTICE '   ✅ imoveis_contatos - Contatos';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Dados de exemplo inseridos:';
  RAISE NOTICE '   🏠 5 imóveis de exemplo';
  RAISE NOTICE '   📸 Mídias e fotos';
  RAISE NOTICE '   ⭐ Comodidades e características';
  RAISE NOTICE '   👀 Visualizações e estatísticas';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 O sistema está pronto para uso!';
END $$;
