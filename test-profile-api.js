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

async function testProfileAPI() {
  try {
    console.log('🔍 Testando API de perfil...');
    
    // Simular o token que seria salvo no localStorage
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      envVars.NEXT_PUBLIC_SUPABASE_URL,
      envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Buscar usuário diretamente
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'luizeduardompf@gmail.com')
      .single();
    
    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError);
      return;
    }
    
    console.log('📊 Dados do usuário encontrados:');
    console.log('foto_perfil:', userData.foto_perfil);
    console.log('primeiro_nome:', userData.primeiro_nome);
    console.log('ultimo_nome:', userData.ultimo_nome);
    console.log('provedor:', userData.provedor);
    console.log('email_verificado:', userData.email_verificado);
    
    // Simular a resposta da API
    const apiResponse = {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        nome_completo: userData.nome_completo,
        telefone: userData.telefone,
        user_type: userData.user_type,
        admin_level: userData.admin_level,
        is_verified: userData.is_verified,
        is_active: userData.is_active,
        nif: userData.nif,
        tipo_pessoa: userData.tipo_pessoa,
        ami: userData.ami,
        nome_empresa: userData.nome_empresa,
        ami_empresa: userData.ami_empresa,
        imobiliaria_id: userData.imobiliaria_id,
        morada: userData.morada,
        codigo_postal: userData.codigo_postal,
        localidade: userData.localidade,
        distrito: userData.distrito,
        aceita_termos: userData.aceita_termos,
        aceita_privacidade: userData.aceita_privacidade,
        aceita_marketing: userData.aceita_marketing,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        last_login: userData.last_login,
        // Novos campos do Google
        foto_perfil: userData.foto_perfil,
        primeiro_nome: userData.primeiro_nome,
        ultimo_nome: userData.ultimo_nome,
        nome_exibicao: userData.nome_exibicao,
        provedor: userData.provedor,
        provedor_id: userData.provedor_id,
        localizacao: userData.localizacao,
        email_verificado: userData.email_verificado,
        dados_sociais: userData.dados_sociais
      }
    };
    
    console.log('\n📊 Resposta da API simulada:');
    console.log('foto_perfil:', apiResponse.user.foto_perfil);
    console.log('primeiro_nome:', apiResponse.user.primeiro_nome);
    console.log('provedor:', apiResponse.user.provedor);
    
    // Verificar se a foto existe
    if (apiResponse.user.foto_perfil) {
      console.log('\n✅ Foto encontrada!');
      console.log('URL da foto:', apiResponse.user.foto_perfil);
      
      // Testar se a URL é válida
      try {
        const response = await fetch(apiResponse.user.foto_perfil);
        if (response.ok) {
          console.log('✅ URL da foto é válida e acessível');
        } else {
          console.log('❌ URL da foto não é acessível:', response.status);
        }
      } catch (error) {
        console.log('❌ Erro ao acessar URL da foto:', error.message);
      }
    } else {
      console.log('❌ Nenhuma foto encontrada');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testProfileAPI();
