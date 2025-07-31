import { AIRequestParams, AIResponse, AIProviderSettings } from './types'
import { getProvider, getModel } from '../../config'
import { getCurrentApiKey } from '../../store/modelSettings'

// Função para converter arquivo para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result as string
      resolve(base64.split(',')[1]) // Remove data:application/pdf;base64,
    }
    reader.onerror = error => reject(error)
  })
}

// Função para normalizar dados de uso de diferentes providers
const normalizeUsageData = (usage: any, provider: string) => {
  switch (provider) {
    case 'openai':
      // OpenAI: { input_tokens: 10, output_tokens: 20, total_tokens: 30 }
      return {
        promptTokens: usage.input_tokens || 0,
        completionTokens: usage.output_tokens || 0,
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
        promptTokens:
          usage.promptTokens ||
          usage.prompt_tokens ||
          usage.input_tokens ||
          usage.promptTokenCount ||
          0,
        completionTokens:
          usage.completionTokens ||
          usage.completion_tokens ||
          usage.output_tokens ||
          usage.candidatesTokenCount ||
          0,
        totalTokens:
          usage.totalTokens || usage.total_tokens || usage.totalTokenCount || 0
      }
  }
}

// Função para processar arquivo baseado na configuração do modelo
const processAttachedFile = async (
  attachedFile: File,
  model: any,
  processedPrompt: string
): Promise<{ processedPrompt: string; fileData?: any }> => {
  if (!attachedFile || !model.fileSupport?.enabled) {
    return { processedPrompt }
  }

  // Validar tipo de arquivo
  if (!model.fileSupport.allowedTypes.includes(attachedFile.type)) {
    throw new Error(
      `Tipo de arquivo não suportado. Tipos permitidos: ${model.fileSupport.allowedTypes.join(
        ', '
      )}`
    )
  }

  // Validar tamanho do arquivo
  if (attachedFile.size > model.fileSupport.maxSize) {
    const maxSizeMB = (model.fileSupport.maxSize / (1024 * 1024)).toFixed(0)
    throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`)
  }

  const fileSizeMB = (attachedFile.size / (1024 * 1024)).toFixed(2)
  const fileName = attachedFile.name || 'arquivo'

  // Processar baseado no método configurado
  switch (model.fileSupport.processing.method) {
    case 'context':
      // Adicionar contexto textual ao prompt
      const contextTemplate = model.fileSupport.processing.contextTemplate
      const context = contextTemplate
        .replace('{fileName}', fileName)
        .replace('{fileSize}', fileSizeMB)
      return { processedPrompt: processedPrompt + context }

    case 'base64':
      // Converter para base64 para envio posterior
      const base64Data = await fileToBase64(attachedFile)
      return {
        processedPrompt,
        fileData: {
          type: attachedFile.type,
          data: base64Data,
          fileName,
          fileSize: fileSizeMB
        }
      }

    default:
      throw new Error(
        `Método de processamento não suportado: ${model.fileSupport.processing.method}`
      )
  }
}

// Função para construir conteúdo multimodal baseado na configuração
const buildMultimodalContent = (
  processedPrompt: string,
  fileData: any,
  fileProcessingConfig: any
): any[] => {
  const content: any[] = []

  fileProcessingConfig.contentStructure.forEach((item: any) => {
    if (item.type === 'text') {
      content.push({
        type: 'text',
        text:
          item.content?.replace('{userPrompt}', processedPrompt) ||
          processedPrompt
      })
    } else if (item.type === 'image_url' && fileData) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${fileData.type};base64,${fileData.data}`
        }
      })
    } else if (item.type === 'image' && fileData) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: fileData.type,
          data: fileData.data
        }
      })
    } else if (item.type === 'input_file' && fileData) {
      content.push({
        type: 'input_file',
        filename: fileData.fileName,
        file_data: `data:${fileData.type};base64,${fileData.data}`
      })
    } else if (item.type === 'input_text') {
      content.push({
        type: 'input_text',
        text:
          item.text?.replace('{userPrompt}', processedPrompt) || processedPrompt
      })
    }
  })

  return content
}

