#!/bin/bash

echo "🔧 Configurando banco de dados..."

# Aguardar o container estar pronto
echo "⏳ Aguardando container estar pronto..."
sleep 5

# Executar SQL diretamente no container
echo "📝 Executando SQL para criar tabela de configurações..."

docker exec -i vendemos-sua-casa-app sh -c '
# Instalar postgresql-client se não estiver disponível
if ! command -v psql &> /dev/null; then
    echo "Instalando postgresql-client..."
    apk add --no-cache postgresql-client
fi

# Executar SQL
psql -h host.docker.internal -p 54322 -U postgres -d postgres << EOF
-- Criar tabela para configurações do utilizador
CREATE TABLE IF NOT EXISTS user_configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  configuracoes JSONB NOT NULL DEFAULT '\''{}'\'',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_configuracoes_user_id ON user_configuracoes(user_id);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_user_configuracoes_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_configuracoes_updated_at ON user_configuracoes;
CREATE TRIGGER trigger_update_user_configuracoes_updated_at
  BEFORE UPDATE ON user_configuracoes
  FOR EACH ROW
  EXECUTE FUNCTION update_user_configuracoes_updated_at();

-- Políticas RLS (Row Level Security)
ALTER TABLE user_configuracoes ENABLE ROW LEVEL SECURITY;

-- Política para permitir que utilizadores vejam apenas suas próprias configurações
DROP POLICY IF EXISTS "Utilizadores podem ver suas próprias configurações" ON user_configuracoes;
CREATE POLICY "Utilizadores podem ver suas próprias configurações" ON user_configuracoes
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Política para permitir que utilizadores atualizem suas próprias configurações
DROP POLICY IF EXISTS "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes;
CREATE POLICY "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Política para permitir que utilizadores criem suas próprias configurações
DROP POLICY IF EXISTS "Utilizadores podem criar suas próprias configurações" ON user_configuracoes;
CREATE POLICY "Utilizadores podem criar suas próprias configurações" ON user_configuracoes
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Comentários na tabela
COMMENT ON TABLE user_configuracoes IS '\''Armazena as configurações personalizadas de cada utilizador'\'';
COMMENT ON COLUMN user_configuracoes.user_id IS '\''ID do utilizador (referência para users.id)'\'';
COMMENT ON COLUMN user_configuracoes.configuracoes IS '\''Configurações em formato JSON (modo escuro, notificações, etc.)'\'';
COMMENT ON COLUMN user_configuracoes.created_at IS '\''Data de criação do registro'\'';
COMMENT ON COLUMN user_configuracoes.updated_at IS '\''Data da última atualização do registro'\'';

SELECT '\''Tabela user_configuracoes criada com sucesso!'\'' as status;
EOF
'

if [ $? -eq 0 ]; then
    echo "✅ Tabela user_configuracoes criada com sucesso!"
else
    echo "❌ Erro ao criar tabela user_configuracoes"
    exit 1
fi

echo "🎉 Configuração do banco de dados concluída!"
