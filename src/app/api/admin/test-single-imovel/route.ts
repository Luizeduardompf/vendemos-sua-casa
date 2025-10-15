import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Função de download e upload (copiada do script principal)
async function downloadAndUploadImage(
  supabase: any,
  imovelId: string,
  imageUrl: string,
  fileName: string,
  titulo: string,
  descricao: string,
  categoria: string,
  principal: boolean,
  ordem: number
) {
  try {
    console.log(`📥 Baixando: ${imageUrl}`);
    
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`❌ Erro no download: ${response.status} ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log(`✅ Download concluído: ${arrayBuffer.byteLength} bytes`);

    // Verificar tamanho (máximo 3MB)
    if (arrayBuffer.byteLength > 3 * 1024 * 1024) {
      console.error(`❌ Imagem muito grande: ${arrayBuffer.byteLength} bytes`);
      return null;
    }

    console.log(`📤 Fazendo upload: ${fileName}`);
    
    // Fazer upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imoveis-images')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error(`❌ Erro no upload:`, uploadError);
      return null;
    }

    console.log(`✅ Upload concluído: ${uploadData.path}`);

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('imoveis-images')
      .getPublicUrl(fileName);

    console.log(`🔗 URL pública: ${publicUrlData.publicUrl}`);

    // Inserir metadados na tabela
    const { data: mediaData, error: mediaError } = await supabase
      .from('imoveis_media')
      .insert({
        imovel_id: imovelId,
        url_publica: publicUrlData.publicUrl,
        principal: principal,
        ordem: ordem,
        descricao: descricao,
        nome_arquivo: fileName,
        caminho_arquivo: uploadData.path,
        tipo_media: 'foto',
        categoria: categoria,
        ativo: true
      })
      .select()
      .single();

    if (mediaError) {
      console.error(`❌ Erro ao inserir metadados:`, mediaError);
      return null;
    }

    console.log(`✅ Metadados inseridos: ${mediaData.id}`);
    return mediaData;

  } catch (error) {
    console.error(`❌ Erro geral:`, error);
    return null;
  }
}

export async function POST() {
  const supabase = createClient();
  
  try {
    console.log('🔍 Testando geração de imagem para um imóvel específico...');

    // Buscar um imóvel específico
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, imovel_id, titulo, tipo_imovel')
      .limit(1);

    if (imoveisError || !imoveis || imoveis.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nenhum imóvel encontrado' 
      });
    }

    const imovel = imoveis[0];
    console.log(`🏠 Testando com imóvel: ${imovel.titulo} (${imovel.imovel_id})`);

    // URL de teste
    const testImageUrl = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&q=80';
    const fileName = `${imovel.imovel_id}_test.jpg`;

    const result = await downloadAndUploadImage(
      supabase,
      imovel.id,
      testImageUrl,
      fileName,
      'Teste de Imagem',
      'Imagem de teste para debug',
      'exterior',
      true,
      1
    );

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Teste de imagem funcionou!',
        imovel: {
          id: imovel.id,
          imovel_id: imovel.imovel_id,
          titulo: imovel.titulo
        },
        media: result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Teste de imagem falhou'
      });
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro no teste',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

