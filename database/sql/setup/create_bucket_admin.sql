-- Script para criar bucket como administrador
-- Execute este script no Supabase SQL Editor como administrador

-- 1. Desabilitar RLS temporariamente para criar o bucket
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- 2. Criar o bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imoveis-images',
  'imoveis-images',
  true,
  3145728, -- 3MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Reabilitar RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas para o bucket
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

-- 5. Verificar se foi criado
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'imoveis-images';

