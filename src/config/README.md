# Configurações do PromptMan

Esta pasta contém todas as configurações centralizadas do PromptMan.

## Estrutura

```
src/config/
├── index.ts          # Interface unificada para todas as configurações
├── providers.json    # Configurações dos providers de IA
├── app.json         # Configurações da aplicação
└── README.md        # Esta documentação
```

## Arquivos

### `providers.json`
Configurações dos providers de IA suportados:
- **OpenAI** (GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo)
- **Google Gemini** (1.5 Flash, 1.5 Pro, Pro)
- **Anthropic Claude** (3.5 Sonnet, 3 Opus, 3 Sonnet, 3 Haiku)

Cada provider inclui:
- Configurações de API (URL, headers)
- Lista de modelos disponíveis
- Formatos de request/response
- Configurações padrão

### `app.json`
Configurações da aplicação:
- Informações do app (nome, versão, autor)
- Configurações de UI (tema, idioma, janela)
- Features habilitadas/desabilitadas
- Atalhos de teclado
- Configurações de armazenamento

### `index.ts`
Interface TypeScript unificada que:
- Exporta tipos para todas as configurações
- Fornece funções utilitárias para acessar configurações
- Centraliza o acesso às configurações

## Como Usar

### Importar configurações
```typescript
import { 
  providers, 
  getProvider, 
  getModel, 
  app,
  getUIConfig 
} from '../config'
```

### Obter provider específico
```typescript
const openaiProvider = getProvider('openai')
const gpt4Model = getModel('openai', 'gpt-4o')
```

### Acessar configurações da aplicação
```typescript
const uiConfig = getUIConfig()
const featuresConfig = getFeaturesConfig()
const shortcutsConfig = getShortcutsConfig()
```

## Adicionando Novos Providers

1. Adicione o provider em `providers.json`
2. Configure os modelos disponíveis
3. Defina os formatos de request/response
4. Atualize os tipos em `index.ts` se necessário

## Modificando Configurações

- **Providers**: Edite `providers.json`
- **Aplicação**: Edite `app.json`
- **Tipos**: Atualize `index.ts`

Todas as mudanças são automaticamente refletidas na aplicação. 