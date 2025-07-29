# Seleção Automática de Modelos

O PromptMan agora possui uma funcionalidade inteligente que automaticamente seleciona o modelo padrão quando você troca de provider.

## Como Funciona

### Troca Automática de Modelo
Quando você altera o provider nas configurações do modelo, o sistema automaticamente:

1. **Identifica o novo provider** selecionado
2. **Busca o modelo padrão** desse provider
3. **Atualiza a configuração** com o modelo correto
4. **Mostra feedback visual** informando a mudança

### Exemplo Prático

**Cenário:** Você está usando Gemini com o modelo "2.0 Pro"

1. **Ação:** Você troca o provider para "OpenAI"
2. **Resultado Automático:** 
   - Modelo alterado para "GPT-4o" (padrão do OpenAI)
   - Toast informativo: "Modelo atualizado automaticamente para GPT-4o (padrão do openai)"

## Configuração de Modelos Padrão

### Providers e seus Modelos Padrão

#### OpenAI
- **Provider ID:** `openai`
- **Modelo Padrão:** `gpt-4o`
- **Modelos Disponíveis:**
  - GPT-4o (padrão)
  - GPT-4o Mini
  - GPT-4 Turbo
  - GPT-3.5 Turbo

#### Google Gemini
- **Provider ID:** `gemini`
- **Modelo Padrão:** `gemini-2.5-pro`
- **Modelos Disponíveis:**
  - Gemini 2.5 Pro (padrão)
  - Gemini 2.5 Flash
  - Gemini 1.5 Pro
  - Gemini 1.5 Flash

#### Anthropic Claude
- **Provider ID:** `anthropic`
- **Modelo Padrão:** `claude-3-5-sonnet`
- **Modelos Disponíveis:**
  - Claude 3.5 Sonnet (padrão)
  - Claude 3 Opus
  - Claude 3 Haiku

## Configuração

### Definindo Modelos Padrão

Os modelos padrão são configurados em `src/config/providers.json`:

```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "models": [
        {
          "id": "gpt-4o",
          "name": "gpt-4o",
          "displayName": "GPT-4o"
        }
      ]
    }
  ],
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o"
}
```

### Lógica de Seleção

1. **Provider Padrão:** Se o provider selecionado for o padrão global, usa o modelo padrão global
2. **Outros Providers:** Usa o primeiro modelo disponível na lista
3. **Fallback:** Se não houver modelos, mantém o modelo anterior

## Benefícios

### ✅ Evita Erros de Configuração
- Não é mais possível usar um modelo de Gemini com OpenAI
- Elimina erros de "modelo não encontrado"

### ✅ Experiência do Usuário Melhorada
- Troca automática e inteligente
- Feedback visual claro
- Configuração simplificada

### ✅ Flexibilidade Mantida
- Você ainda pode alterar manualmente o modelo após a troca
- Todas as configurações são preservadas

## Implementação Técnica

### Função Principal
```typescript
export const getDefaultModelForProvider = (providerId: string): Model | undefined => {
  const provider = getProvider(providerId)
  if (!provider) return undefined
  
  // Se o provider tem o modelo padrão configurado, usar ele
  if (providerId === defaultProvider) {
    return getModel(providerId, defaultModel) || provider.models[0]
  }
  
  // Caso contrário, usar o primeiro modelo disponível
  return provider.models[0]
}
```

### Hook de Configuração
```typescript
const handleModelSettingsChange = (field: keyof typeof modelSettings, value: string | number) => {
  if (field === 'provider') {
    const newProvider = value as string
    const defaultModel = getDefaultModelForProvider(newProvider)
    
    if (defaultModel) {
      setTempModelSettings(prev => ({
        ...prev,
        provider: newProvider,
        model: defaultModel.id
      }))
      
      // Feedback visual
      addToast({
        type: 'info',
        title: 'Modelo atualizado',
        description: `Modelo alterado automaticamente para ${defaultModel.displayName}`
      })
    }
  }
}
```

## Troubleshooting

### Problema: Modelo não está sendo alterado automaticamente
**Solução:** Verifique se o provider está configurado corretamente em `providers.json`

### Problema: Toast não aparece
**Solução:** Verifique se o contexto de toast está funcionando corretamente

### Problema: Modelo incorreto sendo selecionado
**Solução:** Verifique a ordem dos modelos no arquivo de configuração

## Desenvolvimento

### Adicionando Novos Providers
1. Adicione o provider em `providers.json`
2. Defina o modelo padrão na configuração
3. A funcionalidade funcionará automaticamente

### Modificando a Lógica
- A lógica principal está em `src/config/index.ts`
- O hook está em `src/screen/PromptEditor/index.tsx`
- Teste sempre após modificações 