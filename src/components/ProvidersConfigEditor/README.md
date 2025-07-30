# ProvidersConfigEditor

Componente para editar o arquivo `providers.json` através da interface gráfica do PromptMan.

## Funcionalidades

### ✅ Edição Visual
- Interface similar ao VS Code para editar configurações JSON
- Editor com syntax highlighting para JSON
- Validação em tempo real da sintaxe

### ✅ Validação de Configuração
- Validação da estrutura do JSON
- Verificação de campos obrigatórios
- Validação de tipos de dados
- Mensagens de erro claras e específicas

### ✅ Persistência
- Salvamento automático no arquivo `providers.json`
- Backup automático antes de salvar
- Recarregamento da configuração atual

### ✅ Interface Intuitiva
- Botão com ícone de código `{}` e texto "providers.json"
- Modal responsivo e bem dimensionado
- Botões de ação (Salvar, Resetar)
- Indicadores visuais de estado

## Como Usar

### 1. Acessar o Editor
- Clique no botão `{} providers.json` na seção de configurações do PromptEditor
- O modal será aberto com a configuração atual carregada

### 2. Editar Configuração
- Modifique o JSON conforme necessário
- O editor valida automaticamente a sintaxe
- Erros são exibidos em tempo real

### 3. Salvar Alterações
- Clique em "Salvar" para aplicar as mudanças
- O arquivo `providers.json` será atualizado
- Um backup será criado automaticamente

### 4. Resetar Mudanças
- Clique em "Resetar" para voltar à configuração original
- Útil para desfazer alterações não salvas

## Estrutura da Configuração

O arquivo `providers.json` deve seguir esta estrutura:

```json
{
  "providers": [
    {
      "id": "provider-id",
      "name": "Provider Name",
      "displayName": "Display Name",
      "baseUrl": "https://api.provider.com",
      "models": [
        {
          "id": "model-id",
          "name": "model-name",
          "displayName": "Model Display Name",
          "maxTokens": 4096,
          "defaultTemperature": 0.7,
          "defaultMaxTokens": 4096
        }
      ],
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer {apiKey}"
      },
      "requestFormat": {
        "method": "POST",
        "endpoint": "/chat/completions",
        "body": {}
      },
      "responseFormat": {
        "contentPath": "choices[0].message.content",
        "usagePath": "usage",
        "errorPath": "error.message"
      }
    }
  ],
  "defaultProvider": "provider-id",
  "defaultModel": "model-id",
  "defaultSettings": {
    "temperature": 0.7,
    "maxTokens": 4096,
    "topP": 1,
    "frequencyPenalty": 0,
    "presencePenalty": 0,
    "topK": 1,
    "stopSequences": [],
    "seed": null
  }
}
```

## Validações Implementadas

### Estrutura Geral
- ✅ Objeto JSON válido
- ✅ Array `providers` obrigatório
- ✅ String `defaultProvider` obrigatória
- ✅ String `defaultModel` obrigatória
- ✅ Objeto `defaultSettings` obrigatório

### Providers
- ✅ Cada provider deve ter `id`, `name`, `displayName`
- ✅ Array `models` obrigatório
- ✅ Objetos `requestFormat` e `responseFormat` obrigatórios

### Models
- ✅ Cada modelo deve ter `id`, `name`, `displayName`
- ✅ Campos numéricos: `maxTokens`, `defaultTemperature`, `defaultMaxTokens`

## Arquitetura

### Componentes
- `ProvidersConfigEditor/index.tsx` - Componente principal
- `ProvidersConfigEditor/styles.ts` - Estilos styled-components

### Serviços
- `configService.ts` - Serviço para leitura/escrita do arquivo
- Handlers IPC no `electron/main.ts`

### Integração
- Importado no `PromptEditor/index.tsx`
- Traduções em `strings.ts`
- Estilos integrados ao tema da aplicação

## Segurança

### Backup Automático
- Arquivo `.backup` criado antes de cada salvamento
- Permite recuperação em caso de erro

### Validação Rigorosa
- Validação completa antes do salvamento
- Previne configurações inválidas

### Tratamento de Erros
- Mensagens de erro claras
- Logs detalhados para debugging
- Fallback para configuração padrão

## Desenvolvimento

### Adicionando Novos Campos
1. Atualizar interface `ProvidersConfig` no componente
2. Adicionar validações no `configService.ts`
3. Atualizar documentação

### Modificando Validações
- Editar método `validateProvidersConfig` no `configService.ts`
- Testar com diferentes configurações

### Estilização
- Modificar `ProvidersConfigEditor/styles.ts`
- Seguir padrões do tema da aplicação