// Função para converter valores numéricos após a substituição
const convertNumericValues = (obj: any): any => {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(convertNumericValues)
    } else {
      const newObj: any = {}
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // Converter valores numéricos conhecidos
          if (key === 'max_tokens' || key === 'maxOutputTokens') {
            newObj[key] = parseInt(value) || 0
          } else if (key === 'temperature' || key === 'top_p' || key === 'p') {
            newObj[key] = parseFloat(value) || 0
          } else if (
            key === 'frequency_penalty' ||
            key === 'presence_penalty' ||
            key === 'top_k' ||
            key === 'k'
          ) {
            newObj[key] = parseFloat(value) || 0
          } else if (key === 'seed') {
            if (value === 'null') {
              newObj[key] = null
            } else {
              newObj[key] = parseInt(value) || null
            }
          } else if (key === 'stop_sequences' || key === 'stopSequences') {
            try {
              newObj[key] = JSON.parse(value)
            } catch {
              newObj[key] = value
            }
          } else {
            newObj[key] = value
          }
        } else {
          newObj[key] = convertNumericValues(value)
        }
      })
      return newObj
    }
  }
  return obj
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
    variables?: Record<string, string>,
    attachedFile?: File | null
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

      // Processar arquivo anexado se existir
      let fileData: any = undefined
      if (attachedFile) {
        try {
          console.log(
            'aiService: Processando arquivo anexado:',
            attachedFile.name
          )

          const fileProcessing = await processAttachedFile(
            attachedFile,
            model,
            processedPrompt
          )
          processedPrompt = fileProcessing.processedPrompt
          fileData = fileProcessing.fileData

          console.log('aiService: Arquivo processado com sucesso')
        } catch (error) {
          console.error('aiService: Erro ao processar arquivo anexado:', error)
          return {
            content: '',
            error:
              error instanceof Error
                ? error.message
                : 'Erro ao processar arquivo anexado.'
          }
        }
      }

      // Construir o prompt completo para providers que não suportam system prompt separado
      const fullPrompt = systemPrompt
        ? `${systemPrompt}\n\n${processedPrompt}`
        : processedPrompt

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
      let body: any

      // Verificar se há processamento de arquivo configurado
      if (fileData && (provider.requestFormat as any).fileProcessing?.enabled) {
        // Usar estrutura multimodal
        const multimodalContent = buildMultimodalContent(
          processedPrompt,
          fileData,
          (provider.requestFormat as any).fileProcessing
        )

        // Construir body baseado na estrutura multimodal
        body = JSON.parse(JSON.stringify(provider.requestFormat.body))

        // Substituir {content} com a estrutura multimodal
        const replaceContentInObject = (obj: any): any => {
          if (typeof obj === 'string') {
            return obj
              .replace('{model}', model.name)
              .replace('{systemPrompt}', processedSystemPrompt)
              .replace('{userPrompt}', processedPrompt)
              .replace('{fullPrompt}', fullPrompt)
              .replace('{temperature}', settings.temperature.toString())
              .replace('{maxTokens}', settings.maxTokens.toString())
              .replace('{topP}', settings.topP.toString())
              .replace(
                '{frequencyPenalty}',
                settings.frequencyPenalty.toString()
              )
              .replace('{presencePenalty}', settings.presencePenalty.toString())
              .replace('{topK}', (settings.topK || 1).toString())
              .replace('{seed}', settings.seed?.toString() || 'null')
              .replace(
                '{stopSequences}',
                JSON.stringify(settings.stopSequences || [])
              )
              .replace('{fileName}', fileData.fileName)
              .replace('{fileType}', fileData.type)
              .replace('{fileData}', fileData.data)
          } else if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
              return obj.map(replaceContentInObject)
            } else {
              const newObj: any = {}
              Object.entries(obj).forEach(([key, value]) => {
                if (key === 'content' && Array.isArray(value)) {
                  // Substituir {content} com a estrutura multimodal
                  newObj[key] = multimodalContent
                } else {
                  newObj[key] = replaceContentInObject(value)
                }
              })
              return newObj
            }
          }
          return obj
        }

        body = convertNumericValues(replaceContentInObject(body))
      } else {
        // Usar processamento normal sem arquivo
        body = JSON.parse(JSON.stringify(provider.requestFormat.body))

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
              .replace('{topP}', settings.topP.toString())
              .replace(
                '{frequencyPenalty}',
                settings.frequencyPenalty.toString()
              )
              .replace('{presencePenalty}', settings.presencePenalty.toString())
              .replace('{topK}', (settings.topK || 1).toString())
              .replace('{seed}', settings.seed?.toString() || 'null')
              .replace(
                '{stopSequences}',
                JSON.stringify(settings.stopSequences || [])
              )
          } else if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
              return obj.map(replaceInObject)
            } else {
              const newObj: any = {}
              Object.entries(obj).forEach(([key, value]) => {
                newObj[key] = replaceInObject(value)
              })
              return newObj
            }
          }
          return obj
        }

        body = convertNumericValues(replaceInObject(body))
      }

      console.log('AI Request:', {
        url: `${provider.baseUrl}${url}`,
        method: provider.requestFormat.method,
        headers: headers,
        body: body
      })

      const response = await fetch(`${provider.baseUrl}${url}`, {
        method: provider.requestFormat.method,
        headers: headers,
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          content: '',
          error:
            errorData.error?.message ||
            `Erro HTTP ${response.status}: ${response.statusText}`
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

      const content =
        getValueByPath(responseData, provider.responseFormat.contentPath) || ''
      const usage = provider.responseFormat.usagePath
        ? getValueByPath(responseData, provider.responseFormat.usagePath)
        : undefined

      const normalizedUsage = usage
        ? normalizeUsageData(usage, settings.provider)
        : undefined

      return {
        content,
        usage: normalizedUsage,
        raw: responseData
      }
    } catch (error) {
      console.error('Erro na geração de resposta:', error)
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  async testConnection(
    settings: AIProviderSettings
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const provider = getProvider(settings.provider)
      if (!provider) {
        return {
          success: false,
          error: `Provider '${settings.provider}' não encontrado`
        }
      }

      const model = getModel(settings.provider, settings.model)
      if (!model) {
        return {
          success: false,
          error: `Modelo '${settings.model}' não encontrado`
        }
      }

      const apiKey = getCurrentApiKey(settings)
      if (!apiKey) {
        return {
          success: false,
          error: 'Chave de API não configurada'
        }
      }

      // Construir URL de teste
      const url = provider.requestFormat.endpoint
        .replace('{model}', model.name)
        .replace('{apiKey}', apiKey)

      // Construir headers
      const headers: Record<string, string> = {}
      Object.entries(provider.headers).forEach(([key, value]) => {
        headers[key] = String(value).replace('{apiKey}', apiKey)
      })

      // Construir body de teste
      const body = JSON.parse(JSON.stringify(provider.requestFormat.body))

      // Substituir placeholders no body
      const replaceInObject = (obj: any): any => {
        if (typeof obj === 'string') {
          return obj
            .replace('{model}', model.name)
            .replace('{systemPrompt}', 'Teste de conexão')
            .replace('{userPrompt}', 'Olá')
            .replace('{fullPrompt}', 'Teste de conexão\n\nOlá')
            .replace('{temperature}', '0.7')
            .replace('{maxTokens}', '10')
            .replace('{topP}', '1')
            .replace('{frequencyPenalty}', '0')
            .replace('{presencePenalty}', '0')
            .replace('{topK}', '1')
            .replace('{seed}', 'null')
            .replace('{stopSequences}', '[]')
        } else if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            return obj.map(replaceInObject)
          } else {
            const newObj: any = {}
            Object.entries(obj).forEach(([key, value]) => {
              newObj[key] = replaceInObject(value)
            })
            return newObj
          }
        }
        return obj
      }

      const processedBody = convertNumericValues(replaceInObject(body))

      const response = await fetch(`${provider.baseUrl}${url}`, {
        method: provider.requestFormat.method,
        headers: headers,
        body: JSON.stringify(processedBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error:
            errorData.error?.message ||
            `Erro HTTP ${response.status}: ${response.statusText}`
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }
}

export const aiService = AIService.getInstance()
