import providersConfig from './providers.json'
import appConfig from './app.json'

// Tipos para as configurações
export interface Provider {
  id: string
  name: string
  displayName: string
  baseUrl: string
  models: Model[]
  headers: Record<string, string>
  requestFormat: RequestFormat
  responseFormat: ResponseFormat
}

export interface Model {
  id: string
  name: string
  displayName: string
  maxTokens: number
  defaultTemperature: number
  defaultMaxTokens: number
}

export interface RequestFormat {
  method: string
  endpoint: string
  body: any
}

export interface ResponseFormat {
  contentPath: string
  usagePath: string
  errorPath: string
}

export interface AppConfig {
  app: {
    name: string
    version: string
    description: string
    author: string
    repository: string
  }
  ui: {
    theme: {
      default: string
      available: string[]
    }
    language: {
      default: string
      available: string[]
    }
    window: {
      defaultWidth: number
      defaultHeight: number
      minWidth: number
      minHeight: number
    }
  }
  features: {
    templalize: {
      enabled: boolean
      defaultSystemPrompt: string
    }
    variables: {
      enabled: boolean
      pattern: string
      autoDetect: boolean
    }
    tokenCounting: {
      enabled: boolean
      warningThreshold: number
    }
    autoSave: {
      enabled: boolean
      interval: number
    }
  }
  shortcuts: {
    save: string
    run: string
    newPrompt: string
    openSettings: string
    templalize: string
  }
  storage: {
    prompts: string
    settings: string
    history: string
  }
}

// Configurações exportadas
export const providers = providersConfig.providers as Provider[]
export const defaultProvider = providersConfig.defaultProvider as string
export const defaultModel = providersConfig.defaultModel as string
export const defaultSettings = providersConfig.defaultSettings

export const app = appConfig as AppConfig

// Funções utilitárias
export const getProvider = (id: string): Provider | undefined => {
  return providers.find(provider => provider.id === id)
}

export const getModel = (
  providerId: string,
  modelId: string
): Model | undefined => {
  const provider = getProvider(providerId)
  return provider?.models.find(model => model.id === modelId)
}

export const getDefaultProvider = (): Provider => {
  return getProvider(defaultProvider) || providers[0]
}

export const getDefaultModel = (): Model => {
  const provider = getDefaultProvider()
  return getModel(provider.id, defaultModel) || provider.models[0]
}

// Função para obter o modelo padrão de um provider específico
export const getDefaultModelForProvider = (
  providerId: string
): Model | undefined => {
  const provider = getProvider(providerId)
  if (!provider) return undefined

  // Se o provider tem o modelo padrão configurado, usar ele
  if (providerId === defaultProvider) {
    return getModel(providerId, defaultModel) || provider.models[0]
  }

  // Caso contrário, usar o primeiro modelo disponível
  return provider.models[0]
}

// Configurações específicas da aplicação
export const getAppConfig = () => app
export const getUIConfig = () => app.ui
export const getFeaturesConfig = () => app.features
export const getShortcutsConfig = () => app.shortcuts
export const getStorageConfig = () => app.storage
