# 🚀 Guia de Releases - Vendemos Sua Casa

Este guia explica como criar e gerenciar releases do projeto.

## 📋 **Versionamento Semântico (SemVer)**

Seguimos o padrão `MAJOR.MINOR.PATCH`:

- **MAJOR** (1.0.0): Mudanças incompatíveis com versões anteriores
- **MINOR** (0.1.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.1): Correções de bugs compatíveis

### **Exemplos:**
- `v1.0.0` - Primeira versão estável
- `v1.1.0` - Nova funcionalidade (ex: sistema de agendamentos)
- `v1.1.1` - Correção de bug
- `v2.0.0` - Mudança incompatível (ex: nova arquitetura)

## 🏷️ **Como Criar uma Nova Release**

### **1. Preparar a Release**

```bash
# 1. Verificar se está na branch main
git checkout main
git pull origin main

# 2. Verificar se não há mudanças pendentes
git status

# 3. Executar testes (se houver)
npm test
npm run build
```

### **2. Atualizar o CHANGELOG.md**

```markdown
## [X.X.X] - YYYY-MM-DD

### ✨ Adicionado
- Nova funcionalidade 1
- Nova funcionalidade 2

### 🔧 Melhorado
- Melhoria 1
- Melhoria 2

### 🐛 Corrigido
- Bug fix 1
- Bug fix 2

### 🗑️ Removido
- Funcionalidade removida (se aplicável)
```

### **3. Fazer Commit das Mudanças**

```bash
# Adicionar mudanças
git add CHANGELOG.md

# Commit com mensagem padronizada
git commit -m "docs(changelog): preparar release vX.X.X

- ✅ Funcionalidades adicionadas
- ✅ Melhorias implementadas
- ✅ Bugs corrigidos
- 🎯 Preparando para release vX.X.X"
```

### **4. Criar a Tag**

```bash
# Tag anotada com descrição detalhada
git tag -a vX.X.X -m "🎉 Release vX.X.X - Descrição da versão

✨ Principais mudanças:
- Funcionalidade 1
- Funcionalidade 2
- Melhoria 1
- Bug fix 1

🚀 Pronto para produção!"
```

### **5. Enviar para o Repositório**

```bash
# Push do commit
git push origin main

# Push da tag
git push origin vX.X.X
```

## 📊 **Histórico de Releases**

### **v1.0.0** - 2024-10-12
- 🎉 **Primeira versão estável**
- ✅ Sistema de autenticação completo
- ✅ Dashboard responsivo
- ✅ Sistema de configurações
- ✅ Cadastro de imóveis
- ✅ Documentação completa

## 🔄 **Workflow de Desenvolvimento**

### **Para Novas Funcionalidades:**
1. Criar branch `feature/nome-da-funcionalidade`
2. Desenvolver e testar
3. Fazer merge para `main`
4. Atualizar `CHANGELOG.md`
5. Criar tag de versão

### **Para Correções de Bug:**
1. Criar branch `hotfix/descricao-do-bug`
2. Corrigir e testar
3. Fazer merge para `main`
4. Atualizar `CHANGELOG.md`
5. Criar tag de versão

## 📋 **Checklist para Release**

### **Antes da Release:**
- [ ] Todos os testes passando
- [ ] Build funcionando sem erros
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] README.md atualizado (se necessário)
- [ ] Código revisado

### **Durante a Release:**
- [ ] Tag criada com descrição detalhada
- [ ] Push realizado para o repositório
- [ ] Vercel detectou e fez deploy automático
- [ ] Site funcionando corretamente

### **Após a Release:**
- [ ] Verificar se o site está funcionando
- [ ] Testar funcionalidades principais
- [ ] Documentar problemas encontrados
- [ ] Planejar próxima versão

## 🚨 **Releases de Emergência (Hotfix)**

Para correções críticas em produção:

```bash
# 1. Criar branch a partir da tag atual
git checkout v1.0.0
git checkout -b hotfix/correcao-critica

# 2. Fazer a correção
# ... código da correção ...

# 3. Commit e push
git add .
git commit -m "fix: correção crítica para produção"
git push origin hotfix/correcao-critica

# 4. Merge para main
git checkout main
git merge hotfix/correcao-critica

# 5. Criar tag de patch
git tag -a v1.0.1 -m "🐛 Hotfix v1.0.1 - Correção crítica"
git push origin main
git push origin v1.0.1
```

## 📚 **Comandos Úteis**

### **Listar Tags:**
```bash
# Listar todas as tags
git tag -l

# Listar tags com descrição
git tag -n

# Ver detalhes de uma tag
git show v1.0.0
```

### **Gerenciar Tags:**
```bash
# Deletar tag local
git tag -d v1.0.0

# Deletar tag remota
git push origin --delete v1.0.0

# Renomear tag
git tag v1.0.0-new v1.0.0
git tag -d v1.0.0
git push origin v1.0.0-new
```

### **Verificar Diferenças:**
```bash
# Diferenças entre tags
git diff v1.0.0..v1.1.0

# Log entre tags
git log v1.0.0..v1.1.0 --oneline
```

## 🎯 **Próximas Versões Planejadas**

### **v1.1.0** - Próxima versão
- [ ] Sistema de agendamentos
- [ ] Gestão de propostas
- [ ] Upload de fotos de imóveis
- [ ] Sistema de notificações push

### **v1.2.0** - Futuro
- [ ] Relatórios avançados
- [ ] Integração com portais imobiliários
- [ ] Sistema de comissões
- [ ] App mobile

---

**Lembre-se: Sempre teste antes de fazer release!** 🧪
