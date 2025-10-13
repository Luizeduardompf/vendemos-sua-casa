# 🚀 Como Usar Este Template

## 📋 **Passos para Criar um Novo Projeto**

### 1. **Clone o Template**
```bash
git clone https://github.com/seu-usuario/Base_Docker_NextJS_Supabase.git meu-novo-projeto
cd meu-novo-projeto
```

### 2. **Renomeie o Projeto**
```bash
# Atualize o nome no package.json
npm pkg set name="meu-novo-projeto"

# Atualize o título no layout.tsx
# Edite: src/app/layout.tsx -> title: 'Meu Novo Projeto'
```

### 3. **Configure Supabase**
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite .env.local com suas credenciais do Supabase
```

### 4. **Crie Tabelas no Supabase**
Execute o SQL fornecido no README.md para criar as tabelas necessárias.

### 5. **Inicie o Desenvolvimento**
```bash
docker-compose up --build
```

## 🔧 **Personalizações Comuns**

### **Alterar Nome do Container**
Edite `docker-compose.yml`:
```yaml
container_name: meu-projeto-app
image: meu-projeto-nextjs:1.0
```

### **Adicionar Novas Dependências**
```bash
# Dentro do container
docker-compose exec app npm install nova-dependencia

# Ou fora do container
docker-compose exec app npm install --save nova-dependencia
```

### **Adicionar Componentes shadcn/ui**
```bash
docker-compose exec app npx shadcn@latest add componente-nome
```

## 📁 **Estrutura do Projeto**

```
src/
├── app/                    # Páginas Next.js
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── providers/         # Providers (Theme, etc)
│   └── insights/          # Speed Insights
├── lib/                   # Utilitários e configurações
└── middleware.ts          # Middleware de autenticação
```

## 🎯 **Próximos Passos**

1. **Customize** a página inicial em `src/app/page.tsx`
2. **Adicione** suas próprias páginas em `src/app/`
3. **Configure** autenticação se necessário
4. **Adicione** suas tabelas no Supabase
5. **Deploy** quando estiver pronto!

## 🆘 **Problemas Comuns**

- **Erro de permissão**: `sudo chown -R $USER:$USER .`
- **Container não inicia**: `docker-compose down -v && docker-compose up --build`
- **Hot reload não funciona**: Verifique se o volume está montado corretamente
