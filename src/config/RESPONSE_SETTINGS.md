# Exibição de Configurações na Resposta

O PromptMan agora exibe automaticamente as configurações usadas para gerar cada resposta, proporcionando transparência total sobre os parâmetros aplicados.

## Funcionalidade

### **🎯 O que é exibido:**

Após cada resposta do AI, o sistema mostra duas seções de metadados:

1. **Informações de Uso de Tokens** (acima da resposta)
2. **Configurações Aplicadas** (abaixo da resposta)

### **📊 Formato de Exibição:**

```
[Tokens usados] (acima da resposta)

Resposta do AI...

[Configurações aplicadas] (abaixo da resposta)
```

## Ícones e Significados

### **🌡️ Temperature (Temperatura)**
- **Ícone:** `<FiThermometer />`
- **Descrição:** Controla a aleatoriedade das respostas
- **Range:** 0.0 - 2.0
- **Tooltip:** "Temperatura - Controla a aleatoriedade das respostas"

### **📊 Max Tokens (Máximo de Tokens)**
- **Ícone:** `<FiBarChart />`
- **Descrição:** Limite de tokens para a resposta
- **Range:** 1 - 8192
- **Tooltip:** "Máximo de tokens - Limite de tokens para a resposta"

### **🎯 Top P (Núcleo de Probabilidade)**
- **Ícone:** `<FiTarget />`
- **Descrição:** Controla a diversidade do texto
- **Range:** 0.0 - 1.0
- **Tooltip:** "Top P - Núcleo de probabilidade"

### **🔄 Frequency Penalty (Penalidade de Frequência)**
- **Ícone:** `<FiRotateCcw />`
- **Descrição:** Reduz a probabilidade de repetir conteúdo
- **Range:** -2.0 - 2.0
- **Tooltip:** "Frequency Penalty - Penalidade de frequência"

### **🎭 Presence Penalty (Penalidade de Presença)**
- **Ícone:** `<FiUserCheck />`
- **Descrição:** Reduz a probabilidade de falar sobre tópicos já mencionados
- **Range:** -2.0 - 2.0
- **Tooltip:** "Presence Penalty - Penalidade de presença"

### **🎲 Top K (Opcional)**
- **Ícone:** `<FiSquare />`
- **Descrição:** Considera apenas os K tokens mais prováveis
- **Range:** 1 - 40
- **Tooltip:** "Top K - Variedade de tokens"
- **Exibição:** Apenas quando configurado

### **🛑 Stop Sequences (Opcional)**
- **Ícone:** `<FiMinus />`
- **Descrição:** Sequências que fazem o modelo parar de gerar
- **Tipo:** Lista de strings
- **Tooltip:** "Stop Sequences - Sequências de parada"
- **Exibição:** Apenas quando configurado

### **🌱 Seed (Opcional)**
- **Ícone:** `<FiCircle />`
- **Descrição:** Semente para reprodutibilidade
- **Tipo:** Número inteiro
- **Tooltip:** "Seed - Semente para reprodutibilidade"
- **Exibição:** Apenas quando configurado

## Implementação Técnica

### **📝 Geração dos Metadados:**

```typescript
// Adicionar informações das configurações usadas
const settingsInfo = `\n\n---\nConfigurações: [TEMP]${modelSettings.temperature} | [MAX]${modelSettings.maxTokens} | [TOP_P]${modelSettings.topP} | [FREQ]${modelSettings.frequencyPenalty} | [PRES]${modelSettings.presencePenalty}${modelSettings.topK ? ` | [TOP_K]${modelSettings.topK}` : ''}${modelSettings.stopSequences && modelSettings.stopSequences.length > 0 ? ` | [STOP]${modelSettings.stopSequences.join(', ')}` : ''}${modelSettings.seed ? ` | [SEED]${modelSettings.seed}` : ''}`
```

### **🔧 Processamento da Resposta:**

```typescript
// Função utilitária para separar texto e metadados
function splitResponseAndMeta(response: string) {
  if (!response) return { text: '', meta: '', settings: '' }
  const parts = response.split('\n---\n')
  const text = parts[0]?.trim() || ''
  const meta = parts[1]?.trim() || ''
  const settings = parts[2]?.trim() || ''
  return { text, meta, settings }
}
```

