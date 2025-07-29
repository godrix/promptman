# Informações de Uso de Tokens

O PromptMan normaliza automaticamente as informações de uso de tokens de diferentes providers, garantindo uma exibição consistente.

## Problema Resolvido

### Contexto
Cada provider de IA retorna informações de uso de tokens em formatos diferentes:
- **OpenAI:** `prompt_tokens`, `completion_tokens`, `total_tokens`
- **Gemini:** `promptTokenCount`, `candidatesTokenCount`, `totalTokenCount`
- **Anthropic:** `input_tokens`, `output_tokens`

### Solução Implementada
O sistema detecta o provider e converte automaticamente para um formato padrão.

## Como Funciona

### Normalização Automática
```typescript
const normalizeUsageData = (usage: any, provider: string) => {
  switch (provider) {
    case 'openai':
      return {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0
      }
    case 'gemini':
      return {
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0
      }
    case 'anthropic':
      return {
        promptTokens: usage.input_tokens || 0,
        completionTokens: usage.output_tokens || 0,
        totalTokens: (usage.input_tokens || 0) + (usage.output_tokens || 0)
      }
  }
}
```

### Formato Padrão
Todos os providers são convertidos para o mesmo formato:
```typescript
{
  promptTokens: number,    // Tokens do prompt de entrada
  completionTokens: number, // Tokens da resposta gerada
  totalTokens: number      // Total de tokens usados
}
```

## Configuração por Provider

### OpenAI
```json
{
  "responseFormat": {
    "usagePath": "usage"
  }
}
```

**Resposta da API:**
```json
{
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

### Google Gemini
```json
{
  "responseFormat": {
    "usagePath": "usageMetadata"
  }
}
```

**Resposta da API:**
```json
{
  "usageMetadata": {
    "promptTokenCount": 10,
    "candidatesTokenCount": 20,
    "totalTokenCount": 30
  }
}
```

### Anthropic Claude
```json
{
  "responseFormat": {
    "usagePath": "usage"
  }
}
```

**Resposta da API:**
```json
{
  "usage": {
    "input_tokens": 10,
    "output_tokens": 20
  }
}
```

## Exibição na Interface

### Formato de Exibição
As informações são exibidas no formato:
```
Uso: 10 tokens de prompt, 20 tokens de resposta (30 total)
```

### Localização
- Aparece abaixo da resposta do AI
- Separado por `---` para fácil identificação
- Incluído automaticamente em todas as respostas

## Implementação Técnica

### Extração de Dados
```typescript
// 1. Extrair dados usando o caminho configurado
const usage = getValueByPath(responseData, provider.responseFormat.usagePath)

// 2. Normalizar para formato padrão
const normalizedUsage = normalizeUsageData(usage, provider)

// 3. Incluir na resposta
const parsed: AIResponse = {
  content,
  usage: normalizedUsage
}
```

### Processamento na Interface
```typescript
// No PromptEditor
if (result.usage) {
  usageInfo = `\n\n---\nUso: ${result.usage.promptTokens} tokens de prompt, ${result.usage.completionTokens} tokens de resposta (${result.usage.totalTokens} total)`
}
```

## Benefícios

### ✅ Consistência
- Mesmo formato para todos os providers
- Interface unificada
- Experiência do usuário consistente

### ✅ Compatibilidade
- Suporte automático a novos providers
- Fallback para campos desconhecidos
- Robustez contra mudanças de API

### ✅ Transparência
- Informações claras sobre uso de tokens
- Ajuda no controle de custos
- Monitoramento de eficiência

### ✅ Manutenibilidade
- Lógica centralizada
- Fácil adição de novos providers
- Código limpo e organizado

## Extensibilidade

### Adicionando Novos Providers
Para adicionar suporte a um novo provider:

1. **Identificar a estrutura de resposta:**
```json
{
  "usage": {
    "input_count": 10,
    "output_count": 20,
    "total_count": 30
  }
}
```

2. **Adicionar caso na função:**
```typescript
case 'novo_provider':
  return {
    promptTokens: usage.input_count || 0,
    completionTokens: usage.output_count || 0,
    totalTokens: usage.total_count || 0
  }
```

3. **Configurar no providers.json:**
```json
{
  "responseFormat": {
    "usagePath": "usage"
  }
}
```

## Troubleshooting

### Problema: Informações de uso não aparecem
**Soluções:**
1. Verifique se o `usagePath` está configurado corretamente
2. Confirme se a API retorna dados de uso
3. Verifique os logs do console para debug

### Problema: Valores incorretos
**Soluções:**
1. Verifique a estrutura de resposta da API
2. Confirme se os campos estão mapeados corretamente
3. Teste com diferentes providers

### Problema: Provider não suportado
**Soluções:**
1. Adicione o caso na função `normalizeUsageData`
2. Configure o `usagePath` no `providers.json`
3. Teste a integração

## Logs e Debug

### Verificando Dados Extraídos
```typescript
console.log('Response Data:', responseData)
console.log('Extracted Usage:', usage)
console.log('Normalized Usage:', normalizedUsage)
```

### Exemplo de Saída
```
Response Data: { usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } }
Extracted Usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
Normalized Usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 }
```

## Monitoramento

### Métricas Importantes
- **Tokens de Prompt:** Eficiência do input
- **Tokens de Resposta:** Tamanho das respostas
- **Total de Tokens:** Custo total da operação

### Otimização
- Use prompts concisos para reduzir `promptTokens`
- Configure `maxTokens` adequadamente
- Monitore o uso total para controle de custos 