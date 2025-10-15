import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🧹 Forçando limpeza completa...');
    
    // 1. Deletar todas as mídias
    const { error: mediaError } = await supabase
      .from('imoveis_media')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar tudo
    
    if (mediaError) {
      console.error('❌ Erro ao limpar mídias:', mediaError);
    } else {
      console.log('✅ Mídias limpas');
    }
    
    // 2. Deletar todas as amenities
    const { error: amenitiesError } = await supabase
      .from('imoveis_amenities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar tudo
    
    if (amenitiesError) {
      console.error('❌ Erro ao limpar amenities:', amenitiesError);
    } else {
      console.log('✅ Amenities limpas');
    }
    
    // 3. Deletar todos os imóveis
    const { error: imoveisError } = await supabase
      .from('imoveis')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar tudo
    
    if (imoveisError) {
      console.error('❌ Erro ao limpar imóveis:', imoveisError);
      return NextResponse.json(
        { error: 'Erro ao limpar imóveis', details: imoveisError },
        { status: 500 }
      );
    } else {
      console.log('✅ Imóveis limpos');
    }
    
    // 4. Verificar se ficou vazio
    const { data: imoveisRestantes, error: checkError } = await supabase
      .from('imoveis')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Erro ao verificar:', checkError);
    } else {
      console.log(`📊 Imóveis restantes: ${imoveisRestantes?.length || 0}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Limpeza forçada concluída!',
      imoveis_restantes: imoveisRestantes?.length || 0
    });
    
  } catch (error) {
    console.error('❌ Erro na limpeza:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}
