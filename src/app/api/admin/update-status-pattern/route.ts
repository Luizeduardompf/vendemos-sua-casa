import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🔄 Iniciando atualização do padrão de status...');
    
    // Atualizar status 'rascunho' para 'pendente' (se existir)
    const { data: rascunhoUpdate, error: rascunhoError } = await supabase
      .from('imoveis')
      .update({ status: 'pendente' })
      .eq('status', 'rascunho');

    if (rascunhoError) {
      console.error('❌ Erro ao atualizar status rascunho:', rascunhoError);
      return NextResponse.json({ error: 'Erro ao atualizar status rascunho' }, { status: 500 });
    }

    console.log('✅ Status "rascunho" atualizado para "pendente"');
    
    // Atualizar status 'ativo' para 'publicado'
    const { data: publicadoUpdate, error: publicadoError } = await supabase
      .from('imoveis')
      .update({ status: 'publicado' })
      .eq('status', 'ativo');
    
    if (publicadoError) {
      console.error('❌ Erro ao atualizar status publicado:', publicadoError);
      return NextResponse.json({ error: 'Erro ao atualizar status publicado' }, { status: 500 });
    }
    
    console.log('✅ Status "ativo" atualizado para "publicado"');
    
    // Verificar quantos imóveis temos de cada status
    const { data: statusCount, error: countError } = await supabase
      .from('imoveis')
      .select('status')
      .then(({ data, error }) => {
        if (error) throw error;
        const counts = data.reduce((acc: Record<string, number>, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        return { data: counts, error: null };
      });
    
    if (countError) {
      console.error('❌ Erro ao contar status:', countError);
      return NextResponse.json({ error: 'Erro ao contar status' }, { status: 500 });
    }
    
    console.log('📊 Contagem de status após atualização:', statusCount);
    
    return NextResponse.json({
      success: true,
      message: 'Padrão de status atualizado com sucesso!',
      statusCount
    });
    
  } catch (error) {
    console.error('❌ Erro na atualização do padrão de status:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
