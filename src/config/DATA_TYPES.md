# Tipos de Dados nas APIs

O PromptMan gerencia automaticamente os tipos de dados necessários para cada API, garantindo compatibilidade total.

## Problema Resolvido

### Contexto
Diferentes APIs esperam tipos específicos de dados:
- **OpenAI:** `max_tokens` como integer, `temperature` como decimal
- **Gemini:** `maxOutputTokens` como integer, `temperature` como decimal
- **Anthropic:** `max_tokens` como integer, `temperature` como decimal

### Solução Implementada
O sistema detecta automaticamente campos numéricos e os converte para o tipo correto.

## Como Funciona

### Detecção de Campos Numéricos
```typescript
// A função replaceInObject detecta placeholders específicos
if (typeof value === 'string' && value.includes('{maxTokens}')) {
  newObj[key] = settings.maxTokens  // Número inteiro
} else if (typeof value === 'string' && value.includes('{temperature}')) {
  newObj[key] = settings.temperature  // Número decimal
} else {
  newObj[key] = replaceInObject(value)  // Processamento normal
}
```

### Campos Suportados

#### maxTokens / max_tokens
- **Tipo Esperado:** Integer
- **Placeholder:** `{maxTokens}`
- **Exemplo:** `4096`

#### temperature
- **Tipo Esperado:** Decimal
- **Placeholder:** `{temperature}`
- **Exemplo:** `0.7`

#### Campos de Texto
- **Tipo Esperado:** String
- **Placeholders:** `{model}`, `{systemPrompt}`, `{userPrompt}`, `{fullPrompt}`
- **Exemplo:** `"gpt-4o"`, `"Você é um assistente útil"`

## Configuração por Provider

### OpenAI
```json
{
  "requestFormat": {
    "body": {
      "model": "{model}",
      "messages": [...],
      "temperature": "{temperature}",
      "max_tokens": "{maxTokens}"
    }
  }
}
```

### Google Gemini
```json
{
  "requestFormat": {
    "body": {
      "contents": [...],
      "generationConfig": {
        "temperature": "{temperature}",
        "maxOutputTokens": "{maxTokens}"
      }
    }
  }
}
```

### Anthropic Claude
```json
{
  "requestFormat": {
    "body": {
      "model": "{model}",
      "max_tokens": "{maxTokens}",
      "temperature": "{temperature}",
      "messages": [...]
    }
  }
}
```

## Implementação Técnica

### Função Principal
```typescript
const replaceInObject = (obj: any): any => {
  if (typeof obj === 'string') {
    // Processamento de strings (texto)
    return obj
      .replace('{model}', model.name)
      .replace('{systemPrompt}', processedSystemPrompt)
      .replace('{userPrompt}', processedPrompt)
      .replace('{fullPrompt}', fullPrompt)
      .replace('{temperature}', settings.temperature.toString())
      .replace('{maxTokens}', settings.maxTokens.toString())
  } else if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(replaceInObject)
    } else {
      const newObj: any = {}
      Object.entries(obj).forEach(([key, value]) => {
        // Detecção especial para campos numéricos
        if (typeof value === 'string' && value.includes('{maxTokens}')) {
          newObj[key] = settings.maxTokens  // Integer
        } else if (typeof value === 'string' && value.includes('{temperature}')) {
          newObj[key] = settings.temperature  // Decimal
        } else {
          newObj[key] = replaceInObject(value)  // Processamento normal
        }
      })
      return newObj
    }
  }
  return obj
}
```

## Benefícios

### ✅ Compatibilidade Universal
- Funciona com todas as APIs sem configuração adicional
- Detecta automaticamente o tipo correto para cada campo

### ✅ Manutenibilidade
- Lógica centralizada em uma função
- Fácil adição de novos tipos de campos

### ✅ Robustez
- Fallback para processamento normal de strings
- Não quebra APIs existentes

### ✅ Performance
- Detecção eficiente de placeholders
- Conversão direta sem processamento desnecessário

## Extensibilidade

### Adicionando Novos Tipos
Para adicionar suporte a novos tipos de campos:

1. **Identificar o placeholder** (ex: `{topP}`)
2. **Determinar o tipo esperado** (ex: decimal)
3. **Adicionar condição na função:**

```typescript
} else if (typeof value === 'string' && value.includes('{topP}')) {
  newObj[key] = settings.topP  // Decimal
```

### Exemplo: Adicionando top_p
```typescript
// No providers.json
{
  "requestFormat": {
    "body": {
      "top_p": "{topP}"
    }
  }
}

// Na função replaceInObject
} else if (typeof value === 'string' && value.includes('{topP}')) {
  newObj[key] = settings.topP
```

## Troubleshooting

### Problema: Campo ainda sendo enviado como string
**Solução:** Verifique se o placeholder está correto no `providers.json`

### Problema: Valor incorreto sendo enviado
**Solução:** Verifique se o campo existe em `settings` e tem o tipo correto

### Problema: Novo provider não funciona
**Solução:** Verifique se os placeholders estão configurados corretamente

## Logs e Debug

### Verificando Tipos Enviados
```typescript
console.log('AI Request:', {
  url: `${provider.baseUrl}${url}`,
  method: provider.requestFormat.method,
  headers: headers,
  body: processedBody  // Verifique os tipos aqui
})
```

### Exemplo de Saída Correta
```json
{
  "model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 4096,
  "messages": [...]
}
```

**Nota:** `temperature` e `max_tokens` são números, não strings. 