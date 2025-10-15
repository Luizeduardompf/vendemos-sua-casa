import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  
  try {
    console.log('🔍 Diagnosticando configuração do Supabase...');

    // 1. Testar conexão básica
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔐 Sessão:', session ? 'Ativa' : 'Inativa', sessionError ? `Erro: ${sessionError.message}` : '');

    // 2. Testar acesso ao storage
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log('📁 Buckets:', buckets?.length || 0, bucketsError ? `Erro: ${bucketsError.message}` : '');

    // 3. Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🌐 Supabase URL:', supabaseUrl ? 'Configurada' : 'NÃO CONFIGURADA');
    console.log('🔑 Anon Key:', supabaseAnonKey ? 'Configurada' : 'NÃO CONFIGURADA');
    console.log('🔑 Service Key:', supabaseServiceKey ? 'Configurada' : 'NÃO CONFIGURADA');

    // 4. Testar query simples na tabela users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    console.log('👥 Users table:', usersError ? `Erro: ${usersError.message}` : 'Acessível');

    // 5. Tentar criar bucket com service role
    let bucketCreationResult = null;
    if (supabaseServiceKey) {
      try {
        const serviceSupabase = createClient();
        const { data: createData, error: createError } = await serviceSupabase.storage.createBucket('imoveis-images', {
          public: true,
          fileSizeLimit: 3145728,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        });
        bucketCreationResult = { success: !createError, data: createData, error: createError };
      } catch (error) {
        bucketCreationResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
      }
    }

    return NextResponse.json({
      success: true,
      diagnostics: {
        session: {
          active: !!session,
          error: sessionError?.message || null
        },
        storage: {
          buckets: buckets?.length || 0,
          error: bucketsError?.message || null,
          bucketList: buckets?.map(b => ({ id: b.id, name: b.name, public: b.public })) || []
        },
        environment: {
          supabaseUrl: !!supabaseUrl,
          supabaseAnonKey: !!supabaseAnonKey,
          supabaseServiceKey: !!supabaseServiceKey
        },
        database: {
          usersTableAccessible: !usersError,
          error: usersError?.message || null
        },
        bucketCreation: bucketCreationResult
      }
    });

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
    return NextResponse.json({ 
      error: 'Erro no diagnóstico',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

