-- Apenas as políticas (assumindo que o bucket já existe)
-- Execute este script no Supabase SQL Editor

-- Políticas RLS para o bucket imoveis-images
DO $$
BEGIN
    -- Política de leitura pública
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir leitura pública de imagens de imóveis'
    ) THEN
        EXECUTE 'CREATE POLICY "Permitir leitura pública de imagens de imóveis"
        ON storage.objects
        FOR SELECT
        USING (bucket_id = ''imoveis-images'')';
    END IF;

    -- Política de upload (permissiva)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir upload de imagens'
    ) THEN
        EXECUTE 'CREATE POLICY "Permitir upload de imagens"
        ON storage.objects
        FOR INSERT
        WITH CHECK (bucket_id = ''imoveis-images'')';
    END IF;

    -- Política de atualização
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir atualização de imagens'
    ) THEN
        EXECUTE 'CREATE POLICY "Permitir atualização de imagens"
        ON storage.objects
        FOR UPDATE
        USING (bucket_id = ''imoveis-images'')';
    END IF;

    -- Política de exclusão
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir exclusão de imagens'
    ) THEN
        EXECUTE 'CREATE POLICY "Permitir exclusão de imagens"
        ON storage.objects
        FOR DELETE
        USING (bucket_id = ''imoveis-images'')';
    END IF;
END $$;

-- Verificar se o bucket existe
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'imoveis-images';

