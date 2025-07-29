import { useRecoilState } from 'recoil'
import { useCallback } from 'react'
import { promptsState, selectedPromptState, savePrompts, Prompt } from '../store/prompts'

export const usePrompts = () => {
  const [prompts, setPrompts] = useRecoilState(promptsState)
  const [selectedPrompt, setSelectedPrompt] = useRecoilState(selectedPromptState)

  const updatePrompts = useCallback((newPrompts: Prompt[]) => {
    setPrompts(newPrompts)
    savePrompts(newPrompts)
  }, [setPrompts])

  const addPrompt = useCallback((prompt: Prompt) => {
    const newPrompts = [...prompts, prompt]
    setPrompts(newPrompts)
    savePrompts(newPrompts)
  }, [prompts, setPrompts])

  const updatePrompt = useCallback((promptId: string, updatedPrompt: Prompt) => {
    const newPrompts = prompts.map(prompt => 
      prompt.id === promptId ? updatedPrompt : prompt
    )
    setPrompts(newPrompts)
    savePrompts(newPrompts)
  }, [prompts, setPrompts])

  const deletePrompt = useCallback((promptId: string) => {
    const newPrompts = prompts.filter(prompt => prompt.id !== promptId)
    setPrompts(newPrompts)
    savePrompts(newPrompts)
  }, [prompts, setPrompts])

  return {
    prompts,
    selectedPrompt,
    setSelectedPrompt,
    updatePrompts,
    addPrompt,
    updatePrompt,
    deletePrompt
  }
} 