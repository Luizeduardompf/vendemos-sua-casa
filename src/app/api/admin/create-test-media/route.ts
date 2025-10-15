import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Primeiro, vamos verificar se a tabela imoveis_media existe
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, imovel_id, titulo')
      .limit(3);
    
    if (imoveisError || !imoveis || imoveis.length === 0) {
      return NextResponse.json({ error: 'Nenhum imóvel encontrado' }, { status: 404 });
    }
    
    console.log('🔍 Imóveis encontrados:', imoveis.length);
    
    // Tentar inserir dados na tabela imoveis_media
    const mediaData = imoveis.map((imovel, index) => ({
      imovel_id: imovel.id,
      url_publica: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80&${index}`,
      principal: index === 0,
      ordem: index + 1,
      descricao: `Imagem ${index + 1} do ${imovel.titulo}`,
      nome_arquivo: `imovel_${imovel.imovel_id}_${index + 1}.jpg`,
      caminho_arquivo: `/imoveis/${imovel.imovel_id}/imagem_${index + 1}.jpg`,
      tipo_media: 'foto'
    }));
    
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
