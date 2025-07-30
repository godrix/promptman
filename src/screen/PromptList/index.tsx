import React, { useState, useEffect } from 'react'
import { usePrompts } from '../../hooks/usePrompts'
import { FiSave, FiTrash2, FiCircle } from 'react-icons/fi'

import {
  Container,
  Header,
  Title,
  AddButton,
  PromptItem,
  PromptContent,
  PromptInfo,
  PromptActions,
  ActionButton,
  PromptName,
  PromptDescription,
  UnsavedIndicator
} from './styles'
import { promptsState, selectedPromptState, Prompt } from '../../store/prompts'

const PromptList: React.FC = () => {
  const {
    prompts,
    selectedPrompt,
    setSelectedPrompt,
    updatePrompts
  } = usePrompts()
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddPrompt = () => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      name: 'Untitled',
      description: 'Prompt vazio',
      systemPrompt: '',
      userPrompt: '',
      variables: [],
      createdAt: new Date().toISOString(),
      isModified: false,
      lastSaved: new Date().toISOString()
    }
    updatePrompts([...prompts, newPrompt])
    setSelectedPrompt(newPrompt)
  }

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
  }

  const handleSavePrompt = (e: React.MouseEvent, prompt: Prompt) => {
    e.stopPropagation()

    // Marcar o prompt como salvo
    const updatedPrompt: Prompt = {
      ...prompt,
      isModified: false,
      lastSaved: new Date().toISOString(),
      description: generateDescription(prompt.userPrompt, prompt.systemPrompt)
    }

    updatePrompts(
      prompts.map((p: Prompt) => (p.id === prompt.id ? updatedPrompt : p))
    )

    // Se o prompt selecionado for o mesmo, atualizar também
    if (selectedPrompt?.id === prompt.id) {
      setSelectedPrompt(updatedPrompt)
    }

    // Mostrar feedback visual temporário
    const button = e.currentTarget as HTMLButtonElement
    const originalColor = button.style.color
    button.style.color = '#67e480'
    setTimeout(() => {
      button.style.color = originalColor
    }, 1000)

    console.log('Prompt salvo:', updatedPrompt)
  }

  const handleDeletePrompt = (e: React.MouseEvent, promptToDelete: Prompt) => {
    e.stopPropagation()

    if (
      window.confirm(
        `Tem certeza que deseja excluir o prompt "${promptToDelete.name}"?`
      )
    ) {
      updatePrompts(prompts.filter((p: Prompt) => p.id !== promptToDelete.id))

      // Se o prompt excluído era o selecionado, limpar a seleção
      if (selectedPrompt?.id === promptToDelete.id) {
        setSelectedPrompt(null)
      }

      console.log('Prompt excluído:', promptToDelete)
    }
  }

  const generateDescription = (
    userPrompt: string,
    systemPrompt: string
  ): string => {
    const combinedText = (userPrompt + ' ' + systemPrompt).trim()
    if (!combinedText) return 'Prompt vazio'

    // Pegar os primeiros 50 caracteres e adicionar "..." se necessário
    return combinedText.length > 50
      ? combinedText.substring(0, 50) + '...'
      : combinedText
  }

  useEffect(() => {
    const { ipcRenderer } = window.require
      ? window.require('electron')
      : require('electron')
    const handleIpcNewPrompt = () => handleAddPrompt()
    ipcRenderer.addListener('newPrompt', handleIpcNewPrompt)
    return () => {
      ipcRenderer.removeListener('newPrompt', handleIpcNewPrompt)
    }
  }, [])

  return (
    <Container>
      <Header>
        <Title>Prompts</Title>
        <AddButton onClick={handleAddPrompt}>+</AddButton>
      </Header>

      {prompts.map((prompt: Prompt) => (
        <PromptItem
          key={prompt.id}
          isSelected={selectedPrompt?.id === prompt.id}
          onClick={() => handleSelectPrompt(prompt)}
        >
          <PromptContent>
            <PromptInfo>
              <PromptName>
                {prompt.name}
                {prompt.isModified && (
                  <UnsavedIndicator title="Não salvo">
                    <FiCircle size={8} />
                  </UnsavedIndicator>
                )}
              </PromptName>
              <PromptDescription>{prompt.description}</PromptDescription>
            </PromptInfo>
            <PromptActions>
              <ActionButton
                className="save"
                onClick={e => handleSavePrompt(e, prompt)}
                title={prompt.isModified ? 'Salvar alterações' : 'Prompt salvo'}
              >
                <FiSave size={14} />
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={e => handleDeletePrompt(e, prompt)}
                title="Excluir prompt"
              >
                <FiTrash2 size={14} />
              </ActionButton>
            </PromptActions>
          </PromptContent>
        </PromptItem>
      ))}
    </Container>
  )
}

export default PromptList
