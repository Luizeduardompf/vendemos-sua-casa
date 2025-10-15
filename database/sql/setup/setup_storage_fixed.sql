-- Configuração do Supabase Storage para imagens de imóveis - VERSÃO CORRIGIDA
-- Execute este script no Supabase SQL Editor

-- 1. Criar bucket para imagens de imóveis (ignorar se já existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imoveis-images',
  'imoveis-images',
  true,
  3145728, -- 3MB por arquivo (3 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas RLS para o bucket (ignorar se já existirem)
DO $$
BEGIN
    -- Política de leitura pública
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Permitir leitura pública de imagens de imóveis'
    ) THEN
        CREATE POLICY "Permitir leitura pública de imagens de imóveis"
        ON storage.objects
        FOR SELECT
        USING (bucket_id = 'imoveis-images');
    END IF;

    -- Política de upload para proprietários
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Permitir upload de imagens para proprietários'
    ) THEN
        CREATE POLICY "Permitir upload de imagens para proprietários"
        ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'imoveis-images' AND
            auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;

    -- Política de atualização para proprietários
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Permitir atualização de imagens para proprietários'
    ) THEN
        CREATE POLICY "Permitir atualização de imagens para proprietários"
        ON storage.objects
        FOR UPDATE
        USING (
            bucket_id = 'imoveis-images' AND
            auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;

    -- Política de exclusão para proprietários
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Permitir exclusão de imagens para proprietários'
    ) THEN
        CREATE POLICY "Permitir exclusão de imagens para proprietários"
        ON storage.objects
        FOR DELETE
        USING (
            bucket_id = 'imoveis-images' AND
            auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

-- 3. Verificar se o bucket foi criado
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE id = 'imoveis-images';

