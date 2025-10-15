import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🔄 Iniciando remoção do status "rascunho"...');
    
    // 1. Atualizar todos os registros que têm status 'rascunho' para 'pendente'
    const { data: updateData, error: updateError } = await supabase
      .from('imoveis')
      .update({ status: 'pendente' })
      .eq('status', 'rascunho');

    if (updateError) {
      console.error('❌ Erro ao atualizar status rascunho:', updateError);
      return NextResponse.json({ 
        success: false,
        error: 'Erro ao atualizar status rascunho',
        details: updateError.message 
      }, { status: 500 });
    }

    console.log('✅ Status "rascunho" atualizado para "pendente"');
    
    // 2. Verificar quantos registros foram atualizados
    const { data: statusCount, error: countError } = await supabase
      .from('imoveis')
      .select('status')
      .order('status');

    if (countError) {
      console.error('❌ Erro ao contar status:', countError);
      return NextResponse.json({ 
        success: false,
        error: 'Erro ao contar status',
        details: countError.message 
      }, { status: 500 });
    }

    // Contar por status
    const statusCounts = statusCount.reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Contagem de status após atualização:', statusCounts);

    return NextResponse.json({
      success: true,
      message: 'Status "rascunho" removido com sucesso',
      statusCounts,
      note: 'Execute o SQL manualmente no Supabase Dashboard para atualizar a constraint',
      sql: `
-- Execute este SQL no Supabase Dashboard:
-- 1. Atualizar constraint
ALTER TABLE imoveis 
DROP CONSTRAINT IF EXISTS imoveis_status_check;

ALTER TABLE imoveis 
ADD CONSTRAINT imoveis_status_check 
CHECK (status IN ('publicado', 'pendente', 'inativo', 'finalizado'));

-- 2. Atualizar valor padrão
ALTER TABLE imoveis 
ALTER COLUMN status SET DEFAULT 'pendente';

-- 3. Adicionar comentário
COMMENT ON CONSTRAINT imoveis_status_check ON imoveis IS 'Status permitidos: publicado, pendente, inativo, finalizado';
      `
    });

  } catch (error) {
    console.error('❌ Erro na API de remoção do status rascunho:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

