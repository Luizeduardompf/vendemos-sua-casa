import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { status_novo, motivo, observacoes } = await request.json();
    
    if (!status_novo) {
      return NextResponse.json(
        { error: 'Status novo é obrigatório' },
        { status: 400 }
      );
    }
    
    // Validar status (usando apenas os permitidos pela constraint atual)
    const statusValidos = ['publicado', 'pendente', 'inativo'];
    if (!statusValidos.includes(status_novo)) {
      return NextResponse.json(
        { error: 'Status inválido. Use: publicado, pendente, inativo' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // Buscar o imóvel atual
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('id, status, proprietario_id')
      .eq('id', resolvedParams.id)
      .single();
    
    if (imovelError || !imovel) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }
    
    const status_anterior = imovel.status;
    
    // Se o status não mudou, não fazer nada
    if (status_anterior === status_novo) {
      return NextResponse.json({
        success: true,
        message: 'Status já está correto',
        status_anterior,
        status_novo
      });
    }
    
    // REGRAS DE NEGÓCIO PARA MUDANÇA DE STATUS
    const validTransitions = {
      'pendente': ['publicado'], // Pendente só pode virar publicado
      'publicado': ['inativo'], // Publicado só pode virar inativo
      'inativo': ['publicado'] // Inativo só pode virar publicado
    };
    
    // Verificar se a transição é válida
    if (!validTransitions[status_anterior]?.includes(status_novo)) {
      let errorMessage = '';
      
      if (status_anterior === 'pendente' && status_novo !== 'publicado') {
        errorMessage = 'Imóveis pendentes só podem ser publicados';
      } else if (status_anterior === 'publicado' && status_novo !== 'inativo') {
        errorMessage = 'Imóveis publicados só podem ser inativados';
      } else if (status_anterior === 'inativo' && status_novo !== 'publicado') {
        errorMessage = 'Imóveis inativos só podem ser publicados';
      } else {
        errorMessage = `Transição de status inválida: ${status_anterior} → ${status_novo}`;
      }
      
      return NextResponse.json({
        error: errorMessage,
        status_anterior,
        status_novo,
        validTransitions: validTransitions[status_anterior] || []
      }, { status: 400 });
    }
    
    // Atualizar o status do imóvel
    const { error: updateError } = await supabase
      .from('imoveis')
      .update({ status: status_novo })
      .eq('id', resolvedParams.id);
    
    if (updateError) {
      console.error('Erro ao atualizar status do imóvel:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar status do imóvel', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Registrar no histórico usando API simples
    let historyId = null;
    try {
      console.log('🔄 Tentando registrar histórico para imóvel:', resolvedParams.id);
      const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/imovel/${resolvedParams.id}/register-history-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status_anterior: status_anterior,
          status_novo: status_novo,
          motivo: motivo || 'Mudança de status via API',
          observacoes: observacoes || `Status alterado de ${status_anterior} para ${status_novo}`
        })
      });
      
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        historyId = historyData.history_id;
        console.log('✅ Histórico registrado:', historyId);
      } else {
        const errorText = await historyResponse.text();
        console.error('⚠️ Erro ao registrar histórico:', errorText);
        // Não falhar a operação por causa do histórico
      }
    } catch (historyErr) {
      console.error('⚠️ Erro ao registrar no histórico:', historyErr);
      // Não falhar a operação por causa do histórico
    }
    
    return NextResponse.json({
      success: true,
      message: 'Status alterado com sucesso',
      status_anterior,
      status_novo,
      history_id: historyId
    });
    
  } catch (error) {
    console.error('Erro na API de mudança de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
