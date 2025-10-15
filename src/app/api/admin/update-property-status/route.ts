import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar todos os imóveis
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, titulo, imovel_id, status')
      .order('created_at', { ascending: false });
    
    if (imoveisError) {
      console.error('Erro ao buscar imóveis:', imoveisError);
      return NextResponse.json(
        { error: 'Erro ao buscar imóveis' },
        { status: 500 }
      );
    }
    
    console.log(`📊 Encontrados ${imoveis.length} imóveis para atualizar`);
    
    // Atualizar cada imóvel com um status distribuído
    const updates = [];
    
    for (let i = 0; i < imoveis.length; i++) {
      const imovel = imoveis[i];
      let selectedStatus;
      
      // Distribuição específica baseada no índice
      if (i < Math.floor(imoveis.length * 0.4)) {
        selectedStatus = 'publicado'; // 40% publicado
      } else if (i < Math.floor(imoveis.length * 0.6)) {
        selectedStatus = 'pendente'; // 20% pendente
      } else if (i < Math.floor(imoveis.length * 0.9)) {
        selectedStatus = 'pendente'; // 30% pendente
      } else {
        selectedStatus = 'pendente'; // 10% pendente
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
    
    // Contar status por tipo
    const statusCount = updates.reduce((acc, update) => {
      acc[update.status_novo] = (acc[update.status_novo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📊 Status atualizados:', statusCount);
    
    return NextResponse.json({
      success: true,
      message: `Status atualizados para ${updates.length} imóveis`,
      updates: updates.slice(0, 10), // Mostrar apenas os primeiros 10
      total: updates.length,
      statusCount
    });
    
  } catch (error) {
    console.error('Erro na API de atualização de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
