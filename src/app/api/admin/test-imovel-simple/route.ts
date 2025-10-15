import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar imóvel sem verificação de propriedade
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select(`
        *,
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
    
    console.log('🔍 Imóvel encontrado:', imovel);
    console.log('🔍 Erro:', imovelError);
    
    if (imovelError) {
      return NextResponse.json({ error: imovelError.message }, { status: 500 });
    }
    
    // Formatar imagens
    const imagens = imovel.imoveis_media?.map((media: any, index: number) => ({
      id: media.id,
      url: media.url_publica || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      isMain: media.principal || index === 0,
      alt: media.descricao || `Imagem ${index + 1} do imóvel`
    })) || [];
    
    console.log('🔍 Imagens formatadas:', imagens);
    
    return NextResponse.json({
      imovel: {
        id: imovel.id,
        imovel_id: imovel.imovel_id,
        titulo: imovel.titulo,
        imagens: imagens
      }
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
