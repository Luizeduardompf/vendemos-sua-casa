import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar um imóvel publicado para testar
    const { data: imoveis, error: fetchError } = await supabase
      .from('imoveis')
      .select('id, titulo, status')
      .eq('status', 'publicado')
      .limit(1);
    
    if (fetchError || !imoveis || imoveis.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum imóvel publicado encontrado para teste',
        error: fetchError?.message
      });
    }
    
    const imovel = imoveis[0];
    const originalStatus = imovel.status;
    
    // Testar mudança para inativo
    const { data: updateData, error: updateError } = await supabase
      .from('imoveis')
      .update({ status: 'inativo' })
      .eq('id', imovel.id)
      .select('id, titulo, status');
    
    if (updateError) {
      return NextResponse.json({
        success: false,
        message: 'Constraint ainda não foi atualizada',
        error: updateError.message,
        code: updateError.code,
        hint: 'Execute o SQL no Supabase Dashboard para atualizar a constraint'
      });
    }
    
    // Testar mudança para finalizado
    const { data: updateData2, error: updateError2 } = await supabase
      .from('imoveis')
      .update({ status: 'finalizado' })
      .eq('id', imovel.id)
      .select('id, titulo, status');
    
    if (updateError2) {
      // Restaurar status original
      await supabase
        .from('imoveis')
        .update({ status: originalStatus })
        .eq('id', imovel.id);
        
      return NextResponse.json({
        success: false,
        message: 'Status inativo funcionou, mas finalizado falhou',
        error: updateError2.message,
        code: updateError2.code
      });
    }
    
    // Restaurar status original
    await supabase
      .from('imoveis')
      .update({ status: originalStatus })
      .eq('id', imovel.id);
    
    return NextResponse.json({
      success: true,
      message: 'Constraint atualizada com sucesso!',
      tests: [
        {
          status: 'inativo',
          success: true,
          data: updateData
        },
        {
          status: 'finalizado',
          success: true,
          data: updateData2
        }
      ],
      imovel: {
        id: imovel.id,
        titulo: imovel.titulo,
        originalStatus
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

