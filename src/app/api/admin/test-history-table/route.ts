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
        message: 'Tabela de histórico não existe ou tem problemas',
        error: testError.message,
        code: testError.code,
        hint: 'Execute o SQL para criar a tabela de histórico'
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
    
    // Testar inserção direta na tabela
    const { data: insertData, error: insertError } = await supabase
      .from('imoveis_status_history')
      .insert({
        imovel_id: imovel.id,
        status_anterior: 'pendente',
        status_novo: 'publicado',
        user_id: null,
        motivo: 'Teste de inserção na tabela de histórico',
        observacoes: 'Teste para verificar se a tabela funciona'
      })
      .select('id, created_at')
      .single();
    
    if (insertError) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao inserir na tabela de histórico',
        error: insertError.message,
        code: insertError.code,
        details: insertError.details
      });
    }
    
    // Buscar o registro inserido
    const { data: historyData, error: historyError } = await supabase
      .from('imoveis_status_history')
      .select('*')
      .eq('id', insertData.id)
      .single();
    
    if (historyError) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao buscar registro inserido',
        error: historyError.message
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tabela de histórico funcionando corretamente!',
      testData: {
        imovel: imovel,
        insertedRecord: insertData,
        retrievedRecord: historyData
      }
    });
    
  } catch (error) {
    console.error('Erro na API de teste da tabela de histórico:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

