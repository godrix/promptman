import { AIProvider, AIRequestParams, AIRequest, AIResponse } from '../types'

const buildOpenAIRequest = (params: AIRequestParams): AIRequest => {
  const { prompt, systemPrompt, model, temperature, maxTokens, apiKey } = params
  
  const messages = []
  
  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt
    })
  }
  
  messages.push({
    role: 'user',
    content: prompt
  })

  return {
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: {
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    }
  }
}

const parseOpenAIResponse = (response: any): AIResponse => {
  if (response.error) {
    return {
      content: '',
      error: response.error.message || 'Erro na requisição para o OpenAI',
      raw: response
    }
  }
  const choice = response.choices?.[0]
  if (!choice) {
    return {
      content: '',
      error: 'Resposta inválida do OpenAI',
      raw: response
    }
  }
  const content = choice.message?.content || ''
  const usage = response.usage ? {
    promptTokens: response.usage.prompt_tokens || 0,
    completionTokens: response.usage.completion_tokens || 0,
    totalTokens: response.usage.total_tokens || 0
  } : undefined
  return {
    content,
    usage,
    raw: response
  }
}

export const openaiProvider: AIProvider = {
  name: 'OpenAI',
  displayName: 'OpenAI',
  models: [
    {
      id: 'gpt-4',
      name: 'gpt-4',
      displayName: 'GPT-4',
      maxTokens: 8192
    },
    {
      id: 'gpt-4-turbo',
      name: 'gpt-4-turbo-preview',
      displayName: 'GPT-4 Turbo',
      maxTokens: 128000
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      maxTokens: 4096
    }
  ],
  config: {
    baseUrl: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json'
    },
    requestBuilder: buildOpenAIRequest,
    responseParser: parseOpenAIResponse
  }
} 