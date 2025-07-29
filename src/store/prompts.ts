import { atom } from 'recoil'
import Store from 'electron-store'
import { JSONSchemaType } from 'json-schema-typed'

export interface Prompt {
  id: string
  name: string
  description: string
  systemPrompt: string
  userPrompt: string
  variables: string[]
  createdAt: string
  isModified?: boolean
  lastSaved?: string
  env?: Record<string, string>
}

// Store para persistência dos prompts
const promptsStore = new Store({
  encryptionKey: '',
  schema: {
    prompts: {
      type: JSONSchemaType.Array,
      default: [],
      items: {
        type: JSONSchemaType.Object,
        default: {},
        properties: {
          id: {
            type: JSONSchemaType.String,
            default: ''
          },
          name: {
            type: JSONSchemaType.String,
            default: ''
          },
          description: {
            type: JSONSchemaType.String,
            default: ''
          },
          systemPrompt: {
            type: JSONSchemaType.String,
            default: ''
          },
          userPrompt: {
            type: JSONSchemaType.String,
            default: ''
          },
          variables: {
            type: JSONSchemaType.Array,
            default: [],
            items: {
              type: JSONSchemaType.String,
              default: ''
            }
          },
          createdAt: {
            type: JSONSchemaType.String,
            default: ''
          },
          isModified: {
            type: JSONSchemaType.Boolean,
            default: false
          },
          lastSaved: {
            type: JSONSchemaType.String,
            default: ''
          }
        }
      }
    }
  }
})

// Função para carregar prompts salvos
export const loadPrompts = (): Prompt[] => {
  try {
    const savedPrompts = promptsStore.get('prompts') as Prompt[]
    return savedPrompts || []
  } catch (error) {
    console.warn('Error loading prompts:', error)
    return []
  }
}

// Função para salvar prompts
export const savePrompts = (prompts: Prompt[]): void => {
  try {
    promptsStore.set('prompts', prompts)
  } catch (error) {
    console.error('Error saving prompts:', error)
  }
}

export const promptsState = atom<Prompt[]>({
  key: 'promptsState',
  default: loadPrompts()
})

export const selectedPromptState = atom<Prompt | null>({
  key: 'selectedPromptState',
  default: null
}) 