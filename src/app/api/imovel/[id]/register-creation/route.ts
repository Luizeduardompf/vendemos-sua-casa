import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { user_id, motivo, observacoes } = await request.json();
    
    const supabase = createClient();
    
    // Buscar o imóvel
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('id, status, titulo')
      .eq('id', resolvedParams.id)
      .single();
    
    if (imovelError || !imovel) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }
    
    // Registrar a criação no histórico
    const { data: historyId, error: historyError } = await supabase
      .rpc('registrar_mudanca_status_imovel', {
        p_imovel_id: resolvedParams.id,
        p_status_anterior: null, // NULL para criação
        p_status_novo: imovel.status,
        p_user_id: user_id || null,
        p_motivo: motivo || 'Criação do imóvel',
        p_observacoes: observacoes || `Imóvel "${imovel.titulo}" criado`
      });
    
    if (historyError) {
      console.error('Erro ao registrar criação no histórico:', historyError);
      return NextResponse.json(
        { error: 'Erro ao registrar criação no histórico', details: historyError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Criação registrada no histórico com sucesso',
      imovel_id: resolvedParams.id,
      status: imovel.status,
      history_id: historyId
    });
    
  } catch (error) {
    console.error('Erro na API de registro de criação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

