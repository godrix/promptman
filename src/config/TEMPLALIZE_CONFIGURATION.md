# Configurações Específicas do Templalize

O PromptMan implementa configurações específicas para a funcionalidade de templalização, separadas das configurações gerais do modelo, garantindo consistência e otimização para essa tarefa específica.

## Configurações Fixas do Templalize

### **🎯 Provider e Modelo:**
- **Provider:** Sempre `gemini`
- **Modelo:** Sempre `gemini-1.5-flash`
- **Motivo:** Otimizado para análise e estruturação de prompts

### **⚙️ Parâmetros Otimizados:**
```typescript
const templalizeSettings = {
  provider: 'gemini',
  model: 'gemini-1.5-flash',
  temperature: 0.7,        // Criatividade balanceada
  maxTokens: 4096,         // Suficiente para prompts longos
  topP: 1,                 // Máxima diversidade
  frequencyPenalty: 0,     // Sem penalidade de repetição
  presencePenalty: 0,      // Sem penalidade de presença
  apiKeys: {
    gemini: modelSettings.apiKeys.gemini || ''
  }
}
```

### **🎨 Características das Configurações:**

#### **🌡️ Temperature: 0.7**
- **Balanceada:** Nem muito criativa, nem muito conservadora
- **Consistente:** Resultados previsíveis e estruturados
- **Ideal para:** Análise e organização de prompts

#### **📊 Max Tokens: 4096**
- **Suficiente:** Para prompts longos e complexos
- **Eficiente:** Não desperdiça tokens desnecessariamente
- **Compatível:** Funciona bem com o modelo Gemini

#### **🎯 Top P: 1**
- **Máxima diversidade:** Considera todos os tokens possíveis
- **Flexibilidade:** Permite diferentes abordagens de estruturação
- **Qualidade:** Mantém alta qualidade na saída

#### **🔄 Penalidades: 0**
- **Sem restrições:** Não penaliza repetições ou presença
- **Liberdade:** Permite estruturas consistentes
- **Eficiência:** Foca na qualidade da estruturação

## Fluxo de Execução

### **🔄 Processo Completo:**

1. **Usuário clica "Templalize"**
   - Abre modal de templalização
   - Usa configurações específicas do Gemini

2. **Análise do Prompt**
   - Gemini analisa o prompt atual
   - Estrutura em formato XML
   - Usa configurações otimizadas

3. **Resultado Templalizado**
   - Exibe prompt estruturado
   - Botão: "Copiar"

4. **Uso Manual (Opcional)**
   - Usuário copia o prompt templalizado
   - Pode usar em qualquer lugar
   - Controle total sobre a execução

### **🎯 Separação de Responsabilidades:**

#### **Templalização (Gemini):**
- **Provider:** Gemini (fixo)
- **Modelo:** gemini-1.5-flash (fixo)
- **Configurações:** Otimizadas para estruturação
- **Função:** Analisar e organizar prompts

#### **Execução (Manual):**
**Provider:** Configurado pelo usuário
**Modelo:** Configurado pelo usuário
**Configurações:** Configuradas pelo usuário
**Função:** Usuário executa manualmente onde quiser

## Implementação Técnica

### **🔧 Configurações Específicas:**
```typescript
// Configurações específicas para templalize (sempre Gemini)
const templalizeSettings = {
  provider: 'gemini',
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  apiKeys: {
    gemini: modelSettings.apiKeys.gemini || ''
  }
}
```

### **🎯 Uso na Templalização:**
```typescript
const aiPromise = aiService.generateResponse(
  userPrompt,
  systemPrompt,
  templalizeSettings,  // Usa configurações específicas
  {}
)
```

### **🚀 Execução do Prompt Templalizado:**
```typescript
const handleRunTemplalizedPrompt = async () => {
  // Extrair e processar o prompt templalizado
  // Atualizar o prompt atual
  // Usar configurações do modelo selecionado para execução
}
```

## Benefícios da Separação

### **✅ Consistência:**
- **Resultados previsíveis:** Sempre usa o mesmo modelo
- **Qualidade garantida:** Configurações otimizadas
- **Experiência uniforme:** Comportamento consistente

### **🎯 Otimização:**
- **Modelo adequado:** Gemini é excelente para análise
- **Parâmetros ideais:** Balanceados para estruturação
- **Performance:** Configurações testadas e validadas

### **🔧 Flexibilidade:**
**Execução livre:** Usuário escolhe onde e como executar
**Configurações personalizadas:** Para a execução final
**Controle total:** Usuário tem controle completo sobre o uso

## Processamento do Prompt Templalizado

