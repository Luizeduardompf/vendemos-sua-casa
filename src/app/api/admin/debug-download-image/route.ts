import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createClient();
  
  try {
    console.log('🔍 Testando download e upload de imagem...');

    // URL de teste do Unsplash
    const testImageUrl = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&q=80';
    
    console.log('📥 Baixando imagem de:', testImageUrl);
    
    // Fazer download da imagem
    const response = await fetch(testImageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro no download: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('✅ Download concluído, tamanho:', arrayBuffer.byteLength, 'bytes');

    // Verificar tamanho (máximo 3MB)
    if (arrayBuffer.byteLength > 3 * 1024 * 1024) {
      throw new Error('Imagem muito grande: ' + arrayBuffer.byteLength + ' bytes');
    }

    console.log('📤 Fazendo upload para Supabase Storage...');
    
    // Fazer upload para Supabase Storage
    const fileName = `debug/test-${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imoveis-images')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      return NextResponse.json({ 
        success: false, 
        error: 'Erro no upload', 
        details: uploadError 
      });
    }

    console.log('✅ Upload concluído:', uploadData);

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('imoveis-images')
      .getPublicUrl(fileName);

    console.log('🔗 URL pública:', publicUrlData.publicUrl);

    return NextResponse.json({
      success: true,
      message: 'Download e upload funcionaram!',
      details: {
        downloadSize: arrayBuffer.byteLength,
        uploadPath: uploadData.path,
        publicUrl: publicUrlData.publicUrl
      }
    });

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro no teste',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

