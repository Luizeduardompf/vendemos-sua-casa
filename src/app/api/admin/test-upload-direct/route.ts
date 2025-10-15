import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createClient();
  
  try {
    console.log('🧪 Testando upload direto para o bucket...');

    // 1. Criar uma imagem de teste (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    const fileName = `test-${Date.now()}.png`;
    const filePath = `test/${fileName}`;

    console.log(`📤 Tentando upload para: ${filePath}`);

    // 2. Tentar upload direto
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imoveis-images')
      .upload(filePath, testImageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      return NextResponse.json({
        success: false,
        message: 'Erro no upload direto',
        error: uploadError,
        details: {
          name: uploadError.name,
          message: uploadError.message,
          status: uploadError.status,
          statusCode: uploadError.statusCode
        }
      });
    }

    console.log('✅ Upload bem-sucedido:', uploadData);

    // 3. Obter URL pública
    const { data: urlData } = supabase.storage
      .from('imoveis-images')
      .getPublicUrl(filePath);

    console.log('🔗 URL pública:', urlData.publicUrl);

    // 4. Tentar listar arquivos no bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('imoveis-images')
      .list('test', {
        limit: 10
      });

    console.log('📄 Arquivos no bucket:', files?.length || 0, filesError ? `Erro: ${filesError.message}` : '');

    return NextResponse.json({
      success: true,
      message: 'Upload direto funcionou!',
      upload: uploadData,
      publicUrl: urlData.publicUrl,
      files: files?.length || 0,
      fileList: files?.map(f => ({ name: f.name, size: f.metadata?.size })) || []
    });

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro inesperado no teste',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

