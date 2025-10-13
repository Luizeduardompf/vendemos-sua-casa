#!/usr/bin/env node

// 🔍 Script de Diagnóstico - Problemas de Autenticação
// Verifica configurações e identifica problemas comuns

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE AUTENTICAÇÃO - Vendemos Sua Casa');
console.log('================================================\n');

// 1. Verificar arquivo .env.local
console.log('1️⃣ Verificando arquivo .env.local...');
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env.local não encontrado!');
  console.log('   Solução: Copie env.example para .env.local e configure');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
console.log('✅ Arquivo .env.local encontrado');

// 2. Verificar variáveis essenciais
console.log('\n2️⃣ Verificando variáveis de ambiente...');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL'
];

const missingVars = [];
const configuredVars = [];

requiredVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match && match[1] && !match[1].includes('your_')) {
    configuredVars.push(varName);
    console.log(`✅ ${varName}: Configurado`);
  } else {
    missingVars.push(varName);
    console.log(`❌ ${varName}: Não configurado ou usando valor padrão`);
  }
});

if (missingVars.length > 0) {
  console.log('\n❌ Variáveis não configuradas:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n💡 Configure essas variáveis no arquivo .env.local');
}

// 3. Verificar configurações do Supabase
console.log('\n3️⃣ Verificando configurações do Supabase...');

const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1];
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1];

if (supabaseUrl && !supabaseUrl.includes('your_')) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL: Configurado');
  console.log(`   URL: ${supabaseUrl}`);
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL: Não configurado');
}

if (supabaseKey && !supabaseKey.includes('your_')) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Configurado');
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Não configurado');
}

// 4. Verificar configurações de OAuth
console.log('\n4️⃣ Verificando configurações de OAuth...');

const siteUrl = envContent.match(/NEXT_PUBLIC_SITE_URL=(.+)/)?.[1];
if (siteUrl && !siteUrl.includes('your_')) {
  console.log('✅ NEXT_PUBLIC_SITE_URL: Configurado');
  console.log(`   URL: ${siteUrl}`);
} else {
  console.log('❌ NEXT_PUBLIC_SITE_URL: Não configurado');
}

// 5. Verificar arquivos de configuração
console.log('\n5️⃣ Verificando arquivos de configuração...');

const configFiles = [
  'src/lib/supabase.ts',
  'src/components/auth/social-login.tsx',
  'src/app/auth/callback/page.tsx',
  'src/app/auth/confirm/page.tsx'
];

configFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}: Encontrado`);
  } else {
    console.log(`❌ ${file}: Não encontrado`);
  }
});

// 6. Verificar scripts SQL
console.log('\n6️⃣ Verificando scripts SQL...');

const sqlFiles = [
  'database/sql/setup/supabase_complete_setup.sql',
  'database/sql/setup/social_login_integration.sql',
  'database/sql/config/supabase_auth_config.sql'
];

sqlFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}: Encontrado`);
  } else {
    console.log(`❌ ${file}: Não encontrado`);
  }
});

// 7. Resumo e recomendações
console.log('\n📋 RESUMO DO DIAGNÓSTICO');
console.log('========================');

if (missingVars.length === 0 && configuredVars.length === requiredVars.length) {
  console.log('✅ Configurações básicas: OK');
} else {
  console.log('❌ Configurações básicas: Problemas encontrados');
}

console.log('\n🔧 PRÓXIMOS PASSOS RECOMENDADOS:');
console.log('1. Configure as variáveis de ambiente no .env.local');
console.log('2. Execute os scripts SQL no Supabase');
console.log('3. Configure OAuth no painel do Supabase');
console.log('4. Teste o social login localmente');
console.log('5. Verifique os logs do navegador para erros');

console.log('\n📚 DOCUMENTAÇÃO:');
console.log('- docs/CONFIGURAR_SUPABASE.md');
console.log('- docs/SUPABASE_OAUTH_SETUP.md');
console.log('- docs/GUIA_TESTE.md');
console.log('- database/sql/EXECUTAR_CORRIGIDO.sql');

console.log('\n🔍 Para mais detalhes, verifique os logs do navegador durante o teste.');
