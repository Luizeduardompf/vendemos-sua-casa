import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  
  try {
    console.log('🔍 Testando configuração do Supabase Storage...');

    // 1. Listar buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return NextResponse.json({ 
        error: 'Erro ao listar buckets', 
        details: bucketsError 
      }, { status: 500 });
    }

    console.log('📁 Buckets encontrados:', buckets);

    // 2. Verificar se o bucket imoveis-images existe
    const imoveisBucket = buckets?.find(bucket => bucket.id === 'imoveis-images');
    
    if (!imoveisBucket) {
      console.log('⚠️ Bucket imoveis-images não encontrado');
      return NextResponse.json({
        success: false,
        message: 'Bucket imoveis-images não encontrado. Execute o script SQL primeiro.',
        buckets: buckets?.map(b => ({ id: b.id, name: b.name, public: b.public }))
      });
    }

    console.log('✅ Bucket imoveis-images encontrado:', imoveisBucket);

    // 3. Listar arquivos no bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('imoveis-images')
      .list('', {
        limit: 10,
        offset: 0
      });

    if (filesError) {
      console.error('❌ Erro ao listar arquivos:', filesError);
      return NextResponse.json({ 
        error: 'Erro ao listar arquivos', 
        details: filesError 
      }, { status: 500 });
    }

    console.log('📄 Arquivos encontrados:', files);

    // 4. Testar upload de uma imagem pequena
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imoveis-images')
      .upload('test/test-image.png', testImageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Erro no teste de upload:', uploadError);
      return NextResponse.json({ 
        error: 'Erro no teste de upload', 
        details: uploadError 
      }, { status: 500 });
    }

    console.log('✅ Teste de upload bem-sucedido:', uploadData);

    // 5. Obter URL pública
    const { data: urlData } = supabase.storage
      .from('imoveis-images')
      .getPublicUrl('test/test-image.png');

    console.log('🔗 URL pública:', urlData.publicUrl);

    return NextResponse.json({
      success: true,
      message: 'Supabase Storage configurado corretamente!',
      bucket: {
        id: imoveisBucket.id,
        name: imoveisBucket.name,
        public: imoveisBucket.public,
        file_size_limit: imoveisBucket.file_size_limit,
        allowed_mime_types: imoveisBucket.allowed_mime_types
      },
      files: files?.length || 0,
      testUpload: uploadData,
      publicUrl: urlData.publicUrl
    });

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

