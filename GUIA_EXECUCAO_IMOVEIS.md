# 🏠 Guia de Execução - Schema de Imóveis

## 📋 Resumo
Este guia explica como executar o schema completo de imóveis no Supabase, incluindo todas as tabelas necessárias e dados de exemplo.

## 🎯 O que será criado

### **Tabelas Principais:**
1. **`imoveis`** - Tabela principal com todos os dados do imóvel
2. **`imoveis_media`** - Fotos, vídeos e documentos dos imóveis
3. **`imoveis_amenities`** - Comodidades e características
4. **`imoveis_views`** - Estatísticas de visualizações
5. **`imoveis_favoritos`** - Favoritos dos utilizadores
6. **`imoveis_contatos`** - Contactos e interesses

### **Funcionalidades:**
- ✅ URLs amigáveis (slugs)
- ✅ Geolocalização (PostGIS)
- ✅ Múltiplas mídias por imóvel
- ✅ Sistema de favoritos
- ✅ Estatísticas de visualizações
- ✅ Gestão de contactos
- ✅ Triggers automáticos
- ✅ Views otimizadas
- ✅ Índices de performance

## 🚀 Como Executar

### **Opção 1: Execução Completa (Recomendada)**
1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. **PRIMEIRO**: Execute `database/sql/LIMPAR_IMOVEIS.sql` (para limpar objetos existentes)
4. **SEGUNDO**: Execute `database/sql/EXECUTAR_IMOVEIS_COMPLETO.sql`
5. Clique em **Run** para executar cada script

### **Opção 2: Execução por Partes**
1. Execute primeiro: `database/sql/setup/create_imoveis_schema.sql`
2. Execute depois: `database/sql/setup/insert_imoveis_sample_data.sql`

### **Opção 3: Se der erro de "já existe"**
1. Execute `database/sql/LIMPAR_IMOVEIS.sql` primeiro
2. Depois execute `database/sql/EXECUTAR_IMOVEIS_COMPLETO.sql`

### **Opção 4: Usar usuários existentes (Recomendada se der erro de NIF)**
1. Execute `database/sql/LIMPAR_IMOVEIS.sql` primeiro
2. Execute `database/sql/EXECUTAR_IMOVEIS_USUARIOS_EXISTENTES.sql`
3. Este script usa os usuários proprietários já cadastrados no sistema

### **Opção 5: Muitos exemplos para usuários existentes (Recomendada para testes)**
1. Execute `database/sql/LIMPAR_IMOVEIS.sql` primeiro
2. Execute `database/sql/EXECUTAR_IMOVEIS_MUITOS_EXEMPLOS.sql`
3. Este script cria 5-8 imóveis variados para cada proprietário existente
4. Inclui mídias, comodidades, visualizações, favoritos e contatos

### **Opção 6: Script completo com muitos exemplos (Mais fácil)**
1. Execute apenas `database/sql/EXECUTAR_IMOVEIS_MUITOS_EXEMPLOS_COMPLETO.sql`
2. Este script faz tudo: limpa, cria tabelas e insere muitos exemplos
3. Cria 5-8 imóveis variados para cada proprietário existente
4. Inclui mídias, comodidades, visualizações, favoritos e contatos

### **Opção 7: Script final analisado e corrigido (RECOMENDADO)**
1. Execute apenas `database/sql/EXECUTAR_IMOVEIS_FINAL.sql`
2. Este script analisa a estrutura existente e cria tudo corretamente
3. Verifica se a tabela users existe e tem proprietários
4. Gera códigos postais válidos e slugs únicos
5. Cria 5-8 imóveis variados para cada proprietário existente
6. Inclui mídias, comodidades, visualizações, favoritos e contatos

## 📊 Dados de Exemplo Incluídos

### **5 Imóveis de Exemplo:**
1. **Apartamento T2** - €250.000 (Lisboa)
2. **Casa T3** - €350.000 (Lisboa) 
3. **Terreno** - €180.000 (Almada)
4. **Loja Comercial** - €1.200/mês (Lisboa)
5. **Escritório** - €450.000 ou €2.500/mês (Lisboa)

