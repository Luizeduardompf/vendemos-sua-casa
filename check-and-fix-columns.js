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

async function checkAndFixColumns() {
  try {
    console.log('🔍 Verificando colunas da tabela users...');
    
    // Verificar se as colunas existem
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'users' });
    
    if (columnsError) {
      console.log('⚠️ Não foi possível verificar colunas via RPC, tentando método alternativo...');
      
      // Tentar fazer uma query simples para ver quais colunas existem
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('❌ Erro ao verificar tabela:', testError);
        return;
      }
      
      console.log('✅ Colunas existentes na tabela users:');
      console.log(Object.keys(testData[0] || {}));
      
      // Verificar se as colunas que precisamos existem
      const existingColumns = Object.keys(testData[0] || {});
      const neededColumns = [
        'foto_perfil', 'primeiro_nome', 'ultimo_nome', 'nome_exibicao', 
        'provedor', 'provedor_id', 'localizacao', 'email_verificado', 'dados_sociais'
      ];
      
      const missingColumns = neededColumns.filter(col => !existingColumns.includes(col));
      
      if (missingColumns.length > 0) {
        console.log('❌ Colunas que faltam:', missingColumns);
        console.log('📝 Execute o script SQL no Supabase Dashboard para adicionar as colunas.');
      } else {
        console.log('✅ Todas as colunas necessárias existem!');
        
        // Testar atualização
        console.log('🔵 Testando atualização...');
        const { data: updateData, error: updateError } = await supabase
          .from('users')
          .update({
            foto_perfil: 'https://lh3.googleusercontent.com/a/test.jpg',
            primeiro_nome: 'Luiz Eduardo',
            ultimo_nome: 'de Menescal Pinto Filho',
            provedor: 'google'
          })
          .eq('email', 'luizeduardompf@gmail.com')
          .select();
        
        if (updateError) {
          console.error('❌ Erro na atualização:', updateError);
        } else {
          console.log('✅ Atualização bem-sucedida:', updateData);
        }
      }
      
    } else {
      console.log('✅ Colunas encontradas:', columns);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkAndFixColumns();
