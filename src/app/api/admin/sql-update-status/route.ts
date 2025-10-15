import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Atualizar diretamente com SQL
    const { data, error } = await supabase
      .rpc('update_imoveis_status');
    
    if (error) {
      console.error('Erro ao atualizar status:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar status', details: error.message },
        { status: 500 }
      );
    }
    
    console.log('Status atualizados via SQL:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Status atualizados via SQL',
      data: data
    });
    
  } catch (error) {
    console.error('Erro na API de atualização de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

