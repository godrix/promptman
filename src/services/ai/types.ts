export interface AIProvider {
  name: string
  displayName: string
  models: AIModel[]
  config: AIProviderConfig
}

export interface AIModel {
  id: string
  name: string
  displayName: string
  maxTokens: number
  supportsVision?: boolean
  fileSupport?: {
    enabled: boolean
    maxSize: number
    allowedTypes: string[]
    processing: {
      method: 'context' | 'base64'
      format: string
      contextTemplate: string
    }
  }
}

export interface AIProviderConfig {
  baseUrl: string
  headers: Record<string, string>
  requestBuilder: (params: AIRequestParams) => AIRequest
  responseParser: (response: any) => AIResponse
}

export interface AIRequestParams {
  prompt: string
  systemPrompt?: string
  model: string
  temperature: number
  maxTokens: number
  apiKey: string
  variables?: Record<string, string>
  attachedFile?: File | null
}

export interface AIRequest {
  url: string
  method: string
  headers: Record<string, string>
  body: any
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
  raw?: any
}

export interface AIProviderSettings {
  provider: string
  model: string
  temperature: number
  maxTokens: number
  // Configurações avançadas
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  topK?: number
  stopSequences?: string[]
  seed?: number
  apiKeys: Record<string, string>
}

// Tipos para configuração dinâmica via JSON
export interface RequestFormat {
  method: string
  endpoint: string
  body: any
  fileProcessing?: {
    enabled: boolean
    strategy: 'multimodal' | 'responses_api'
    contentStructure: any[]
  }
}

export interface ResponseFormat {
  contentPath: string
  usagePath?: string
  errorPath?: string
}
