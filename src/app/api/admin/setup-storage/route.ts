import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createClient();
  
  try {
    console.log('🔧 Configurando Supabase Storage via API...');

    // 1. Verificar se o bucket já existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return NextResponse.json({ 
        error: 'Erro ao listar buckets', 
        details: bucketsError 
      }, { status: 500 });
    }

    const imoveisBucket = buckets?.find(bucket => bucket.id === 'imoveis-images');
    
    if (imoveisBucket) {
      console.log('✅ Bucket imoveis-images já existe');
      return NextResponse.json({
        success: true,
        message: 'Bucket imoveis-images já existe!',
        bucket: imoveisBucket
      });
    }

    // 2. Criar bucket via API (se possível)
    // Nota: A criação de buckets via API pode não estar disponível
    // Dependendo da versão do Supabase
    try {
      const { data: createData, error: createError } = await supabase.storage.createBucket('imoveis-images', {
        public: true,
        fileSizeLimit: 3145728, // 3MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });

      if (createError) {
        console.error('❌ Erro ao criar bucket via API:', createError);
        return NextResponse.json({
          success: false,
          message: 'Não foi possível criar o bucket via API. Execute o script SQL manualmente.',
          error: createError,
          instructions: {
            step1: 'Acesse o Supabase Dashboard',
            step2: 'Vá para SQL Editor',
            step3: 'Execute o script em database/sql/setup/setup_storage.sql',
            step4: 'Teste novamente com /api/admin/test-storage'
          }
        });
      }

      console.log('✅ Bucket criado via API:', createData);
      return NextResponse.json({
        success: true,
        message: 'Bucket imoveis-images criado com sucesso via API!',
        bucket: createData
      });

    } catch (apiError) {
      console.error('❌ Erro na criação via API:', apiError);
      return NextResponse.json({
        success: false,
        message: 'Criação via API não disponível. Execute o script SQL manualmente.',
        error: apiError instanceof Error ? apiError.message : 'Erro desconhecido',
        instructions: {
          step1: 'Acesse o Supabase Dashboard',
          step2: 'Vá para SQL Editor', 
          step3: 'Cole e execute o script SQL abaixo:',
          sql: `
-- Configuração do Supabase Storage para imagens de imóveis
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imoveis-images',
  'imoveis-images',
  true,
  3145728, -- 3MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política RLS para leitura pública
CREATE POLICY "Permitir leitura pública de imagens de imóveis"
ON storage.objects
FOR SELECT
USING (bucket_id = 'imoveis-images');
          `,
          step4: 'Teste com: curl -X GET "http://localhost:3000/api/admin/test-storage"'
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

