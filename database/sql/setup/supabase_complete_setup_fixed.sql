-- =============================================
-- VENDEMOS SUA CASA - SETUP COMPLETO SUPABASE (CORRIGIDO)
-- =============================================
-- Execute este script completo no SQL Editor do Supabase
-- Data: 2024-10-12
-- Versão: 1.1 - Corrigido para evitar conflitos

-- =============================================
-- 1. TABELA PRINCIPAL DE UTILIZADORES
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
            -- 0 = Utilizador normal
            -- 1 = Admin básico
            -- 2 = Admin avançado  
            -- 3 = Super admin
            
            -- Dados fiscais
            nif VARCHAR(20) UNIQUE,
            tipo_pessoa VARCHAR(10) CHECK (tipo_pessoa IN ('singular', 'coletiva')),
            
            -- Dados profissionais (para agentes e imobiliárias)
            ami VARCHAR(20), -- Número AMI para agentes
            nome_empresa VARCHAR(255), -- Nome da empresa/imobiliária
            ami_empresa VARCHAR(20), -- AMI da empresa
            
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
        
        RAISE NOTICE 'Tabela users criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela users já existe, pulando criação';
    END IF;
END $$;

-- =============================================
-- 2. TABELA DE CONFIGURAÇÕES DE UTILIZADOR
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
        
        RAISE NOTICE 'Tabela user_settings criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela user_settings já existe, pulando criação';
    END IF;
END $$;

-- =============================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para a tabela users
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_nif ON users(nif);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Índices para a tabela user_settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- =============================================
-- 4. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para user_settings
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS nas tabelas
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
-- 6. FUNÇÕES AUXILIARES
-- =============================================

-- Função para criar perfil de usuário após registro
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (
        auth_user_id,
        email,
        nome_completo,
        user_type,
        is_verified,
        email_verified_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'proprietario'),
        NEW.email_confirmed_at IS NOT NULL,
        NEW.email_confirmed_at
    );
    
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
-- 7. DADOS INICIAIS (OPCIONAL)
-- =============================================

-- Inserir configurações padrão para usuários existentes (se houver)
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
-- 8. VERIFICAÇÕES FINAIS
-- =============================================

-- Verificar se as tabelas foram criadas corretamente
DO $$
BEGIN
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
    
    RAISE NOTICE '🎉 Setup completo executado com sucesso!';
END $$;
