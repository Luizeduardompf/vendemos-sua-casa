import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar todos os imóveis
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, imovel_id, titulo, tipo_imovel')
      .limit(10);
    
    if (imoveisError || !imoveis || imoveis.length === 0) {
      return NextResponse.json({ error: 'Nenhum imóvel encontrado' }, { status: 404 });
    }
    
    console.log('🔍 Imóveis encontrados:', imoveis.length);
    
    // Criar imagens variadas para cada imóvel
    const mediaData = [];
    
    for (const imovel of imoveis) {
      // Gerar 2-4 imagens por imóvel
      const numImages = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numImages; i++) {
        // URLs de imagens variadas baseadas no tipo de imóvel
        let baseUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2';
        
        if (imovel.tipo_imovel === 'apartamento') {
          const apartmentImages = [
            '1560448204-e02f11c3d0e2', // Apartamento moderno
            '1564014897-014d69b0e460', // Sala de estar
            '1564014897-014d69b0e460', // Cozinha
            '1564014897-014d69b0e460'  // Quarto
          ];
          baseUrl = `https://images.unsplash.com/photo-${apartmentImages[i % apartmentImages.length]}`;
        } else if (imovel.tipo_imovel === 'casa') {
          const houseImages = [
            '1564014897-014d69b0e460', // Casa exterior
            '1564014897-014d69b0e460', // Jardim
            '1564014897-014d69b0e460', // Interior
            '1564014897-014d69b0e460'  // Garagem
          ];
          baseUrl = `https://images.unsplash.com/photo-${houseImages[i % houseImages.length]}`;
        }
        
        mediaData.push({
          imovel_id: imovel.id,
          url_publica: `${baseUrl}?w=800&h=600&fit=crop&q=80&${imovel.imovel_id}_${i}`,
          principal: i === 0,
          ordem: i + 1,
          descricao: `${i === 0 ? 'Imagem principal' : `Imagem ${i + 1}`} do ${imovel.titulo}`,
          nome_arquivo: `imovel_${imovel.imovel_id}_${i + 1}.jpg`,
          caminho_arquivo: `/imoveis/${imovel.imovel_id}/imagem_${i + 1}.jpg`,
          tipo_media: 'foto'
        });
      }
    }
    
    console.log('🔍 Total de imagens a inserir:', mediaData.length);
    
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
