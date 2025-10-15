# 🗄️ Configuração do Supabase Storage para Imagens

## **📋 Passos para Configurar:**

### **1. Executar Script SQL no Supabase:**
```sql
-- Execute o arquivo database/sql/setup/setup_storage.sql no Supabase SQL Editor
```

### **2. Configurar Bucket no Supabase Dashboard:**
1. Acesse o **Supabase Dashboard**
2. Vá para **Storage** → **Buckets**
3. Verifique se o bucket `imoveis-images` foi criado
4. Configure as políticas RLS se necessário

### **3. Testar a Configuração:**
```bash
# Testar upload de imagem
curl -X POST "http://localhost:3000/api/imovel/[IMOVEL_ID]/upload-image" \
  -F "file=@imagem.jpg" \
  -F "titulo=Cozinha Principal" \
  -F "descricao=Cozinha espaçosa" \
  -F "categoria=interior" \
  -F "principal=true"

# Testar geração de imagens com storage
curl -X POST "http://localhost:3000/api/admin/generate-realistic-images-storage"
```

## **🔧 APIs Disponíveis:**

### **Upload de Imagem:**
- **POST** `/api/imovel/[id]/upload-image`
- **Body**: FormData com arquivo + metadados
- **Retorna**: URL pública da imagem

### **Deletar Imagem:**
- **DELETE** `/api/imovel/[id]/delete-image`
- **Body**: `{ "imageId": "uuid" }`
- **Retorna**: Confirmação de exclusão

### **Gerar Imagens Realistas:**
- **POST** `/api/admin/generate-realistic-images-storage`
- **Retorna**: Imagens baixadas e armazenadas no Supabase

## **📁 Estrutura de Arquivos no Storage:**

```
imoveis-images/
├── [imovel-uuid-1]/
│   ├── imagem_1.jpg
│   ├── imagem_2.jpg
│   └── imagem_3.jpg
├── [imovel-uuid-2]/
│   ├── imagem_1.jpg
│   └── imagem_2.jpg
└── ...
```

## **🔒 Políticas de Segurança:**

- **Leitura**: Pública (qualquer um pode ver as imagens)
- **Upload**: Apenas proprietários do imóvel
- **Exclusão**: Apenas proprietários do imóvel
- **Atualização**: Apenas proprietários do imóvel

## **💡 Vantagens do Supabase Storage:**

✅ **Controle total** sobre as imagens
✅ **URLs públicas** para acesso direto
✅ **CDN global** para performance
✅ **Políticas RLS** para segurança
✅ **Integração nativa** com Supabase
✅ **Escalabilidade** automática
✅ **Backup automático** dos arquivos

## **🚀 Próximos Passos:**

1. **Execute o script SQL** no Supabase
2. **Teste as APIs** de upload
3. **Integre o componente** `ImageUpload` nas páginas
4. **Migre as imagens existentes** se necessário
5. **Configure monitoramento** de uso do storage

## **📊 Monitoramento:**

- **Uso de Storage**: Supabase Dashboard → Storage → Usage
- **Logs de Upload**: Supabase Dashboard → Logs
- **Políticas RLS**: Supabase Dashboard → Authentication → Policies

