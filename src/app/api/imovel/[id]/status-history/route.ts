import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = createClient();
    
    // Buscar histórico de status do imóvel
    const { data: history, error: historyError } = await supabase
      .from('imoveis_status_history')
      .select(`
        id,
        status_anterior,
        status_novo,
        motivo,
        observacoes,
        created_at,
        user_id,
        users!imoveis_status_history_user_id_fkey (
          nome_exibicao,
          email
        )
      `)
      .eq('imovel_id', resolvedParams.id)
      .order('created_at', { ascending: false });
    
    if (historyError) {
      console.error('Erro ao buscar histórico:', historyError);
      return NextResponse.json(
        { error: 'Erro ao buscar histórico de status', details: historyError.message },
        { status: 500 }
      );
    }
    
    // Buscar informações do imóvel
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('id, titulo, imovel_id, status')
      .eq('id', resolvedParams.id)
      .single();
    
    if (imovelError) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      imovel: {
        id: imovel.id,
        titulo: imovel.titulo,
        imovel_id: imovel.imovel_id,
        status_atual: imovel.status
      },
      history: history || [],
      total: history?.length || 0
    });
    
  } catch (error) {
    console.error('Erro na API de histórico de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

