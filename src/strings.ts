import { en } from './locales/en/strings'
import { pt } from './locales/pt/strings'

export const strings = {
  en,
  pt
}

// Função helper para acessar as strings
export const t = (key: string, language: 'en' | 'pt' = 'en'): string => {
  const keys = key.split('.')
  let value: any = strings[language]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
  }

  return typeof value === 'string' ? value : key
}
