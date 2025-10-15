import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Testar JOIN com um imóvel específico
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select(`
        id,
        imovel_id,
        titulo,
        imoveis_media!left(
          id,
          url_publica,
          principal,
          ordem,
          descricao
        )
      `)
      .eq('imovel_id', 'MXP-128')
      .single();
    
    console.log('🔍 Imóvel com JOIN:', imovel);
    console.log('🔍 Erro:', imovelError);
    
    return NextResponse.json({
      imovel,
      error: imovelError
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
