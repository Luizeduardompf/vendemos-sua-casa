import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Atualizar diretamente com SQL
    const { data, error } = await supabase
      .from('imoveis')
      .update({ status: 'publicado' })
      .eq('status', null)
      .select('id, titulo, imovel_id, status');
    
    if (error) {
      console.error('Erro ao atualizar status:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar status' },
        { status: 500 }
      );
    }
    
    console.log('Status atualizados:', data?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: `Status atualizados para ${data?.length || 0} imóveis`,
      data: data?.slice(0, 5) // Mostrar apenas os primeiros 5
    });
    
  } catch (error) {
    console.error('Erro na API de atualização de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
