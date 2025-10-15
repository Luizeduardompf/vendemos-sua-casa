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
    
    // Atualizar cada imóvel com um status específico
    const updates = [];
    const statusOptions = ['publicado', 'pendente'];
    
    for (let i = 0; i < imoveis.length; i++) {
      const imovel = imoveis[i];
      let selectedStatus;
      
      // Distribuição simples: 50% publicado, 50% pendente
      if (i % 2 === 0) {
        selectedStatus = 'publicado'; // 50% publicado
      } else {
        selectedStatus = 'pendente'; // 50% pendente
      }
      
      console.log(`Atualizando imóvel ${i + 1}/${imoveis.length}: ${imovel.titulo} -> ${selectedStatus}`);
      
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
