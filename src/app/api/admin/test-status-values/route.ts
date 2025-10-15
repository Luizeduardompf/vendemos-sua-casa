import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar um imóvel para testar
    const { data: imoveis, error: fetchError } = await supabase
      .from('imoveis')
      .select('id, titulo, imovel_id, status')
      .limit(1);
    
    if (fetchError || !imoveis || imoveis.length === 0) {
      return NextResponse.json({ error: 'Nenhum imóvel encontrado para teste' }, { status: 404 });
    }
    
    const imovel = imoveis[0];
    const originalStatus = imovel.status;
    
    // Testar diferentes valores de status
    const statusOptions = [
      'publicado', 'pendente',
      'draft', 'published', 'pending', 'active', 'inactive', 'completed',
      'available', 'sold', 'rented', 'maintenance'
    ];
    
    const results = [];
    
    for (const status of statusOptions) {
      console.log(`Testando status: ${status}`);
      
      const { data, error } = await supabase
        .from('imoveis')
        .update({ status: status })
        .eq('id', imovel.id)
        .select('id, titulo, imovel_id, status');
      
      if (error) {
        results.push({
          status,
          accepted: false,
          error: error.message
        });
        console.log(`❌ Status '${status}' rejeitado:`, error.message);
      } else {
        results.push({
          status,
          accepted: true,
          data: data?.[0]
        });
        console.log(`✅ Status '${status}' aceito`);
      }
    }
    
    // Restaurar status original
    await supabase
      .from('imoveis')
      .update({ status: originalStatus })
      .eq('id', imovel.id);
    
    const acceptedStatuses = results.filter(r => r.accepted).map(r => r.status);
    const rejectedStatuses = results.filter(r => !r.accepted).map(r => ({ status: r.status, error: r.error }));
    
    return NextResponse.json({
      success: true,
      message: `Testados ${statusOptions.length} valores de status`,
      imovelTestado: {
        id: imovel.id,
        titulo: imovel.titulo,
        imovel_id: imovel.imovel_id,
        statusOriginal: originalStatus
      },
      statusAceitos: acceptedStatuses,
      statusRejeitados: rejectedStatuses,
      totalAceitos: acceptedStatuses.length,
      totalRejeitados: rejectedStatuses.length
    });
    
  } catch (error) {
    console.error('Erro na API de teste de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
