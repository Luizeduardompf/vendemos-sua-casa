-- Atualizar usuário existente com dados de perfil
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
