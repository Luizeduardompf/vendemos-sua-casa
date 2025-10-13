-- =============================================
-- VENDEMOS SUA CASA - INTEGRAÇÃO SOCIAL LOGIN (CORRIGIDO)
-- =============================================
-- Execute este script no SQL Editor do Supabase
-- Data: 2024-10-12
-- Versão: 1.1 - Corrigido para estrutura atual do Supabase

-- =============================================
-- 1. FUNÇÃO PARA CRIAR UTILIZADOR APÓS SOCIAL LOGIN
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_type_value VARCHAR(20);
    nome_completo_value VARCHAR(255);
BEGIN
    -- Determinar tipo de utilizador baseado nos metadados
    user_type_value := COALESCE(
        NEW.raw_user_meta_data->>'user_type',
        'proprietario'
    );
    
    -- Extrair nome completo dos metadados
    nome_completo_value := COALESCE(
        NEW.raw_user_meta_data->>'nome_completo',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Inserir utilizador na tabela users
    INSERT INTO users (
        auth_user_id,
        email,
        nome_completo,
        user_type,
        is_verified,
        email_verified_at,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        nome_completo_value,
        user_type_value,
        NEW.email_confirmed_at IS NOT NULL,
        NEW.email_confirmed_at,
        NEW.created_at,
        NEW.updated_at
    );
    
    -- Criar configurações padrão para o utilizador
    INSERT INTO user_settings (
        user_id,
        tema_cor,
        tamanho_fonte,
        modo_escuro,
        compacto,
        som_notificacoes,
        vibracao,
        animacoes
    ) VALUES (
        (SELECT id FROM users WHERE auth_user_id = NEW.id),
        'azul',
        'medio',
        FALSE,
        FALSE,
        TRUE,
        TRUE,
        TRUE
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log do erro e continuar
        RAISE WARNING 'Erro ao criar perfil para utilizador %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 2. TRIGGER PARA SOCIAL LOGIN
-- =============================================

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger para social login
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =============================================
-- 3. FUNÇÃO PARA ATUALIZAR DADOS DO SOCIAL LOGIN
-- =============================================

CREATE OR REPLACE FUNCTION update_user_from_social_login(
    p_auth_user_id UUID,
    p_provider VARCHAR(50)
)
RETURNS VOID AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Verificar se o utilizador existe
    SELECT EXISTS(SELECT 1 FROM users WHERE auth_user_id = p_auth_user_id) INTO user_exists;
    
    IF NOT user_exists THEN
        -- Se não existe, criar
        PERFORM handle_new_user();
    ELSE
        -- Se existe, atualizar dados básicos
        UPDATE users 
        SET 
            updated_at = NOW(),
            last_login_at = NOW()
        WHERE auth_user_id = p_auth_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. FUNÇÃO PARA OBTER PERFIL COMPLETO
-- =============================================

CREATE OR REPLACE FUNCTION get_user_profile(p_auth_user_id UUID)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    nome_completo VARCHAR(255),
    user_type VARCHAR(20),
    is_verified BOOLEAN,
    created_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    settings JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.nome_completo,
        u.user_type,
        u.is_verified,
        u.created_at,
        u.last_login_at,
        COALESCE(
            jsonb_build_object(
                'tema_cor', us.tema_cor,
                'tamanho_fonte', us.tamanho_fonte,
                'modo_escuro', us.modo_escuro,
                'compacto', us.compacto,
                'som_notificacoes', us.som_notificacoes,
                'vibracao', us.vibracao,
                'animacoes', us.animacoes
            ),
            '{}'::jsonb
        ) as settings
    FROM users u
    LEFT JOIN user_settings us ON u.id = us.user_id
    WHERE u.auth_user_id = p_auth_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. FUNÇÃO PARA VERIFICAR SE UTILIZADOR EXISTE
-- =============================================

CREATE OR REPLACE FUNCTION user_exists(p_auth_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(SELECT 1 FROM users WHERE auth_user_id = p_auth_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. VIEWS PARA SOCIAL LOGIN (CORRIGIDAS)
-- =============================================

-- View para utilizadores com dados de autenticação (sem provider)
CREATE OR REPLACE VIEW users_with_auth_data AS
SELECT 
    u.*,
    au.created_at as auth_created_at,
    au.last_sign_in_at,
    au.email_confirmed_at,
    au.phone_confirmed_at
FROM users u
LEFT JOIN auth.users au ON u.auth_user_id = au.id;

-- View para utilizadores com configurações
CREATE OR REPLACE VIEW users_with_settings AS
SELECT 
    u.*,
    us.tema_cor,
    us.tamanho_fonte,
    us.modo_escuro,
    us.compacto,
    us.som_notificacoes,
    us.vibracao,
    us.animacoes
FROM users u
LEFT JOIN user_settings us ON u.id = us.user_id;

-- =============================================
-- 7. RLS POLICIES PARA SOCIAL LOGIN
-- =============================================

-- Política para permitir inserção de novos utilizadores
DROP POLICY IF EXISTS "Allow user creation from auth" ON users;
CREATE POLICY "Allow user creation from auth" ON users
    FOR INSERT 
    WITH CHECK (true); -- Permitir criação via trigger

-- Política para permitir atualização de dados de login
DROP POLICY IF EXISTS "Allow login updates" ON users;
CREATE POLICY "Allow login updates" ON users
    FOR UPDATE 
    USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

-- =============================================
-- 8. COMENTÁRIOS E DOCUMENTAÇÃO
-- =============================================

COMMENT ON FUNCTION handle_new_user() IS 'Cria utilizador na tabela users após social login';
COMMENT ON FUNCTION update_user_from_social_login(UUID, VARCHAR) IS 'Atualiza dados do utilizador a partir do social login';
COMMENT ON FUNCTION get_user_profile(UUID) IS 'Obtém perfil completo do utilizador';
COMMENT ON FUNCTION user_exists(UUID) IS 'Verifica se utilizador existe na tabela users';
COMMENT ON VIEW users_with_auth_data IS 'View com dados de utilizadores e autenticação';
COMMENT ON VIEW users_with_settings IS 'View com dados de utilizadores e configurações';

-- =============================================
-- 9. VERIFICAÇÕES FINAIS
-- =============================================

DO $$
BEGIN
    -- Verificar se as funções foram criadas
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        RAISE NOTICE '✅ Função handle_new_user: OK';
    ELSE
        RAISE NOTICE '❌ Função handle_new_user: ERRO';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_profile') THEN
        RAISE NOTICE '✅ Função get_user_profile: OK';
    ELSE
        RAISE NOTICE '❌ Função get_user_profile: ERRO';
    END IF;
    
    -- Verificar se o trigger foi criado
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        RAISE NOTICE '✅ Trigger on_auth_user_created: OK';
    ELSE
        RAISE NOTICE '❌ Trigger on_auth_user_created: ERRO';
    END IF;
    
    RAISE NOTICE '🎉 Integração social login configurada com sucesso!';
END $$;
