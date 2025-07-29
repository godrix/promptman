import { atom } from 'recoil'
import Store from 'electron-store'
import { JSONSchemaType } from 'json-schema-typed'
import { 
  getDefaultProvider, 
  getDefaultModel, 
  defaultSettings,
  getProvider,
  getModel,
  providers
} from '../config'

export interface ModelSettings {
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
  apiKeys: Record<string, string> // Chaves de API por provider
}

const defaultProvider = getDefaultProvider()
const defaultModel = getDefaultModel()

export const defaultModelSettings: ModelSettings = {
  provider: defaultProvider.id,
  model: defaultModel.id,
  temperature: defaultSettings.temperature,
  maxTokens: defaultSettings.maxTokens,
  // Configurações avançadas com valores padrão
  topP: defaultSettings.topP || 1,
  frequencyPenalty: defaultSettings.frequencyPenalty || 0,
  presencePenalty: defaultSettings.presencePenalty || 0,
  topK: undefined,
  stopSequences: undefined,
  seed: undefined,
  apiKeys: {}
}

// Store para persistência das configurações do modelo
const modelSettingsStore = new Store({
  encryptionKey: '',
  schema: {
    modelSettings: {
      type: JSONSchemaType.Object,
      default: defaultModelSettings,
      properties: {
        provider: {
          type: JSONSchemaType.String,
          default: defaultModelSettings.provider
        },
        model: {
          type: JSONSchemaType.String,
          default: defaultModelSettings.model
        },
        temperature: {
          type: JSONSchemaType.Number,
          default: defaultModelSettings.temperature
        },
        maxTokens: {
          type: JSONSchemaType.Number,
          default: defaultModelSettings.maxTokens
        },
        topP: {
          type: JSONSchemaType.Number,
          default: defaultModelSettings.topP
        },
        frequencyPenalty: {
          type: JSONSchemaType.Number,
          default: defaultModelSettings.frequencyPenalty
        },
        presencePenalty: {
          type: JSONSchemaType.Number,
          default: defaultModelSettings.presencePenalty
        },
        topK: {
          type: JSONSchemaType.Number,
          default: defaultModelSettings.topK
        },
        stopSequences: {
          type: JSONSchemaType.Array,
          default: defaultModelSettings.stopSequences
        },
        seed: {
          type: JSONSchemaType.Number,
          default: defaultModelSettings.seed
        },
        apiKeys: {
          type: JSONSchemaType.Object,
          default: defaultModelSettings.apiKeys
        }
      }
    }
  }
})

// Função para carregar configurações salvas
export const loadModelSettings = (): ModelSettings => {
  try {
    const savedSettings = modelSettingsStore.get('modelSettings') as ModelSettings
    return savedSettings || defaultModelSettings
  } catch (error) {
    console.warn('Error loading model settings:', error)
    return defaultModelSettings
  }
}

// Função para salvar configurações
export const saveModelSettings = (settings: ModelSettings): void => {
  try {
    modelSettingsStore.set('modelSettings', settings)
  } catch (error) {
    console.error('Error saving model settings:', error)
  }
}

export const modelSettingsState = atom<ModelSettings>({
  key: 'modelSettingsState',
  default: loadModelSettings()
})

// Função para obter providers disponíveis dinamicamente
export const getAvailableProvidersList = () => {
  return providers.map(provider => ({
    value: provider.id,
    label: provider.displayName
  }))
}

// Função para obter modelos de um provider dinamicamente
export const getAvailableModelsForProvider = (providerName: string) => {
  const provider = providers.find(p => p.id === providerName)
  if (!provider) {
    return []
  }
  return provider.models.map(model => ({
    value: model.id,
    label: model.displayName
  }))
}

// Função para obter o nome do modelo atual
export const getCurrentModelName = (settings: ModelSettings) => {
  try {
    const models = getAvailableModelsForProvider(settings.provider)
    const currentModel = models.find(model => model.value === settings.model)
    return currentModel?.label || settings.model
  } catch (error) {
    console.warn('Error getting model name:', error)
    return settings.model
  }
}

// Função para obter a chave de API do provider atual
export const getCurrentApiKey = (settings: ModelSettings): string => {
  return settings.apiKeys[settings.provider] || ''
}

// Função para definir a chave de API de um provider específico
export const setProviderApiKey = (providerId: string, apiKey: string): void => {
  try {
    const currentSettings = modelSettingsStore.get('modelSettings') as ModelSettings
    const updatedSettings = {
      ...currentSettings,
      apiKeys: {
        ...currentSettings.apiKeys,
        [providerId]: apiKey
      }
    }
    modelSettingsStore.set('modelSettings', updatedSettings)
  } catch (error) {
    console.error('Error saving provider API key:', error)
  }
}

// Função para obter a chave de API de um provider específico
export const getProviderApiKey = (providerId: string): string => {
  try {
    const currentSettings = modelSettingsStore.get('modelSettings') as ModelSettings
    return currentSettings.apiKeys[providerId] || ''
  } catch (error) {
    console.warn('Error getting provider API key:', error)
    return ''
  }
} 