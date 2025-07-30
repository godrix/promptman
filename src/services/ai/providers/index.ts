import { AIProvider } from '../types'
import { geminiProvider } from './gemini'
import { openaiProvider } from './openai'

export const providers: Record<string, AIProvider> = {
  Gemini: geminiProvider,
  OpenAI: openaiProvider
}

export const getProvider = (name: string): AIProvider | undefined => {
  return providers[name]
}

export const getAvailableProviders = (): AIProvider[] => {
  return Object.values(providers)
}

export const getProviderModels = (providerName: string) => {
  const provider = getProvider(providerName)
  return provider?.models || []
}

// Função para adicionar novos providers dinamicamente
export const registerProvider = (provider: AIProvider) => {
  providers[provider.name] = provider
}
