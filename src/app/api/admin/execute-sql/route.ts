import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Executando SQL via API...');
    
    const { sql } = await request.json();
    console.log('SQL recebido:', sql);
    
    const supabase = createClient();
    
    // Executar SQL usando a função rpc do Supabase
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Erro ao executar SQL:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('SQL executado com sucesso:', data);
    
    return NextResponse.json({
      success: true,
      message: 'SQL executado com sucesso',
      data
    });
    
  } catch (error) {
    console.error('Erro geral:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
