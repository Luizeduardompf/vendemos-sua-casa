-- Configuração do Supabase Storage para imagens de imóveis
-- Execute este script no Supabase SQL Editor

-- 1. Criar bucket para imagens de imóveis
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imoveis-images',
  'imoveis-images',
  true,
  3145728, -- 3MB por arquivo (3 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Política RLS para o bucket
CREATE POLICY "Permitir leitura pública de imagens de imóveis"
ON storage.objects
FOR SELECT
USING (bucket_id = 'imoveis-images');

CREATE POLICY "Permitir upload de imagens para proprietários"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'imoveis-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Permitir atualização de imagens para proprietários"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'imoveis-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Permitir exclusão de imagens para proprietários"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'imoveis-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Comentário sobre URLs públicas
-- As URLs públicas são geradas automaticamente pelo Supabase Storage
-- Formato: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
-- Use a função getPublicUrl() do cliente JavaScript/TypeScript
