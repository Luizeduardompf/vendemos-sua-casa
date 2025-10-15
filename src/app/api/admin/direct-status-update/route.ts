import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Usar apenas os valores permitidos pela constraint
    const statusOptions = ['publicado', 'inativo', 'pendente'];
    
    // Atualizar todos os imóveis com distribuição de status
    const { data: imoveis, error: fetchError } = await supabase
      .from('imoveis')
      .select('id, titulo, imovel_id, status');
    
    if (fetchError) {
      console.error('Erro ao buscar imóveis:', fetchError);
      return NextResponse.json(
        { error: 'Erro ao buscar imóveis', details: fetchError.message },
        { status: 500 }
      );
    }
    
    console.log(`📊 Encontrados ${imoveis.length} imóveis para atualizar`);
    
    const updates = [];
    
    for (let i = 0; i < imoveis.length; i++) {
      const imovel = imoveis[i];
      let selectedStatus;
      
      // Distribuição simples: 1/3 para cada status
      if (i % 3 === 0) {
        selectedStatus = 'publicado';
      } else if (i % 3 === 1) {
        selectedStatus = 'pendente';
      } else {
        selectedStatus = 'pendente';
      }
      
      const { error: updateError } = await supabase
        .from('imoveis')
        .update({ status: selectedStatus })
        .eq('id', imovel.id);
      
      if (updateError) {
        console.error(`Erro ao atualizar imóvel ${imovel.id}:`, updateError);
        continue;
      }
      
      updates.push({
        id: imovel.id,
        titulo: imovel.titulo,
        imovel_id: imovel.imovel_id,
        status_anterior: imovel.status,
        status_novo: selectedStatus
      });
    }
    
    const statusCount = updates.reduce((acc, update) => {
      acc[update.status_novo] = (acc[update.status_novo] || 0) + 1;
      return acc;
    }, {});
    
    return NextResponse.json({
      success: true,
      message: `Status atualizados para ${updates.length} imóveis`,
      updates: updates.slice(0, 10), // Mostrar apenas os primeiros 10
      total: updates.length,
      statusCount
    });
    
    if (error) {
      console.error('Erro ao atualizar status:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar status', details: error.message },
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
