import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { status_anterior, status_novo, motivo, observacoes } = await request.json();
    
    const supabase = createClient();
    
    // Inserir diretamente na tabela de histórico (sem RLS)
    const { data: historyData, error: historyError } = await supabase
      .from('imoveis_status_history')
      .insert({
        imovel_id: resolvedParams.id,
        status_anterior: status_anterior,
        status_novo: status_novo,
        user_id: null, // Será preenchido pela aplicação
        motivo: motivo || 'Mudança de status via API',
        observacoes: observacoes || `Status alterado de ${status_anterior} para ${status_novo}`
      })
      .select('id, created_at')
      .single();
    
    if (historyError) {
      console.error('Erro ao registrar histórico:', historyError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao registrar no histórico',
        error: historyError.message,
        code: historyError.code
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Histórico registrado com sucesso',
      history_id: historyData.id,
      created_at: historyData.created_at
    });
    
  } catch (error) {
    console.error('Erro na API de registro de histórico:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

