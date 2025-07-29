# Configurações Avançadas dos Modelos

O PromptMan agora oferece configurações avançadas para personalizar ainda mais a interação com os modelos de IA.

## Configurações Disponíveis

### 🔥 Temperature (Temperatura)
**Range:** 0.0 - 2.0  
**Padrão:** 0.7  
**Descrição:** Controla a aleatoriedade das respostas. Valores mais baixos (0.0-0.3) produzem respostas mais determinísticas e focadas. Valores mais altos (0.7-2.0) produzem respostas mais criativas e variadas.

**Exemplos:**
- **0.1:** Respostas muito consistentes e previsíveis
- **0.7:** Equilíbrio entre criatividade e coerência
- **1.5:** Respostas muito criativas e variadas

### 🎯 Top P (Núcleo de Probabilidade)
**Range:** 0.0 - 1.0  
**Padrão:** 1.0  
**Descrição:** Controla a diversidade do texto considerando apenas os tokens mais prováveis. Valores mais baixos (0.1-0.3) produzem texto mais focado e repetitivo. Valores mais altos (0.7-1.0) permitem mais diversidade.

**Exemplos:**
- **0.1:** Texto muito focado e repetitivo
- **0.7:** Boa diversidade mantendo coerência
- **1.0:** Máxima diversidade (padrão)

### 🔄 Frequency Penalty (Penalidade de Frequência)
**Range:** -2.0 - 2.0  
**Padrão:** 0.0  
**Descrição:** Reduz a probabilidade de repetir o mesmo conteúdo. Valores positivos (0.1-2.0) penalizam repetições. Valores negativos (-2.0-0.0) incentivam repetições.

**Exemplos:**
- **-1.0:** Pode repetir frases e conceitos
- **0.0:** Comportamento neutro (padrão)
- **1.0:** Evita repetições ativamente

### 🎭 Presence Penalty (Penalidade de Presença)
**Range:** -2.0 - 2.0  
**Padrão:** 0.0  
**Descrição:** Reduz a probabilidade de falar sobre tópicos já mencionados. Valores positivos (0.1-2.0) incentivam novos tópicos. Valores negativos (-2.0-0.0) mantêm foco no tópico atual.

**Exemplos:**
- **-1.0:** Mantém foco no tópico atual
- **0.0:** Comportamento neutro (padrão)
- **1.0:** Explora novos tópicos ativamente

### 🎲 Top K
**Range:** 1 - 40  
**Padrão:** 1  
**Descrição:** Considera apenas os K tokens mais prováveis em cada etapa. Valores mais baixos (1-5) produzem texto mais previsível. Valores mais altos (10-40) permitem mais variedade.

**Exemplos:**
- **1:** Sempre escolhe o token mais provável
- **10:** Boa variedade mantendo qualidade
- **40:** Máxima variedade possível

### 🛑 Stop Sequences (Sequências de Parada)
**Tipo:** Lista de strings  
**Padrão:** Vazio  
**Descrição:** Define sequências que fazem o modelo parar de gerar texto. Útil para controlar o formato da resposta.

**Exemplos:**
- `["END", "STOP"]` - Para quando encontrar essas palavras
- `["###", "---"]` - Para em separadores específicos
- `["\n\n", "Fim:"]` - Para em quebras de linha duplas ou "Fim:"

### 🌱 Seed (Semente)
**Tipo:** Número inteiro  
**Padrão:** Aleatório  
**Descrição:** Define uma semente para reprodutibilidade. Mesmo prompt + mesma semente = mesma resposta (quando possível).

**Exemplos:**
- **12345:** Sempre gera a mesma resposta (se suportado)
- **Vazio:** Resposta aleatória a cada execução

## Como Usar

### 1. Acessar Configurações Avançadas
1. Clique em **"Model Settings"** no PromptEditor
2. Role para baixo para ver as configurações avançadas
3. Ajuste os valores conforme necessário

### 2. Configurações Recomendadas por Uso

#### 📝 Redação Criativa
```
Temperature: 0.8-1.2
Top P: 0.8-0.9
Frequency Penalty: 0.3-0.7
Presence Penalty: 0.1-0.3
```

#### 🔬 Análise Técnica
```
Temperature: 0.1-0.3
Top P: 0.9-1.0
Frequency Penalty: 0.0-0.2
Presence Penalty: 0.0-0.1
```

#### 🎨 Geração de Conteúdo
```
Temperature: 0.6-0.9
Top P: 0.7-0.9
Frequency Penalty: 0.5-1.0
Presence Penalty: 0.2-0.5
```

#### 🤖 Conversação Natural
```
Temperature: 0.7-0.9
Top P: 0.8-1.0
Frequency Penalty: 0.1-0.3
Presence Penalty: 0.0-0.2
```

## Compatibilidade por Provider

### OpenAI (GPT-4o, GPT-3.5 Turbo)
✅ **Suporta:** Temperature, Top P, Frequency Penalty, Presence Penalty, Stop Sequences, Seed  
❌ **Não suporta:** Top K

### Google Gemini
✅ **Suporta:** Temperature, Top P, Top K, Stop Sequences  
❌ **Não suporta:** Frequency Penalty, Presence Penalty, Seed

### Anthropic Claude
✅ **Suporta:** Temperature, Top P, Stop Sequences  
❌ **Não suporta:** Frequency Penalty, Presence Penalty, Top K, Seed

## Dicas de Otimização

### 🎯 Para Respostas Consistentes
- **Temperature:** 0.1-0.3
- **Top P:** 0.9-1.0
- **Frequency Penalty:** 0.0
- **Presence Penalty:** 0.0

### 🎨 Para Criatividade
- **Temperature:** 0.8-1.2
- **Top P:** 0.7-0.9
- **Frequency Penalty:** 0.3-0.7
- **Presence Penalty:** 0.2-0.5

### 📊 Para Análise
- **Temperature:** 0.1-0.3
- **Top P:** 0.95-1.0
- **Frequency Penalty:** 0.0-0.1
- **Presence Penalty:** 0.0

### 💬 Para Conversação
- **Temperature:** 0.7-0.9
- **Top P:** 0.8-1.0
- **Frequency Penalty:** 0.1-0.3
- **Presence Penalty:** 0.0-0.2

## Troubleshooting

### Problema: Configurações não são aplicadas
**Solução:** Verifique se o provider suporta a configuração específica

### Problema: Respostas muito aleatórias
**Solução:** Reduza Temperature (0.1-0.3) e Top P (0.9-1.0)

### Problema: Respostas muito repetitivas
**Solução:** Aumente Frequency Penalty (0.5-1.0) e Presence Penalty (0.3-0.7)

### Problema: Respostas muito focadas
**Solução:** Aumente Temperature (0.7-1.0) e reduza Top P (0.7-0.9)

## Salvando Configurações

### Configurações Globais
- As configurações são salvas automaticamente
- Aplicam-se a todos os prompts do provider selecionado
- Persistem entre sessões

### Configurações por Prompt
- Cada prompt pode ter suas próprias configurações
- Útil para diferentes tipos de tarefas
- Configurações específicas sobrescrevem as globais

## Monitoramento

### Métricas Importantes
- **Qualidade da Resposta:** Avalie se as configurações produzem o resultado desejado
- **Consistência:** Verifique se as respostas são consistentes com o esperado
- **Criatividade:** Monitore se o nível de criatividade está adequado

### Ajustes Finais
- Teste diferentes combinações
- Documente as configurações que funcionam melhor
- Ajuste gradualmente para encontrar o equilíbrio ideal 