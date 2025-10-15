import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar um imóvel específico com suas imagens
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select(`
        id,
        imovel_id,
        titulo,
        proprietario_id,
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
    
    if (imovelError) {
      return NextResponse.json({ error: imovelError.message }, { status: 500 });
    }
    
    console.log('🔍 Imóvel encontrado:', imovel);
    console.log('🔍 Mídia encontrada:', imovel.imoveis_media);
    
    // Formatar as imagens como na API principal
    const imagens = imovel.imoveis_media?.map((media: any, index: number) => ({
      id: media.id,
      url: media.url_publica,
      isMain: media.principal || index === 0,
      alt: media.descricao || `Imagem ${index + 1} do ${imovel.titulo}`
    })) || [];
    
    console.log('🔍 Imagens formatadas:', imagens);
    
    return NextResponse.json({
      imovel: {
        id: imovel.id,
        imovel_id: imovel.imovel_id,
        titulo: imovel.titulo,
        proprietario_id: imovel.proprietario_id
      },
      imagens,
      totalImagens: imagens.length
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
