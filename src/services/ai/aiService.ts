import { AIRequestParams, AIResponse, AIProviderSettings } from './types'
import { getProvider, getModel } from '../../config'
import { getCurrentApiKey } from '../../store/modelSettings'

// Função para normalizar dados de uso de diferentes providers
const normalizeUsageData = (usage: any, provider: string) => {
  switch (provider) {
    case 'openai':
      // OpenAI: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
      return {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0
      }
    case 'gemini':
      // Gemini: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 }
      return {
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0
      }
    case 'anthropic':
      // Anthropic: { input_tokens: 10, output_tokens: 20 }
      return {
        promptTokens: usage.input_tokens || 0,
        completionTokens: usage.output_tokens || 0,
        totalTokens: (usage.input_tokens || 0) + (usage.output_tokens || 0)
      }
    default:
      // Fallback: tentar mapear campos comuns
      return {
        promptTokens: usage.promptTokens || usage.prompt_tokens || usage.input_tokens || usage.promptTokenCount || 0,
        completionTokens: usage.completionTokens || usage.completion_tokens || usage.output_tokens || usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokens || usage.total_tokens || usage.totalTokenCount || 0
      }
  }
}

export class AIService {
  private static instance: AIService

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async generateResponse(
    prompt: string,
    systemPrompt: string,
    settings: AIProviderSettings,
    variables?: Record<string, string>
  ): Promise<AIResponse> {
    try {
      const provider = getProvider(settings.provider)
      if (!provider) {
        return {
          content: '',
          error: `Provider '${settings.provider}' não encontrado`
        }
      }

      // Obter configurações do modelo
      const model = getModel(settings.provider, settings.model)
      if (!model) {
        return {
          content: '',
          error: `Modelo '${settings.model}' não encontrado para o provider '${settings.provider}'`
        }
      }

      // Obter a chave de API específica do provider
      const apiKey = getCurrentApiKey(settings)
      if (!apiKey) {
        return {
          content: '',
          error: `Chave de API não configurada para o provider '${settings.provider}'. Configure a chave nas configurações do modelo.`
        }
      }

      // Substituir variáveis no prompt
      let processedPrompt = prompt
      let processedSystemPrompt = systemPrompt

      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g')
          processedPrompt = processedPrompt.replace(regex, value)
          processedSystemPrompt = processedSystemPrompt.replace(regex, value)
        })
      }

      // Construir o prompt completo para providers que não suportam system prompt separado
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${processedPrompt}` : processedPrompt

      // Construir a URL da requisição
      const url = provider.requestFormat.endpoint
        .replace('{model}', model.name)
        .replace('{apiKey}', apiKey)

      // Construir os headers
      const headers: Record<string, string> = {}
      Object.entries(provider.headers).forEach(([key, value]) => {
        headers[key] = String(value).replace('{apiKey}', apiKey)
      })

      // Construir o body da requisição
      const body = JSON.parse(JSON.stringify(provider.requestFormat.body))
      
      // Substituir placeholders no body
      const replaceInObject = (obj: any): any => {
        if (typeof obj === 'string') {
          return obj
            .replace('{model}', model.name)
            .replace('{systemPrompt}', processedSystemPrompt)
            .replace('{userPrompt}', processedPrompt)
            .replace('{fullPrompt}', fullPrompt)
            .replace('{temperature}', settings.temperature.toString())
            .replace('{maxTokens}', settings.maxTokens.toString())
        } else if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            return obj.map(replaceInObject)
          } else {
            const newObj: any = {}
            Object.entries(obj).forEach(([key, value]) => {
              // Se o valor é uma string que contém placeholders numéricos, substituir diretamente
              if (typeof value === 'string' && value.includes('{maxTokens}')) {
                newObj[key] = settings.maxTokens
              } else if (typeof value === 'string' && value.includes('{temperature}')) {
                newObj[key] = settings.temperature
              } else if (typeof value === 'string' && value.includes('{topP}')) {
                newObj[key] = settings.topP
              } else if (typeof value === 'string' && value.includes('{frequencyPenalty}')) {
                newObj[key] = settings.frequencyPenalty
              } else if (typeof value === 'string' && value.includes('{presencePenalty}')) {
                newObj[key] = settings.presencePenalty
              } else if (typeof value === 'string' && value.includes('{topK}')) {
                newObj[key] = settings.topK || 1
              } else if (typeof value === 'string' && value.includes('{seed}')) {
                newObj[key] = settings.seed
              } else if (typeof value === 'string' && value.includes('{stopSequences}')) {
                newObj[key] = settings.stopSequences || null
              } else {
                newObj[key] = replaceInObject(value)
              }
            })
            return newObj
          }
        }
        return obj
      }
      
      const processedBody = replaceInObject(body)

      console.log('AI Request:', {
        url: `${provider.baseUrl}${url}`,
        method: provider.requestFormat.method,
        headers: headers,
        body: processedBody
      })

      const response = await fetch(`${provider.baseUrl}${url}`, {
        method: provider.requestFormat.method,
        headers: headers,
        body: JSON.stringify(processedBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          content: '',
          error: errorData.error?.message || `Erro HTTP ${response.status}: ${response.statusText}`
        }
      }

      const responseData = await response.json()
      
      // Parsear a resposta usando os caminhos configurados
      const getValueByPath = (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => {
          if (key.includes('[')) {
            const arrayKey = key.split('[')[0]
            const index = parseInt(key.split('[')[1].split(']')[0])
            return current[arrayKey]?.[index]
          }
          return current?.[key]
        }, obj)
      }
      
      const content = getValueByPath(responseData, provider.responseFormat.contentPath) || ''
      const usage = provider.responseFormat.usagePath ? getValueByPath(responseData, provider.responseFormat.usagePath) : undefined
      const error = provider.responseFormat.errorPath ? getValueByPath(responseData, provider.responseFormat.errorPath) : undefined
      
      // Normalizar dados de uso para formato padrão
      const normalizedUsage = usage ? normalizeUsageData(usage, settings.provider) : undefined
      
      if (error) {
        return {
          content: '',
          error: error
        }
      }
      
      const parsed: AIResponse = {
        content,
        usage: normalizedUsage
      }
      
      return { ...parsed, raw: responseData }

    } catch (error) {
      console.error('Erro na requisição de IA:', error)
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Erro desconhecido na requisição'
      }
    }
  }

  // Método para testar a conectividade com um provider
  async testConnection(settings: AIProviderSettings): Promise<{ success: boolean; error?: string }> {
    try {
      const provider = getProvider(settings.provider)
      if (!provider) {
        return {
          success: false,
          error: `Provider '${settings.provider}' não encontrado`
        }
      }

      // Obter configurações do modelo
      const model = getModel(settings.provider, settings.model)
      if (!model) {
        return {
          success: false,
          error: `Modelo '${settings.model}' não encontrado para o provider '${settings.provider}'`
        }
      }

      // Obter a chave de API específica do provider
      const apiKey = getCurrentApiKey(settings)
      if (!apiKey) {
        return {
          success: false,
          error: `Chave de API não configurada para o provider '${settings.provider}'. Configure a chave nas configurações do modelo.`
        }
      }

      // Construir a URL da requisição
      const url = provider.requestFormat.endpoint
        .replace('{model}', model.name)
        .replace('{apiKey}', apiKey)

      // Construir os headers
      const headers: Record<string, string> = {}
      Object.entries(provider.headers).forEach(([key, value]) => {
        headers[key] = String(value).replace('{apiKey}', apiKey)
      })

      // Construir um body simples para teste
      const testBody = JSON.parse(JSON.stringify(provider.requestFormat.body))
      
      // Substituir placeholders no body
      const replaceInObject = (obj: any): any => {
        if (typeof obj === 'string') {
          return obj
            .replace('{model}', model.name)
            .replace('{systemPrompt}', 'Teste de conectividade')
            .replace('{userPrompt}', 'Teste de conectividade')
            .replace('{fullPrompt}', 'Teste de conectividade')
            .replace('{maxTokens}', '10')
        } else if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            return obj.map(replaceInObject)
          } else {
            const newObj: any = {}
            Object.entries(obj).forEach(([key, value]) => {
              // Se o valor é uma string que contém placeholders numéricos, substituir diretamente
              if (typeof value === 'string' && value.includes('{maxTokens}')) {
                newObj[key] = 10
              } else if (typeof value === 'string' && value.includes('{temperature}')) {
                newObj[key] = 0.1
              } else {
                newObj[key] = replaceInObject(value)
              }
            })
            return newObj
          }
        }
        return obj
      }
      
      const processedBody = replaceInObject(testBody)

      const response = await fetch(`${provider.baseUrl}${url}`, {
        method: provider.requestFormat.method,
        headers: headers,
        body: JSON.stringify(processedBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error?.message || `Erro HTTP ${response.status}`
        }
      }

      return { success: true }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conectividade'
      }
    }
  }
}

export const aiService = AIService.getInstance() 