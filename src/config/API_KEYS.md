# Sistema de Chaves de API por Provider

O PromptMan agora suporta chaves de API específicas para cada provider de IA, permitindo que você use diferentes serviços simultaneamente.

## Como Funciona

### Estrutura de Dados
```typescript
interface ModelSettings {
  provider: string          // ID do provider atual (ex: "openai", "gemini")
  model: string            // ID do modelo atual
  temperature: number      // Temperatura para geração
  maxTokens: number        // Máximo de tokens
  apiKeys: {              // Chaves de API por provider
    [providerId]: string   // Chave específica para cada provider
  }
}
```

### Exemplo de Configuração
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "temperature": 0.7,
  "maxTokens": 4096,
  "apiKeys": {
    "openai": "sk-...",
    "gemini": "AIza...",
    "anthropic": "sk-ant-..."
  }
}
```

## Como Configurar

### 1. Acessar Configurações
- Clique no botão **"Model Settings"** no PromptEditor
- O modal de configurações será aberto

### 2. Selecionar Provider
- Escolha o provider desejado no dropdown
- O campo de API Key será atualizado automaticamente

### 3. Configurar API Key
- Digite a chave de API específica para o provider selecionado
- A chave será salva automaticamente para esse provider
- Você pode configurar chaves para múltiplos providers

### 4. Testar Conexão
- Clique em **"Test Connection"** para verificar se a chave está funcionando
- Se houver erro, verifique se a chave está correta

## Providers Suportados

### OpenAI
- **Chave**: Começa com `sk-`
- **Formato**: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Obtida em**: https://platform.openai.com/api-keys

### Google Gemini
- **Chave**: Começa com `AIza`
- **Formato**: `AIzaSyC...`
- **Obtida em**: https://makersuite.google.com/app/apikey

### Anthropic Claude
- **Chave**: Começa com `sk-ant-`
- **Formato**: `sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Obtida em**: https://console.anthropic.com/

## Funcionalidades

### ✅ Troca Automática de Chaves
- Ao trocar de provider, a chave correta é automaticamente usada
- Não é necessário reconfigurar a chave a cada troca

### ✅ Múltiplas Chaves Simultâneas
- Você pode ter chaves configuradas para todos os providers
- Troque entre providers sem perder as configurações

### ✅ Validação por Provider
- O sistema verifica se a chave está configurada para o provider atual
- Mensagens de erro específicas para cada provider

### ✅ Persistência
- As chaves são salvas localmente e persistem entre sessões
- Configurações são mantidas mesmo após reiniciar a aplicação

## Segurança

### 🔒 Armazenamento Local
- As chaves são salvas apenas no seu computador
- Não são enviadas para servidores externos
- Usam criptografia local do Electron

### 🔒 Campo de Senha
- O campo de API Key é do tipo `password`
- A chave não é exibida em texto claro
- Recomenda-se não compartilhar a configuração

## Troubleshooting

### Erro: "Chave de API não configurada"
- Verifique se você configurou a chave para o provider atual
- Acesse Model Settings e configure a chave correta

### Erro: "Provider não encontrado"
- Verifique se o provider está listado em `src/config/providers.json`
- Certifique-se de que o ID do provider está correto

### Erro de Autenticação
- Verifique se a chave de API está correta
- Certifique-se de que a chave tem permissões adequadas
- Teste a chave diretamente na plataforma do provider

## Desenvolvimento

### Adicionando Novos Providers
1. Adicione o provider em `src/config/providers.json`
2. Configure o formato de request/response
3. O sistema automaticamente suportará chaves específicas

### Modificando Validações
- As validações estão em `src/services/ai/aiService.ts`
- Funções utilitárias em `src/store/modelSettings.ts` 