### **Dados Associados:**
- 📸 **Fotos** para cada imóvel
- ⭐ **Comodidades** (varanda, jardim, garagem, etc.)
- 👀 **Visualizações** simuladas
- ❤️ **Favoritos** de exemplo
- 📞 **Contactos** de interessados

## 🔍 Verificação Pós-Execução

### **1. Verificar Tabelas Criadas:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'imoveis%';
```

### **2. Verificar Dados Inseridos:**
```sql
SELECT COUNT(*) as total_imoveis FROM imoveis;
SELECT COUNT(*) as total_media FROM imoveis_media;
SELECT COUNT(*) as total_amenities FROM imoveis_amenities;
```

### **3. Testar Views:**
```sql
SELECT * FROM imoveis_completos LIMIT 5;
SELECT * FROM imoveis_publicos LIMIT 5;
```

## ⚠️ Pré-requisitos

### **Antes de executar, certifique-se de que:**
- ✅ Existe pelo menos 1 utilizador com `user_type = 'proprietario'`
- ✅ O Supabase está configurado e funcionando
- ✅ Tem permissões de administrador no projeto

### **Se não existir utilizador proprietário:**
```sql
-- Criar utilizador proprietário de exemplo
INSERT INTO users (
  auth_user_id,
  email,
  nome_completo,
  user_type,
  is_verified,
  is_active
) VALUES (
  gen_random_uuid(), -- Substitua por um UUID real do auth.users
  'proprietario@exemplo.com',
  'João Proprietário',
  'proprietario',
  TRUE,
  TRUE
);
```

## 🛠️ Estrutura Detalhada

### **Tabela `imoveis` (Campos Principais):**
- **Identificação**: `id`, `proprietario_id`, `slug`
- **Básicos**: `titulo`, `descricao`, `tipo_imovel`, `categoria`
- **Preço**: `preco_venda`, `preco_arrendamento`, `moeda`
- **Localização**: `morada`, `codigo_postal`, `localidade`, `distrito`, `coordenadas`
- **Características**: `area_total`, `quartos`, `casas_banho`, `ano_construcao`
- **Status**: `status`, `visibilidade`, `data_publicacao`
- **Estatísticas**: `visualizacoes`, `favoritos`, `contactos`

### **Tabela `imoveis_media`:**
- **Arquivo**: `nome_arquivo`, `caminho_arquivo`, `url_publica`
- **Metadados**: `largura`, `altura`, `mime_type`, `tamanho_bytes`
- **Organização**: `ordem`, `categoria`, `principal`, `tags`

### **Tabela `imoveis_amenities`:**
- **Categorias**: `exterior`, `interior`, `cozinha`, `aquecimento`, etc.
- **Detalhes**: `nome`, `descricao`, `disponivel`

## 🎉 Após a Execução

### **O que estará disponível:**
1. **5 imóveis** prontos para teste
2. **Sistema completo** de gestão de imóveis
3. **APIs** prontas para integração
4. **Dados realistas** para desenvolvimento

### **Próximos passos:**
1. Testar as APIs de imóveis
2. Integrar com o frontend
3. Implementar upload de imagens
4. Adicionar mais funcionalidades

## 🆘 Resolução de Problemas

### **Erro: "relation users does not exist"**
- Execute primeiro o schema de utilizadores
- Verifique se a tabela `users` existe

### **Erro: "permission denied"**
- Verifique se tem permissões de administrador
- Execute como superuser se necessário

### **Erro: "duplicate key value"**
- Os dados de exemplo já foram inseridos
- Pode ignorar ou limpar as tabelas primeiro

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Confirme que todas as dependências estão criadas
3. Execute os scripts na ordem correta
4. Verifique as permissões do utilizador

---

**🎯 Resultado Final:** Sistema completo de gestão de imóveis com dados de exemplo, pronto para desenvolvimento e teste!
