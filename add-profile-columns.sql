-- Adicionar colunas de perfil do Google à tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS foto_perfil TEXT,
ADD COLUMN IF NOT EXISTS primeiro_nome TEXT,
ADD COLUMN IF NOT EXISTS ultimo_nome TEXT,
ADD COLUMN IF NOT EXISTS nome_exibicao TEXT,
ADD COLUMN IF NOT EXISTS provedor TEXT,
ADD COLUMN IF NOT EXISTS provedor_id TEXT,
ADD COLUMN IF NOT EXISTS localizacao TEXT,
ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS dados_sociais JSONB;

-- Comentários para documentar as colunas
COMMENT ON COLUMN users.foto_perfil IS 'URL da foto de perfil do Google';
COMMENT ON COLUMN users.primeiro_nome IS 'Primeiro nome do usuário';
COMMENT ON COLUMN users.ultimo_nome IS 'Último nome do usuário';
COMMENT ON COLUMN users.nome_exibicao IS 'Nome de exibição completo';
COMMENT ON COLUMN users.provedor IS 'Provedor de autenticação (google, facebook, linkedin)';
COMMENT ON COLUMN users.provedor_id IS 'ID do usuário no provedor';
COMMENT ON COLUMN users.localizacao IS 'Localização/idioma do usuário';
COMMENT ON COLUMN users.email_verificado IS 'Se o email foi verificado pelo provedor';
COMMENT ON COLUMN users.dados_sociais IS 'Dados completos do provedor social em JSON';

-- Atualizar usuário existente com dados simulados
UPDATE users 
SET 
  foto_perfil = 'https://lh3.googleusercontent.com/a/ACg8ocK...',
  primeiro_nome = 'Luiz Eduardo',
  ultimo_nome = 'de Menescal Pinto Filho',
  nome_exibicao = 'Luiz Eduardo de Menescal Pinto Filho',
  provedor = 'google',
  provedor_id = '1234567890',
  localizacao = 'pt-BR',
  email_verificado = true,
  dados_sociais = '{
    "google_id": "1234567890",
    "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK...",
    "locale": "pt-BR",
    "verified_email": true,
    "raw_data": {
      "full_name": "Luiz Eduardo de Menescal Pinto Filho",
      "given_name": "Luiz Eduardo",
      "family_name": "de Menescal Pinto Filho",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocK...",
      "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK...",
      "locale": "pt-BR",
      "email_verified": true,
      "sub": "1234567890"
    }
  }'::jsonb
WHERE email = 'luizeduardompf@gmail.com';

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('foto_perfil', 'primeiro_nome', 'ultimo_nome', 'nome_exibicao', 'provedor', 'provedor_id', 'localizacao', 'email_verificado', 'dados_sociais')
ORDER BY column_name;
