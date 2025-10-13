const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Carregar variáveis de ambiente manualmente
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key] = valueParts.join('=');
  }
});

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', envVars.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key length:', envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
console.log('Key starts with:', envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Testar conexão
supabase.from('users').select('count').then(({ data, error, count }) => {
  if (error) {
    console.log('❌ Erro ao conectar:', error.message);
    console.log('Detalhes do erro:', error);
  } else {
    console.log('✅ Conexão bem-sucedida!');
    console.log('Total de usuários:', count);
  }
}).catch(err => {
  console.log('❌ Erro geral:', err.message);
});
