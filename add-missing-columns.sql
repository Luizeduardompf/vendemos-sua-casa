-- Adicionar colunas de perfil do Google à tabela users
ALTER TABLE users 
ADD COLUMN foto_perfil TEXT,
ADD COLUMN primeiro_nome TEXT,
ADD COLUMN ultimo_nome TEXT,
ADD COLUMN nome_exibicao TEXT,
ADD COLUMN provedor TEXT,
ADD COLUMN provedor_id TEXT,
ADD COLUMN localizacao TEXT,
ADD COLUMN email_verificado BOOLEAN DEFAULT false,
ADD COLUMN dados_sociais JSONB;
