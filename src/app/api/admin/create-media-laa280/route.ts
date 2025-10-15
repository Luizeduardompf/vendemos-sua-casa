import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar o imóvel LAA-280
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('id, imovel_id, titulo')
      .eq('imovel_id', 'LAA-280')
      .single();
    
    if (imovelError || !imovel) {
      return NextResponse.json({ error: 'Imóvel LAA-280 não encontrado' }, { status: 404 });
    }
    
    console.log('🔍 Imóvel encontrado:', imovel);
    
    // Criar imagens para este imóvel específico
    const mediaData = [
      {
        imovel_id: imovel.id,
        url_publica: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80&laa280_1',
        principal: true,
        ordem: 1,
        descricao: 'Imagem principal do Apartamento T3 Premium - Estrela',
        nome_arquivo: 'imovel_LAA-280_1.jpg',
        caminho_arquivo: '/imoveis/LAA-280/imagem_1.jpg',
        tipo_media: 'foto'
      },
      {
        imovel_id: imovel.id,
        url_publica: 'https://images.unsplash.com/photo-1564014897-014d69b0e460?w=800&h=600&fit=crop&q=80&laa280_2',
        principal: false,
        ordem: 2,
        descricao: 'Sala de estar do Apartamento T3 Premium - Estrela',
        nome_arquivo: 'imovel_LAA-280_2.jpg',
        caminho_arquivo: '/imoveis/LAA-280/imagem_2.jpg',
        tipo_media: 'foto'
      },
      {
        imovel_id: imovel.id,
        url_publica: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80&laa280_3',
        principal: false,
        ordem: 3,
        descricao: 'Cozinha do Apartamento T3 Premium - Estrela',
        nome_arquivo: 'imovel_LAA-280_3.jpg',
        caminho_arquivo: '/imoveis/LAA-280/imagem_3.jpg',
        tipo_media: 'foto'
      },
      {
        imovel_id: imovel.id,
        url_publica: 'https://images.unsplash.com/photo-1564014897-014d69b0e460?w=800&h=600&fit=crop&q=80&laa280_4',
        principal: false,
        ordem: 4,
        descricao: 'Quarto principal do Apartamento T3 Premium - Estrela',
        nome_arquivo: 'imovel_LAA-280_4.jpg',
        caminho_arquivo: '/imoveis/LAA-280/imagem_4.jpg',
        tipo_media: 'foto'
      }
    ];
    
    console.log('🔍 Dados de media a inserir:', mediaData);
    
    const { data: insertedMedia, error: insertError } = await supabase
      .from('imoveis_media')
      .insert(mediaData)
      .select();
    
    if (insertError) {
      console.error('🔍 Erro ao inserir media:', insertError);
      return NextResponse.json({ 
        error: 'Erro ao inserir media', 
        details: insertError 
      }, { status: 500 });
    }
    
    console.log('🔍 Media inserida com sucesso:', insertedMedia?.length || 0);
    
    return NextResponse.json({
      success: true,
      inserted: insertedMedia?.length || 0,
      media: insertedMedia
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
