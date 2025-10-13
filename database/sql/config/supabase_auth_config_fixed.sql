-- =============================================
-- VENDEMOS SUA CASA - CONFIGURAÇÃO AUTH (CORRIGIDO)
-- =============================================
-- Este script documenta as configurações necessárias
-- As configurações devem ser feitas no Supabase Dashboard

-- =============================================
-- CONFIGURAÇÕES NECESSÁRIAS NO SUPABASE DASHBOARD
-- =============================================

-- 1. Acesse: https://supabase.com/dashboard/project/[seu-projeto]/auth/url-configuration
-- 2. Configure as seguintes URLs:

-- Site URL:
-- http://localhost:3000 (desenvolvimento)
-- https://seu-dominio.vercel.app (produção)

-- Redirect URLs:
-- http://localhost:3000/auth/callback
-- http://localhost:3000/auth/confirm
-- https://seu-dominio.vercel.app/auth/callback
-- https://seu-dominio.vercel.app/auth/confirm

-- =============================================
-- CONFIGURAÇÕES DE PROVIDERS (OAuth)
-- =============================================

-- 1. Acesse: https://supabase.com/dashboard/project/[seu-projeto]/auth/providers
-- 2. Configure os seguintes providers:

-- Google OAuth:
-- - Ativar Google provider
-- - Adicionar Client ID e Client Secret
-- - Redirect URL: http://localhost:3000/auth/callback

-- Facebook OAuth:
-- - Ativar Facebook provider
-- - Adicionar App ID e App Secret
-- - Redirect URL: http://localhost:3000/auth/callback

-- LinkedIn OAuth:
-- - Ativar LinkedIn provider
-- - Adicionar Client ID e Client Secret
-- - Redirect URL: http://localhost:3000/auth/callback

-- =============================================
-- CONFIGURAÇÕES DE EMAIL
-- =============================================

-- 1. Acesse: https://supabase.com/dashboard/project/[seu-projeto]/auth/settings
-- 2. Configure SMTP (opcional):

-- SMTP Host: smtp.gmail.com
-- SMTP Port: 587
-- SMTP User: seu-email@gmail.com
-- SMTP Pass: sua-senha-de-app

-- =============================================
-- VERIFICAÇÕES DE CONFIGURAÇÃO
-- =============================================

-- Verificar se as tabelas necessárias existem
DO $$
BEGIN
    -- Verificar tabela users
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE '✅ Tabela users: OK';
    ELSE
        RAISE NOTICE '❌ Tabela users: NÃO ENCONTRADA - Execute supabase_complete_setup_fixed.sql';
    END IF;
    
    -- Verificar tabela user_settings
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_settings') THEN
        RAISE NOTICE '✅ Tabela user_settings: OK';
    ELSE
        RAISE NOTICE '❌ Tabela user_settings: NÃO ENCONTRADA - Execute supabase_complete_setup_fixed.sql';
    END IF;
    
    -- Verificar funções de social login
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        RAISE NOTICE '✅ Função handle_new_user: OK';
    ELSE
        RAISE NOTICE '❌ Função handle_new_user: NÃO ENCONTRADA - Execute social_login_integration_fixed.sql';
    END IF;
    
    RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Configure as URLs no Supabase Dashboard';
    RAISE NOTICE '2. Configure os providers OAuth';
    RAISE NOTICE '3. Configure SMTP (opcional)';
    RAISE NOTICE '4. Teste o social login';
END $$;

-- =============================================
-- SCRIPT DE TESTE (OPCIONAL)
-- =============================================

-- Testar se as configurações estão funcionando
-- (Execute apenas após configurar tudo no Dashboard)

-- Verificar configurações de auth
SELECT 
    'Auth config check' as status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN 'Auth users table accessible'
        ELSE 'Auth users table not accessible'
    END as auth_status;

-- Verificar RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('users', 'user_settings')
ORDER BY tablename, policyname;
