-- =============================================
-- INTEGRAÇÃO SOCIAL LOGIN COM TABELA USERS
-- =============================================

-- Função para criar utilizador após social login
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_type_param VARCHAR(20) := 'proprietario'; -- Default
  user_email VARCHAR(255);
  user_name VARCHAR(255);
  user_phone VARCHAR(20);
BEGIN
  -- Obter dados do utilizador autenticado
  user_email := NEW.email;
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Utilizador');
  user_phone := NEW.raw_user_meta_data->>'phone_number';
  
  -- Inserir na tabela users
  INSERT INTO public.users (
    auth_user_id,
    email,
    nome_completo,
    telefone,
    user_type,
    is_verified,
    is_active,
    aceita_termos,
    aceita_privacidade,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    user_email,
    user_name,
    user_phone,
    user_type_param,
    TRUE, -- Social login é automaticamente verificado
    TRUE,
    TRUE, -- Assumir que aceita termos ao usar social login
    TRUE, -- Assumir que aceita privacidade ao usar social login
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar após criação de utilizador no auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- FUNÇÕES PARA GESTÃO DE SOCIAL LOGIN
-- =============================================

-- Função para atualizar dados do utilizador após social login
CREATE OR REPLACE FUNCTION update_user_from_social_login(
  auth_user_id_param UUID,
  user_type_param VARCHAR(20) DEFAULT 'proprietario'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Obter dados do auth.users
  SELECT 
    email,
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'Utilizador') as full_name,
    raw_user_meta_data->>'phone_number' as phone
  INTO user_record
  FROM auth.users 
  WHERE id = auth_user_id_param;
  
  -- Verificar se o utilizador existe na tabela users
  IF NOT EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth_user_id_param) THEN
    -- Criar novo utilizador
    INSERT INTO users (
      auth_user_id,
      email,
      nome_completo,
      telefone,
      user_type,
      is_verified,
      is_active,
      aceita_termos,
      aceita_privacidade,
      created_at,
      updated_at
    ) VALUES (
      auth_user_id_param,
      user_record.email,
      user_record.full_name,
      user_record.phone,
      user_type_param,
      TRUE,
      TRUE,
      TRUE,
      TRUE,
      NOW(),
      NOW()
    );
  ELSE
    -- Atualizar utilizador existente
    UPDATE users SET
      email = user_record.email,
      nome_completo = user_record.full_name,
      telefone = COALESCE(user_record.phone, telefone),
      updated_at = NOW()
    WHERE auth_user_id = auth_user_id_param;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter dados completos do utilizador
CREATE OR REPLACE FUNCTION get_user_profile(auth_user_id_param UUID)
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  nome_completo VARCHAR(255),
  telefone VARCHAR(20),
  user_type VARCHAR(20),
  admin_level INTEGER,
  is_verified BOOLEAN,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.nome_completo,
    u.telefone,
    u.user_type,
    u.admin_level,
    u.is_verified,
    u.is_active,
    u.created_at
  FROM users u
  WHERE u.auth_user_id = auth_user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RLS PARA SOCIAL LOGIN
-- =============================================

-- Política: Utilizadores podem ver o seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Política: Utilizadores podem atualizar o seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- =============================================
-- VIEWS PARA SOCIAL LOGIN
-- =============================================

-- View para utilizadores com dados de social login
CREATE VIEW users_with_social_data AS
SELECT 
  u.*,
  au.provider,
  au.created_at as auth_created_at,
  au.last_sign_in_at
FROM users u
LEFT JOIN auth.users au ON u.auth_user_id = au.id;

-- =============================================
-- COMENTÁRIOS
-- =============================================

COMMENT ON FUNCTION handle_new_user() IS 'Cria utilizador na tabela users após social login';
COMMENT ON FUNCTION update_user_from_social_login(UUID, VARCHAR) IS 'Atualiza dados do utilizador a partir do social login';
COMMENT ON FUNCTION get_user_profile(UUID) IS 'Obtém perfil completo do utilizador';
