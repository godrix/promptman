# Arquitetura de Providers de IA

Esta arquitetura permite adicionar facilmente novos providers de IA ao sistema de forma modular e extensível.

## Estrutura

```
src/services/ai/
├── types.ts              # Tipos base da arquitetura
├── aiService.ts          # Serviço principal que gerencia requisições
├── providers/
│   ├── index.ts          # Registro central de providers
│   ├── gemini.ts         # Provider do Google Gemini
│   └── openai.ts         # Provider do OpenAI (exemplo)
└── README.md             # Esta documentação
```

## Como Adicionar um Novo Provider

### 1. Criar o arquivo do provider

Crie um novo arquivo em `src/services/ai/providers/` seguindo o padrão:

```typescript
// src/services/ai/providers/novo-provider.ts
import { AIProvider, AIRequestParams, AIRequest, AIResponse } from '../types'

const buildNovoProviderRequest = (params: AIRequestParams): AIRequest => {
  const { prompt, systemPrompt, model, temperature, maxTokens, apiKey } = params
  
  // Construir a requisição específica do provider
  return {
    url: 'https://api.novo-provider.com/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: {
      // Estrutura específica do provider
      messages: [
        { role: 'user', content: prompt }
      ],
      model,
      temperature,
      max_tokens: maxTokens
    }
  }
}

const parseNovoProviderResponse = (response: any): AIResponse => {
  // Parsear a resposta específica do provider
  if (response.error) {
    return {
      content: '',
      error: response.error.message
    }
  }

  return {
    content: response.choices?.[0]?.message?.content || '',
    usage: response.usage ? {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens
    } : undefined
  }
}

export const novoProvider: AIProvider = {
  name: 'NovoProvider',
  displayName: 'Novo Provider',
  models: [
    {
      id: 'modelo-1',
      name: 'modelo-1',
      displayName: 'Modelo 1',
      maxTokens: 4096
    }
  ],
  config: {
    baseUrl: 'https://api.novo-provider.com/v1',
    headers: {
      'Content-Type': 'application/json'
    },
    requestBuilder: buildNovoProviderRequest,
    responseParser: parseNovoProviderResponse
  }
}
```

### 2. Registrar o provider

Adicione o provider ao registro em `src/services/ai/providers/index.ts`:

```typescript
import { novoProvider } from './novo-provider'

export const providers: Record<string, AIProvider> = {
  'Gemini': geminiProvider,
  'OpenAI': openaiProvider,
  'NovoProvider': novoProvider  // Adicionar aqui
}
```

### 3. O provider estará automaticamente disponível

O novo provider aparecerá automaticamente na interface do usuário sem necessidade de alterações adicionais no código.

## Características da Arquitetura

### ✅ Vantagens

- **Modular**: Cada provider é independente
- **Extensível**: Fácil adição de novos providers
- **Tipado**: TypeScript garante consistência
- **Flexível**: Cada provider pode ter sua própria estrutura de requisição/resposta
- **Centralizado**: Um único serviço gerencia todos os providers

### 🔧 Funcionalidades

- **Substituição de variáveis**: Automática nos prompts
- **Tratamento de erros**: Padronizado para todos os providers
- **Teste de conectividade**: Método para verificar se a API está funcionando
- **Informações de uso**: Tokens consumidos (quando disponível)

### 📝 Exemplos de Uso

```typescript
// Usar o serviço
const result = await aiService.generateResponse(
  'Olá, como você está?',
  'Você é um assistente útil.',
  {
    provider: 'Gemini',
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 2048,
    apiKey: 'sua-api-key'
  },
  { nome: 'João' } // variáveis
)

// Testar conectividade
const testResult = await aiService.testConnection(settings)
```

## Providers Disponíveis

### Google Gemini
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta`
- **Autenticação**: API Key via query parameter
- **Modelos**: gemini-pro, gemini-pro-vision, gemini-1.5-pro, gemini-1.5-flash

### OpenAI
- **Endpoint**: `https://api.openai.com/v1`
- **Autenticação**: Bearer token
- **Modelos**: gpt-4, gpt-4-turbo, gpt-3.5-turbo

## Contribuindo

Para adicionar um novo provider:

1. Crie o arquivo do provider seguindo o padrão
2. Implemente as funções `requestBuilder` e `responseParser`
3. Registre o provider no `index.ts`
4. Teste a integração
5. Documente as características específicas do provider 