### **🎨 Exibição na Interface:**

```typescript
{responseSettings && (
  <div style={{
    marginTop: 12,  // Posicionado abaixo da resposta
    display: 'flex',
    gap: 8,
    fontSize: 12,
    opacity: 0.7,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
    title="Temperatura - Controla a aleatoriedade das respostas">
      <FiThermometer size={12} style={{ marginRight: 4 }} /> {modelSettings.temperature}
    </span>
    // ... outros ícones
  </div>
)}
```

## Benefícios

### **✅ Transparência Total**
- **Visibilidade:** Todas as configurações aplicadas são visíveis
- **Rastreabilidade:** Fácil identificar quais parâmetros foram usados
- **Documentação:** Histórico automático das configurações

### **🎯 Debugging e Otimização**
- **Comparação:** Compare resultados com diferentes configurações
- **Ajuste:** Identifique rapidamente o que precisa ser alterado
- **Reprodução:** Reproduza exatamente as mesmas condições

### **📊 Análise de Performance**
- **Correlação:** Veja como configurações afetam o resultado
- **Eficiência:** Identifique configurações otimais
- **Custo:** Monitore o uso de tokens por configuração

### **🎨 Experiência do Usuário**
- **Clareza:** Interface limpa e informativa
- **Tooltips:** Explicações detalhadas ao passar o mouse
- **Organização:** Metadados bem estruturados e visuais
- **Tema Consistente:** Uso de React Icons mantém o design unificado

## Exemplos de Exibição

### **Configuração Básica:**
```
🌡️ 0.7 | 📊 4096 | 🎯 1 | 🔄 0 | 🎭 0
```

### **Configuração Avançada:**
```
🌡️ 0.8 | 📊 2048 | 🎯 0.9 | 🔄 0.5 | 🎭 0.2 | 🎲 10 | 🛑 END, STOP | 🌱 12345
```

### **Configuração Criativa:**
```
🌡️ 1.2 | 📊 8192 | 🎯 0.8 | 🔄 1.0 | 🎭 0.5
```

## Compatibilidade

### **✅ Todos os Providers**
- **OpenAI:** Suporta todas as configurações
- **Gemini:** Suporta configurações compatíveis
- **Anthropic:** Suporta configurações compatíveis

### **🎯 Configurações Opcionais**
- **Top K:** Exibido apenas quando configurado
- **Stop Sequences:** Exibido apenas quando configurado
- **Seed:** Exibido apenas quando configurado

## Personalização

### **🎨 Estilo Visual**
- **Background:** `#333` (mais escuro que tokens)
- **Font Size:** `12px` (menor que tokens)
- **Opacity:** `0.7` (mais sutil que tokens)
- **Tooltips:** Explicações detalhadas
- **Ícones:** React Icons para consistência visual

### **📱 Responsividade**
- **Flex Wrap:** Quebra de linha automática
- **Gap:** Espaçamento consistente
- **Mobile:** Adaptável a telas pequenas

### **📍 Posicionamento**
- **Tokens:** Acima da resposta
- **Configurações:** Abaixo da resposta
- **Separação:** Margem adequada entre seções

## Troubleshooting

### **Problema: Configurações não aparecem**
**Solução:** Verifique se a resposta foi gerada com sucesso

### **Problema: Ícones não carregam**
**Solução:** Verifique se os React Icons estão importados corretamente

### **Problema: Tooltips não funcionam**
**Solução:** Verifique se o navegador suporta atributo `title`

## Monitoramento

### **📊 Métricas Importantes**
- **Configurações mais usadas:** Identifique padrões
- **Correlação com qualidade:** Relacione configurações com resultados
- **Otimização:** Encontre as melhores configurações para cada caso

### **🎯 Melhorias Futuras**
- **Histórico:** Salvar histórico de configurações
- **Templates:** Criar templates de configurações
- **Análise:** Estatísticas de uso de configurações 