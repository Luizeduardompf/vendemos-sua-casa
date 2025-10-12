-- =============================================
-- VENDEMOS SUA CASA - SCHEMA DE USERS
-- =============================================

-- Tabela principal de utilizadores
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
  -- 1 = Admin básico (relatórios, suporte)
  -- 2 = Admin avançado (gestão de utilizadores, comissões)
  -- 3 = Super Admin (acesso total, configurações)
  
  -- Permissões específicas
  permissions JSONB DEFAULT '{}',
  
  -- Dados específicos por tipo
  nif VARCHAR(9) UNIQUE,
  tipo_pessoa VARCHAR(10) CHECK (tipo_pessoa IN ('singular', 'construtor')),
  ami VARCHAR(20),
  imobiliaria_id UUID REFERENCES users(id),
  nome_empresa VARCHAR(255),
  ami_empresa VARCHAR(20),
  
  -- Status e validação
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN GENERATED ALWAYS AS (admin_level > 0) STORED,
  
  -- Dados de contacto
  morada TEXT,
  codigo_postal VARCHAR(8),
  localidade VARCHAR(100),
  distrito VARCHAR(50),
  
  -- Preferências
  aceita_termos BOOLEAN DEFAULT FALSE,
  aceita_privacidade BOOLEAN DEFAULT FALSE,
  aceita_marketing BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Índices para performance
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_nif ON users(nif);
CREATE INDEX idx_users_ami ON users(ami);
CREATE INDEX idx_users_imobiliaria_id ON users(imobiliaria_id);
CREATE INDEX idx_users_is_verified ON users(is_verified);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_admin_level ON users(admin_level);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Ativar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Utilizadores podem ver apenas os seus próprios dados
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Política: Admins podem ver todos os utilizadores
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
        AND admin_level >= 1
    )
  );

-- Política: Utilizadores podem atualizar apenas os seus próprios dados
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Política: Super admins podem atualizar qualquer utilizador
CREATE POLICY "Super admins can update any user" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
        AND admin_level >= 3
    )
  );

-- Política: Utilizadores podem inserir apenas os seus próprios dados
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Política: Admins podem inserir novos utilizadores
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
        AND admin_level >= 2
    )
  );

-- Política: Agentes podem ver dados da sua imobiliária
CREATE POLICY "Agents can view agency data" ON users
  FOR SELECT USING (
    auth.uid() = auth_user_id OR 
    (user_type = 'agente' AND imobiliaria_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    ))
  );

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para proprietários ativos
CREATE VIEW proprietarios_ativos AS
SELECT * FROM users 
WHERE user_type = 'proprietario' 
  AND is_active = TRUE 
  AND is_verified = TRUE;

-- View para agentes por imobiliária
CREATE VIEW agentes_por_imobiliaria AS
SELECT 
  a.*,
  i.nome_empresa as imobiliaria_nome
FROM users a
LEFT JOIN users i ON a.imobiliaria_id = i.id
WHERE a.user_type = 'agente' 
  AND a.is_active = TRUE;

-- View para dashboard admin
CREATE VIEW admin_dashboard AS
SELECT 
  user_type,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_verified = TRUE) as verified_users,
  COUNT(*) FILTER (WHERE is_active = TRUE) as active_users,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d
FROM users
GROUP BY user_type;

-- View para utilizadores pendentes de aprovação
CREATE VIEW users_pending_approval AS
SELECT * FROM users 
WHERE is_verified = FALSE 
  AND user_type IN ('proprietario', 'imobiliaria', 'agente')
ORDER BY created_at DESC;

-- =============================================
-- FUNÇÕES DE ADMIN
-- =============================================

-- Função para aprovar utilizador
CREATE OR REPLACE FUNCTION approve_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o utilizador atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_user_id = auth.uid() 
      AND admin_level >= 2
  ) THEN
    RAISE EXCEPTION 'Acesso negado: necessita permissão de admin';
  END IF;
  
  -- Aprovar utilizador
  UPDATE users 
  SET is_verified = TRUE, updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para desativar utilizador
CREATE OR REPLACE FUNCTION deactivate_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o utilizador atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_user_id = auth.uid() 
      AND admin_level >= 2
  ) THEN
    RAISE EXCEPTION 'Acesso negado: necessita permissão de admin';
  END IF;
  
  -- Desativar utilizador
  UPDATE users 
  SET is_active = FALSE, updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para promover utilizador a admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_uuid UUID, new_admin_level INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o utilizador atual é super admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_user_id = auth.uid() 
      AND admin_level >= 3
  ) THEN
    RAISE EXCEPTION 'Acesso negado: necessita permissão de super admin';
  END IF;
  
  -- Verificar se o nível é válido
  IF new_admin_level < 1 OR new_admin_level > 3 THEN
    RAISE EXCEPTION 'Nível de admin inválido: deve ser entre 1 e 3';
  END IF;
  
  -- Promover utilizador
  UPDATE users 
  SET 
    admin_level = new_admin_level,
    user_type = CASE 
      WHEN new_admin_level = 3 THEN 'super_admin'
      WHEN new_admin_level >= 1 THEN 'admin'
      ELSE user_type
    END,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Inserir super admin inicial (será criado após o primeiro utilizador se registar)
-- Este utilizador deve ser promovido manualmente via função promote_to_admin

-- =============================================
-- COMENTÁRIOS
-- =============================================

COMMENT ON TABLE users IS 'Tabela principal de utilizadores do sistema Vendemos Sua Casa';
COMMENT ON COLUMN users.user_type IS 'Tipo de utilizador: proprietario, construtor, agente, imobiliaria, admin, super_admin, support';
COMMENT ON COLUMN users.admin_level IS 'Nível de acesso admin: 0=normal, 1=básico, 2=avançado, 3=super';
COMMENT ON COLUMN users.is_admin IS 'Campo calculado: true se admin_level > 0';
COMMENT ON COLUMN users.permissions IS 'Permissões específicas em formato JSON';
