-- Script simples para criar bucket (sem permissões de administrador)
-- Execute este script no Supabase SQL Editor

-- 1. Tentar criar o bucket diretamente
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imoveis-images',
  'imoveis-images',
  true,
  3145728, -- 3MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar políticas (ignorar se já existirem)
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

    -- Política de upload (mais permissiva para funcionar)
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

-- 3. Verificar se foi criado
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'imoveis-images';

