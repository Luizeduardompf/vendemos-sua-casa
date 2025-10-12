-- =============================================
-- POLÍTICAS RLS CORRIGIDAS
-- =============================================

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
