import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar um imóvel para testar diferentes status
    const { data: imoveis, error: fetchError } = await supabase
      .from('imoveis')
      .select('id, titulo, status')
      .limit(1);
    
    if (fetchError || !imoveis || imoveis.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum imóvel encontrado para teste',
        error: fetchError?.message
      });
    }
    
    const imovel = imoveis[0];
    const originalStatus = imovel.status;
    
    // Testar diferentes valores de status
    const statusToTest = ['publicado', 'pendente', 'inativo', 'finalizado', 'ativo'];
    const results = [];
    
    for (const status of statusToTest) {
      try {
        const { error: updateError } = await supabase
          .from('imoveis')
          .update({ status: status })
          .eq('id', imovel.id);
        
        results.push({
          status,
          allowed: !updateError,
          error: updateError?.message || null,
          code: updateError?.code || null
        });
        
        // Restaurar status original
        if (!updateError) {
          await supabase
            .from('imoveis')
            .update({ status: originalStatus })
            .eq('id', imovel.id);
        }
      } catch (err) {
        results.push({
          status,
          allowed: false,
          error: err instanceof Error ? err.message : String(err),
          code: null
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Teste de constraint de status concluído',
      imovel: {
        id: imovel.id,
        titulo: imovel.titulo,
        originalStatus
      },
      results,
      allowedStatuses: results.filter(r => r.allowed).map(r => r.status),
      blockedStatuses: results.filter(r => !r.allowed).map(r => r.status)
    });
    
  } catch (error) {
    console.error('Erro na API de teste de constraint:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
