-- Criar tabela para configurações do utilizador
CREATE TABLE IF NOT EXISTS user_configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  configuracoes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_configuracoes_user_id ON user_configuracoes(user_id);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_user_configuracoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_configuracoes_updated_at
  BEFORE UPDATE ON user_configuracoes
  FOR EACH ROW
  EXECUTE FUNCTION update_user_configuracoes_updated_at();

-- Políticas RLS (Row Level Security)
ALTER TABLE user_configuracoes ENABLE ROW LEVEL SECURITY;

-- Política para permitir que utilizadores vejam apenas suas próprias configurações
CREATE POLICY "Utilizadores podem ver suas próprias configurações" ON user_configuracoes
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Política para permitir que utilizadores atualizem suas próprias configurações
CREATE POLICY "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Política para permitir que utilizadores criem suas próprias configurações
CREATE POLICY "Utilizadores podem criar suas próprias configurações" ON user_configuracoes
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Comentários na tabela
COMMENT ON TABLE user_configuracoes IS 'Armazena as configurações personalizadas de cada utilizador';
COMMENT ON COLUMN user_configuracoes.user_id IS 'ID do utilizador (referência para users.id)';
COMMENT ON COLUMN user_configuracoes.configuracoes IS 'Configurações em formato JSON (modo escuro, notificações, etc.)';
COMMENT ON COLUMN user_configuracoes.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN user_configuracoes.updated_at IS 'Data da última atualização do registro';
