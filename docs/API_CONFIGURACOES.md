# API de Configurações do Utilizador

Este documento descreve as APIs disponíveis para gerenciar as configurações do utilizador.

## Endpoints Disponíveis

### 1. GET /api/user/configuracoes
**Descrição:** Busca todas as configurações do utilizador autenticado.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "configuracoes": {
    "modo_escuro": false,
    "notificacoes_email": true,
    "notificacoes_push": true,
    "notificacoes_sms": false,
    "idioma": "pt",
    "fuso_horario": "Europe/Lisbon",
    "privacidade_perfil": "publico",
    "marketing_emails": false,
    "tema_cor": "azul",
    "tamanho_fonte": "medio",
    "compacto": false,
    "animacoes": true,
    "som_notificacoes": true,
    "vibracao": true
  }
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Token de autorização não encontrado"
}
```

### 2. PUT /api/user/configuracoes
**Descrição:** Atualiza as configurações do utilizador.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "modo_escuro": true,
  "notificacoes_email": false,
  "tema_cor": "verde"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Configurações atualizadas com sucesso",
  "configuracoes": {
    "modo_escuro": true,
    "notificacoes_email": false,
    "tema_cor": "verde",
    // ... outras configurações
  }
}
```

### 3. GET /api/user/configuracoes/categoria?categoria=<categoria>
**Descrição:** Busca configurações de uma categoria específica.

**Parâmetros de Query:**
- `categoria`: Categoria das configurações (`aparencia`, `notificacoes`, `privacidade`, `sistema`)

**Exemplo:**
```
GET /api/user/configuracoes/categoria?categoria=aparencia
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "categoria": "aparencia",
  "configuracoes": {
    "modo_escuro": false,
    "tema_cor": "azul",
    "tamanho_fonte": "medio",
    "compacto": false,
    "animacoes": true
  }
}
```

### 4. POST /api/user/configuracoes/reset
**Descrição:** Reseta todas as configurações para os valores padrão.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Configurações resetadas para os valores padrão",
  "configuracoes": {
    "modo_escuro": false,
    "notificacoes_email": true,
    // ... configurações padrão
  }
}
```

## Configurações Disponíveis

### Aparência
- `modo_escuro`: boolean - Ativa/desativa modo escuro
- `tema_cor`: string - Cor do tema (azul, verde, roxo, etc.)
- `tamanho_fonte`: string - Tamanho da fonte (pequeno, medio, grande)
- `compacto`: boolean - Interface compacta
- `animacoes`: boolean - Animações da interface

### Notificações
- `notificacoes_email`: boolean - Notificações por email
- `notificacoes_push`: boolean - Notificações push
- `notificacoes_sms`: boolean - Notificações por SMS
- `som_notificacoes`: boolean - Som das notificações
- `vibracao`: boolean - Vibração das notificações

### Privacidade
- `privacidade_perfil`: string - Visibilidade do perfil (publico, privado, agentes_apenas)
- `marketing_emails`: boolean - Emails de marketing

### Sistema
- `idioma`: string - Idioma da interface (pt, en, es)
- `fuso_horario`: string - Fuso horário (Europe/Lisbon, America/New_York, etc.)

## Códigos de Erro

- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (token inválido ou ausente)
- `404` - Not Found (utilizador não encontrado)
- `500` - Internal Server Error (erro interno do servidor)

## Exemplo de Uso

```javascript
// Buscar configurações
const response = await fetch('/api/user/configuracoes', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// Atualizar configurações
const updateResponse = await fetch('/api/user/configuracoes', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    modo_escuro: true,
    notificacoes_email: false
  })
});
```

## Segurança

- Todas as APIs requerem autenticação via token Bearer
- As configurações são específicas de cada utilizador
- Apenas o utilizador autenticado pode acessar suas próprias configurações
- Validação de dados de entrada para prevenir ataques
