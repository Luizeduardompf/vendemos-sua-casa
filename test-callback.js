const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Carregar variáveis de ambiente
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key] = valueParts.join('=');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🔍 Testando callback manualmente...');

// Simular dados do Google OAuth
const mockGoogleData = {
  email: 'luizeduardompf@gmail.com',
  user_metadata: {
    full_name: 'Luiz Eduardo de Menescal Pinto Filho',
    given_name: 'Luiz Eduardo',
    family_name: 'de Menescal Pinto Filho',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocK...',
    avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocK...',
    locale: 'pt-BR',
    email_verified: true,
    sub: '1234567890'
  }
};

console.log('📊 Dados simulados do Google:');
console.log(JSON.stringify(mockGoogleData, null, 2));

// Testar se conseguimos atualizar o usuário
async function testUpdateUser() {
  try {
    console.log('🔵 Testando atualização do usuário...');
    
    const updateData = {
      foto_perfil: mockGoogleData.user_metadata.avatar_url || mockGoogleData.user_metadata.picture,
      primeiro_nome: mockGoogleData.user_metadata.given_name,
      ultimo_nome: mockGoogleData.user_metadata.family_name,
      nome_exibicao: mockGoogleData.user_metadata.full_name,
      provedor: 'google',
      provedor_id: mockGoogleData.user_metadata.sub,
      localizacao: mockGoogleData.user_metadata.locale,
      email_verificado: mockGoogleData.user_metadata.email_verified,
      dados_sociais: {
        google_id: mockGoogleData.user_metadata.sub,
        avatar_url: mockGoogleData.user_metadata.avatar_url || mockGoogleData.user_metadata.picture,
        locale: mockGoogleData.user_metadata.locale,
        verified_email: mockGoogleData.user_metadata.email_verified,
        raw_data: mockGoogleData.user_metadata
      }
    };
    
    console.log('🔵 Dados para atualizar:', JSON.stringify(updateData, null, 2));
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', mockGoogleData.email)
      .select();
    
    if (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
    } else {
      console.log('✅ Usuário atualizado com sucesso:', data);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testUpdateUser();
