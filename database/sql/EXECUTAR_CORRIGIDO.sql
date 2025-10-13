-- =============================================
-- VENDEMOS SUA CASA - EXECUÇÃO CORRIGIDA
-- =============================================
-- Execute este script no Supabase SQL Editor
-- Data: 2024-10-12
-- Versão: 1.1 - Corrigido para resolver erros

-- =============================================
-- INSTRUÇÕES DE EXECUÇÃO
-- =============================================

-- 1. Execute este script completo no SQL Editor do Supabase
-- 2. Configure as URLs no Dashboard (veja comentários abaixo)
-- 3. Configure os providers OAuth no Dashboard
-- 4. Teste o social login

-- =============================================
-- PARTE 1: SETUP PRINCIPAL (CORRIGIDO)
-- =============================================

-- Verificar se a tabela users existe e criar/atualizar conforme necessário
DO $$ 
BEGIN
    -- Se a tabela não existe, criar
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            -- Identificação
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            
            -- Dados básicos
            email VARCHAR(255) UNIQUE NOT NULL,
            nome_completo VARCHAR(255) NOT NULL,
            telefone VARCHAR(20),
            
            -- Tipo de utilizador
            user_type VARCHAR(20) NOT NULL CHECK (user_type IN (
                'proprietario', 'construtor', 'agente', 'imobiliaria', 
                'admin', 'super_admin', 'support'
            )),
            
            -- Níveis de acesso admin
            admin_level INTEGER DEFAULT 0 CHECK (admin_level >= 0 AND admin_level <= 3),
            
            -- Dados fiscais
            nif VARCHAR(20) UNIQUE,
            tipo_pessoa VARCHAR(10) CHECK (tipo_pessoa IN ('singular', 'coletiva')),
            
            -- Dados profissionais (para agentes e imobiliárias)
            ami VARCHAR(20),
            nome_empresa VARCHAR(255),
            ami_empresa VARCHAR(20),
            
            -- Endereço
            morada TEXT,
            codigo_postal VARCHAR(10),
            localidade VARCHAR(100),
            distrito VARCHAR(50),
            
            -- Preferências
            aceita_marketing BOOLEAN DEFAULT FALSE,
            aceita_newsletter BOOLEAN DEFAULT FALSE,
            
            -- Status
            is_verified BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            email_verified_at TIMESTAMPTZ,
            
            -- Timestamps
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            last_login_at TIMESTAMPTZ
        );
        
        RAISE NOTICE '✅ Tabela users criada com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️ Tabela users já existe, pulando criação';
    END IF;
END $$;

-- =============================================
-- PARTE 2: TABELA DE CONFIGURAÇÕES
-- =============================================

-- Verificar se a tabela user_settings existe e criar/atualizar conforme necessário
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_settings') THEN
        CREATE TABLE user_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            
            -- Configurações de aparência
            tema_cor VARCHAR(20) DEFAULT 'azul' CHECK (tema_cor IN ('azul', 'verde', 'roxo', 'laranja', 'vermelho')),
            tamanho_fonte VARCHAR(10) DEFAULT 'medio' CHECK (tamanho_fonte IN ('pequeno', 'medio', 'grande')),
            modo_escuro BOOLEAN DEFAULT FALSE,
            compacto BOOLEAN DEFAULT FALSE,
            
            -- Configurações de notificações
            som_notificacoes BOOLEAN DEFAULT TRUE,
            vibracao BOOLEAN DEFAULT TRUE,
            
            -- Configurações de sistema
            animacoes BOOLEAN DEFAULT TRUE,
            
            -- Timestamps
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        RAISE NOTICE '✅ Tabela user_settings criada com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️ Tabela user_settings já existe, pulando criação';
    END IF;
END $$;

-- =============================================
-- PARTE 3: ÍNDICES E TRIGGERS
-- =============================================

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_nif ON users(nif);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualização automática
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PARTE 4: ROW LEVEL SECURITY
-- =============================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Políticas para user_settings
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

-- =============================================
-- PARTE 5: FUNÇÕES DE SOCIAL LOGIN
-- =============================================

-- Função para criar perfil de usuário após registro
CREATE OR REPLACE FUNCTION create_user_profile()
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
        RAISE WARNING 'Erro ao criar perfil para utilizador %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- =============================================
-- PARTE 6: CONFIGURAÇÕES PADRÃO
-- =============================================

-- Inserir configurações padrão para usuários existentes
INSERT INTO user_settings (user_id, tema_cor, tamanho_fonte, modo_escuro, compacto, som_notificacoes, vibracao, animacoes)
SELECT 
    u.id,
    'azul',
    'medio',
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    TRUE
FROM users u
LEFT JOIN user_settings us ON u.id = us.user_id
WHERE us.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- PARTE 7: VERIFICAÇÕES FINAIS
-- =============================================

DO $$
BEGIN
    -- Verificar tabelas
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE '✅ Tabela users: OK';
    ELSE
        RAISE NOTICE '❌ Tabela users: ERRO';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_settings') THEN
        RAISE NOTICE '✅ Tabela user_settings: OK';
    ELSE
        RAISE NOTICE '❌ Tabela user_settings: ERRO';
    END IF;
    
    -- Verificar funções
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_user_profile') THEN
        RAISE NOTICE '✅ Função create_user_profile: OK';
    ELSE
        RAISE NOTICE '❌ Função create_user_profile: ERRO';
    END IF;
    
    -- Verificar trigger
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        RAISE NOTICE '✅ Trigger on_auth_user_created: OK';
    ELSE
        RAISE NOTICE '❌ Trigger on_auth_user_created: ERRO';
    END IF;
    
    RAISE NOTICE '🎉 Setup completo executado com sucesso!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Configure as URLs no Supabase Dashboard:';
    RAISE NOTICE '   - Site URL: http://localhost:3000';
    RAISE NOTICE '   - Redirect URLs: http://localhost:3000/auth/callback';
    RAISE NOTICE '2. Configure os providers OAuth (Google, Facebook, LinkedIn)';
    RAISE NOTICE '3. Teste o social login em http://localhost:3000/auth/login';
END $$;
