-- =============================================
-- VENDEMOS SUA CASA - LIMPEZA DO SCHEMA DE IMÓVEIS
-- =============================================
-- Execute este script ANTES do EXECUTAR_IMOVEIS_COMPLETO.sql
-- Data: 2024-12-19
-- Versão: 1.0

-- =============================================
-- 1. REMOVER TRIGGERS
-- =============================================

DROP TRIGGER IF EXISTS trigger_update_imoveis_updated_at ON imoveis;
DROP TRIGGER IF EXISTS trigger_update_imoveis_media_updated_at ON imoveis_media;
DROP TRIGGER IF EXISTS trigger_update_imoveis_contatos_updated_at ON imoveis_contatos;

-- =============================================
-- 2. REMOVER FUNÇÕES
-- =============================================

DROP FUNCTION IF EXISTS update_imoveis_updated_at();
DROP FUNCTION IF EXISTS update_imoveis_media_updated_at();
DROP FUNCTION IF EXISTS update_imoveis_contatos_updated_at();
DROP FUNCTION IF EXISTS generate_imovel_slug(TEXT, UUID);
DROP FUNCTION IF EXISTS update_imovel_stats(UUID);

-- =============================================
-- 3. REMOVER VIEWS
-- =============================================

DROP VIEW IF EXISTS imoveis_completos CASCADE;
DROP VIEW IF EXISTS imoveis_publicos CASCADE;
DROP VIEW IF EXISTS imoveis_stats_proprietario CASCADE;

-- =============================================
-- 4. REMOVER TABELAS (EM ORDEM CORRETA)
-- =============================================

-- Remover tabelas dependentes primeiro
DROP TABLE IF EXISTS imoveis_contatos CASCADE;
DROP TABLE IF EXISTS imoveis_favoritos CASCADE;
DROP TABLE IF EXISTS imoveis_views CASCADE;
DROP TABLE IF EXISTS imoveis_amenities CASCADE;
DROP TABLE IF EXISTS imoveis_media CASCADE;

-- Remover tabela principal por último
DROP TABLE IF EXISTS imoveis CASCADE;

-- =============================================
-- 4.1. REMOVER USUÁRIOS DE EXEMPLO (OPCIONAL)
-- =============================================

-- Descomente as linhas abaixo se quiser remover os usuários de exemplo também
-- DELETE FROM users WHERE email IN (
--   'joao.silva@email.com',
--   'maria.santos@email.com', 
--   'carlos.oliveira@email.com',
--   'ana.costa@email.com',
--   'pedro.martins@email.com',
--   'sofia.rodrigues@email.com'
-- );

-- =============================================
-- 5. REMOVER ÍNDICES (SE EXISTIREM)
-- =============================================

-- Os índices serão removidos automaticamente com as tabelas
-- Mas podemos adicionar limpeza manual se necessário

-- =============================================
-- 6. VERIFICAÇÃO DE LIMPEZA
-- =============================================

DO $$
DECLARE
  table_count INTEGER;
  function_count INTEGER;
  trigger_count INTEGER;
  view_count INTEGER;
BEGIN
  -- Verificar tabelas
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name LIKE 'imoveis%';
  
  -- Verificar funções
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines 
  WHERE routine_schema = 'public' 
    AND routine_name LIKE '%imovel%';
  
  -- Verificar triggers
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers 
  WHERE trigger_schema = 'public' 
    AND trigger_name LIKE '%imovel%';
  
  -- Verificar views
  SELECT COUNT(*) INTO view_count
  FROM information_schema.views 
  WHERE table_schema = 'public' 
    AND table_name LIKE '%imovel%';
  
  RAISE NOTICE '🧹 Limpeza concluída:';
  RAISE NOTICE '   - Tabelas restantes: %', table_count;
  RAISE NOTICE '   - Funções restantes: %', function_count;
  RAISE NOTICE '   - Triggers restantes: %', trigger_count;
  RAISE NOTICE '   - Views restantes: %', view_count;
  
  IF table_count = 0 AND function_count = 0 AND trigger_count = 0 AND view_count = 0 THEN
    RAISE NOTICE '✅ Limpeza completa! Pode executar o EXECUTAR_IMOVEIS_COMPLETO.sql';
  ELSE
    RAISE NOTICE '⚠️ Ainda existem objetos relacionados a imóveis';
  END IF;
END $$;
