import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Verificar se há dados na tabela imoveis_media
    const { data: media, error: mediaError } = await supabase
      .from('imoveis_media')
      .select('*')
      .limit(5);
    
    console.log('🔍 Media encontrada:', media?.length || 0);
    console.log('🔍 Erro na media:', mediaError);
    
    // Verificar se há dados na tabela imoveis
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, imovel_id, titulo')
      .limit(5);
    
    console.log('🔍 Imóveis encontrados:', imoveis?.length || 0);
    console.log('🔍 Erro nos imóveis:', imoveisError);
    
    return NextResponse.json({
      media: media || [],
      imoveis: imoveis || [],
      mediaError,
      imoveisError
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
