-- ========================================
-- SCRIPT PARA CRIAR TABELA user_settings
-- ========================================
-- Execute este script no SQL Editor do Supabase

-- 1. Remover tabela antiga se existir
DROP TABLE IF EXISTS user_configuracoes CASCADE;

-- 2. Criar nova tabela user_settings com campos individuais
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Configurações de Aparência
  modo_escuro BOOLEAN DEFAULT false,
  tema_cor VARCHAR(20) DEFAULT 'azul',
  tamanho_fonte VARCHAR(20) DEFAULT 'medio',
  compacto BOOLEAN DEFAULT false,
  animacoes BOOLEAN DEFAULT true,
  
  -- Configurações de Notificações
  notificacoes_email BOOLEAN DEFAULT true,
  notificacoes_push BOOLEAN DEFAULT true,
  notificacoes_sms BOOLEAN DEFAULT false,
  som_notificacoes BOOLEAN DEFAULT true,
  vibracao BOOLEAN DEFAULT true,
  
  -- Configurações de Idioma e Localização
  idioma VARCHAR(10) DEFAULT 'pt',
  fuso_horario VARCHAR(50) DEFAULT 'Europe/Lisbon',
  
  -- Configurações de Privacidade
  privacidade_perfil VARCHAR(20) DEFAULT 'publico',
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint única para garantir um registro por usuário
  CONSTRAINT user_settings_user_id_unique UNIQUE (user_id)
);

-- 3. Criar índices para performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_settings_modo_escuro ON user_settings(modo_escuro);
CREATE INDEX idx_user_settings_idioma ON user_settings(idioma);

-- 4. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- 5. Habilitar RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas RLS
-- Política para SELECT: usuários podem ver suas próprias configurações
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Política para INSERT: usuários podem criar suas próprias configurações
CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Política para UPDATE: usuários podem atualizar suas próprias configurações
CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Política para DELETE: usuários podem deletar suas próprias configurações
CREATE POLICY "Users can delete their own settings" ON user_settings
  FOR DELETE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- 7. Verificar se a tabela foi criada corretamente
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_settings' 
ORDER BY ordinal_position;

-- 8. Verificar políticas RLS
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_settings';

-- 9. Testar inserção (substitua USER_ID pelo ID real de um usuário)
-- INSERT INTO user_settings (user_id, modo_escuro, tema_cor, idioma) 
-- VALUES ('USER_ID_AQUI', true, 'verde', 'en') 
-- RETURNING *;