### **📝 Extração de Seções:**
```typescript
// Procurar por tags XML no texto templalizado
const systemMatch = templalizedText.match(/<system_prompt>([\s\S]*?)<\/system_prompt>/i)
const contextMatch = templalizedText.match(/<context>([\s\S]*?)<\/context>/i)
const taskMatch = templalizedText.match(/<task>([\s\S]*?)<\/task>/i)
const rulesMatch = templalizedText.match(/<rules>([\s\S]*?)<\/rules>/i)
const avoidMatch = templalizedText.match(/<avoid>([\s\S]*?)<\/avoid>/i)
const examplesMatch = templalizedText.match(/<examples>([\s\S]*?)<\/examples>/i)
const reflectionMatch = templalizedText.match(/<reflection_instruction>([\s\S]*?)<\/reflection_instruction>/i)
const outputFormatMatch = templalizedText.match(/<output_format>([\s\S]*?)<\/output_format>/i)
```

### **🔧 Construção do System Prompt:**
```typescript
// Construir system prompt combinando todas as seções relevantes
let systemPrompt = ''
if (systemMatch) systemPrompt += systemMatch[1].trim() + '\n\n'
if (contextMatch) systemPrompt += 'Contexto: ' + contextMatch[1].trim() + '\n\n'
if (rulesMatch) systemPrompt += 'Regras: ' + rulesMatch[1].trim() + '\n\n'
if (avoidMatch) systemPrompt += 'Evitar: ' + avoidMatch[1].trim() + '\n\n'
if (examplesMatch) systemPrompt += 'Exemplos: ' + examplesMatch[1].trim() + '\n\n'
if (reflectionMatch) systemPrompt += 'Instruções de Reflexão: ' + reflectionMatch[1].trim() + '\n\n'
if (outputFormatMatch) systemPrompt += 'Formato de Saída: ' + outputFormatMatch[1].trim() + '\n\n'
```

### **📋 Construção do User Prompt:**
```typescript
// Construir user prompt com a tarefa
let userPrompt = ''
if (taskMatch) {
  userPrompt = taskMatch[1].trim()
} else {
  // Se não encontrar tag task, usar o texto completo
  userPrompt = templalizedText
}

// Limpar as tags XML do user prompt
userPrompt = userPrompt.replace(/<[^>]*>/g, '').trim()
```

## Interface do Usuário

### **🎨 Modal de Templalização:**
- **Título:** "Prompt Templarizado"
- **Área de texto:** Exibe o prompt estruturado
- **Botões:**
  - **Copiar:** Copia o prompt templalizado para a área de transferência

### **🔄 Fluxo de Botões:**
1. **Copiar:** Copia o prompt templalizado para a área de transferência
2. **Usuário:** Pode colar o prompt em qualquer lugar ou usar manualmente

### **📱 Estados dos Botões:**
- **Desabilitado:** Quando não há prompt templalizado
- **Ativo:** Quando há prompt disponível
- **Loading:** Durante a templalização

## Validações

### **✅ Verificações de Segurança:**
- **API Key:** Verifica se a chave do Gemini está configurada
- **Prompt válido:** Verifica se há conteúdo para templalizar
- **Resultado válido:** Verifica se a resposta é válida

### **🎯 Validações de Conteúdo:**
- **Extração:** Verifica se consegue extrair seções válidas
- **Tarefa:** Verifica se há uma tarefa para executar
- **Formato:** Verifica se o formato está correto

## Monitoramento

### **📊 Métricas Importantes:**
- **Taxa de sucesso:** Templalizações bem-sucedidas
- **Tempo médio:** Duração da templalização
- **Qualidade:** Feedback dos usuários

### **🎯 Melhorias Baseadas em Dados:**
- **Ajuste de parâmetros:** Baseado no feedback
- **Otimização de prompts:** Baseado nos resultados
- **Novas funcionalidades:** Baseado no uso

## Troubleshooting

### **Problema: Templalização falha**
**Solução:** Verifique se a API key do Gemini está configurada

### **Problema: Prompt não é extraído corretamente**
**Solução:** Verifique se o formato XML está correto

### **Problema: Execução não funciona**
**Solução:** Verifique se o prompt foi atualizado corretamente

### **Problema: Configurações não são aplicadas**
**Solução:** Verifique se as configurações do modelo estão corretas

## Futuras Melhorias

### **🎯 Funcionalidades Planejadas:**
- **Templates pré-definidos:** Para diferentes tipos de prompt
- **Configurações personalizáveis:** Para o templalize
- **Histórico de templalizações:** Para reutilização
- **Análise de qualidade:** Feedback sobre a estruturação

### **🔧 Melhorias Técnicas:**
- **Cache de resultados:** Para prompts similares
- **Otimização de prompts:** Para melhor estruturação
- **Validação avançada:** Para garantir qualidade
- **Integração com outros modelos:** Para comparação

A separação de configurações garante que o templalize sempre funcione de forma otimizada! 🎉 