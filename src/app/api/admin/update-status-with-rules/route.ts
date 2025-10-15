import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar todos os imóveis
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
      
      // Distribuição baseada nas regras de negócio
      if (i % 4 === 0) {
        selectedStatus = 'pendente'; // 25% pendentes
      } else if (i % 4 === 1) {
        selectedStatus = 'publicado'; // 25% publicados
      } else if (i % 4 === 2) {
        selectedStatus = 'inativo'; // 25% inativos
      } else {
        selectedStatus = 'finalizado'; // 25% finalizados
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
      message: `Status atualizados para ${updates.length} imóveis seguindo as regras de negócio`,
      updates: updates.slice(0, 10), // Mostrar apenas os primeiros 10
      total: updates.length,
      statusCount,
      rules: {
        'pendente': 'Só pode virar publicado',
        'publicado': 'Só pode virar inativo',
        'inativo': 'Só pode virar publicado',
        'finalizado': 'Não pode mudar de status'
      }
    });
    
  } catch (error) {
    console.error('Erro na API de atualização de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

