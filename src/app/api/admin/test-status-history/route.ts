import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Testar se a tabela existe
    const { data: testData, error: testError } = await supabase
      .from('imoveis_status_history')
      .select('*')
      .limit(1);
    
    if (testError) {
      return NextResponse.json({
        success: false,
        message: 'Tabela não existe. Execute o SQL manualmente.',
        error: testError.message,
        sqlFile: 'database/sql/setup/create_imoveis_status_history_simple.sql'
      });
    }
    
    // Buscar um imóvel para testar
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, titulo, status')
      .limit(1);
    
    if (imoveisError || !imoveis || imoveis.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum imóvel encontrado para teste',
        error: imoveisError?.message
      });
    }
    
    const imovel = imoveis[0];
    
    // Testar a função de registro
    const { data: historyId, error: historyError } = await supabase
      .rpc('registrar_mudanca_status_imovel', {
        p_imovel_id: imovel.id,
        p_status_anterior: null,
        p_status_novo: imovel.status,
        p_user_id: null,
        p_motivo: 'Teste de criação da tabela',
        p_observacoes: 'Registro de teste para verificar funcionamento'
      });
    
    if (historyError) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao testar função de registro',
        error: historyError.message
      });
    }
    
    // Buscar o histórico criado
    const { data: history, error: historyFetchError } = await supabase
      .from('imoveis_status_history')
      .select('*')
      .eq('id', historyId)
      .single();
    
    if (historyFetchError) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao buscar histórico criado',
        error: historyFetchError.message
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tabela e função funcionando corretamente!',
      testData: {
        imovel: imovel,
        historyId: historyId,
        history: history
      }
    });
    
  } catch (error) {
    console.error('Erro na API de teste:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

