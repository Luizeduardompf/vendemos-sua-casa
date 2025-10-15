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
    console.log('🧪 Testando mudança de status para:', imovel.titulo, 'ID:', imovel.id);
    
    // Testar mudança para inativo
    const { data: updateData, error: updateError } = await supabase
      .from('imoveis')
      .update({ status: 'inativo' })
      .eq('id', imovel.id)
      .select('id, titulo, status');
    
    if (updateError) {
      console.error('❌ Erro ao atualizar para inativo:', updateError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao atualizar status para inativo',
        error: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint
      });
    }
    
    console.log('✅ Sucesso ao atualizar para inativo:', updateData);
    
    // Testar mudança de volta para publicado
    const { data: updateData2, error: updateError2 } = await supabase
      .from('imoveis')
      .update({ status: 'publicado' })
      .eq('id', imovel.id)
      .select('id, titulo, status');
    
    if (updateError2) {
      console.error('❌ Erro ao atualizar de volta para publicado:', updateError2);
      return NextResponse.json({
        success: false,
        message: 'Erro ao atualizar de volta para publicado',
        error: updateError2.message,
        code: updateError2.code,
        details: updateError2.details,
        hint: updateError2.hint
      });
    }
    
    console.log('✅ Sucesso ao atualizar de volta para publicado:', updateData2);
    
    return NextResponse.json({
      success: true,
      message: 'Teste de mudança de status bem-sucedido',
      tests: [
        {
          from: 'publicado',
          to: 'inativo',
          success: true,
          data: updateData
        },
        {
          from: 'inativo', 
          to: 'publicado',
          success: true,
          data: updateData2
        }
      ]
    });
    
  } catch (error) {
    console.error('Erro na API de teste:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

