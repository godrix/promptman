import { AIProvider, AIRequestParams, AIRequest, AIResponse } from '../types'

const buildGeminiRequest = (params: AIRequestParams): AIRequest => {
  const { prompt, systemPrompt, model, temperature, maxTokens, apiKey } = params
  
  // Construir o conteúdo da mensagem
  const contents = []
  
  // Para o Gemini, vamos combinar system prompt e user prompt
  let fullPrompt = prompt
  if (systemPrompt) {
    fullPrompt = `${systemPrompt}\n\n${prompt}`
  }
  
  contents.push({
    role: 'user',
    parts: [{ text: fullPrompt }]
  })

  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topP: 1,
        topK: 1
      }
    }
  }
}

const parseGeminiResponse = (response: any): AIResponse => {
  console.log('Gemini response:', response) // Debug

  if (response.error) {
    return {
      content: '',
      error: response.error.message || 'Erro na requisição para o Gemini'
    }
  }

  const candidates = response.candidates?.[0]
  if (!candidates) {
    return {
      content: '',
      error: 'Resposta inválida do Gemini - nenhum candidato encontrado'
    }
  }

  const content = candidates.content?.parts?.[0]?.text || ''
  const usage = response.usageMetadata ? {
    promptTokens: response.usageMetadata.promptTokenCount || 0,
    completionTokens: response.usageMetadata.candidatesTokenCount || 0,
    totalTokens: response.usageMetadata.totalTokenCount || 0
  } : undefined

  return {
    content,
    usage
  }
}

// Função para listar modelos disponíveis
export const listGeminiModels = async (apiKey: string): Promise<string[]> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    const data = await response.json()
    
    if (data.error) {
      console.error('Erro ao listar modelos:', data.error)
      return []
    }
    
    return data.models?.map((model: any) => model.name) || []
  } catch (error) {
    console.error('Erro ao listar modelos Gemini:', error)
    return []
  }
}

export const geminiProvider: AIProvider = {
  name: 'Gemini',
  displayName: 'Google Gemini',
  models: [
    {
      id: 'gemini-1.5-flash',
      name: 'gemini-1.5-flash',
      displayName: 'Gemini 1.5 Flash',
      maxTokens: 8192
    },
    {
      id: 'gemini-1.5-pro',
      name: 'gemini-1.5-pro',
      displayName: 'Gemini 1.5 Pro',
      maxTokens: 8192
    },
    {
      id: 'gemini-pro',
      name: 'gemini-pro',
      displayName: 'Gemini Pro',
      maxTokens: 8192
    }
  ],
  config: {
    baseUrl: `https://generativelanguage.googleapis.com/v1beta/models`,
    headers: {
      'Content-Type': 'application/json',
    },
    requestBuilder: buildGeminiRequest,
    responseParser: parseGeminiResponse
  }
} 