import React, { useState, useEffect } from 'react'
import {
  FiCode,
  FiX,
  FiSave,
  FiRefreshCw,
  FiEye,
  FiEdit3
} from 'react-icons/fi'
import { useToast } from '../../context/toast'
import { t } from '../../strings'
import Modal from '../Modal'
import JsonViewer from '../JsonViewer'
import {
  Container,
  Button,
  ButtonContent,
  ButtonText,
  CloseButton,
  TextArea,
  ButtonGroup,
  SaveButton,
  ResetButton,
  ErrorMessage
} from './styles'

interface ProvidersConfig {
  providers: Array<{
    id: string
    name: string
    displayName: string
    baseUrl: string
    models: Array<{
      id: string
      name: string
      displayName: string
      maxTokens: number
      defaultTemperature: number
      defaultMaxTokens: number
    }>
    headers: Record<string, string>
    requestFormat: {
      method: string
      endpoint: string
      body: any
    }
    responseFormat: {
      contentPath: string
      usagePath: string
      errorPath: string
    }
  }>
  defaultProvider: string
  defaultModel: string
  defaultSettings: {
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    topK: number
    stopSequences: string[]
    seed: number | null
  }
}

interface ProvidersConfigEditorProps {
  isOpen?: boolean
  onClose?: () => void
}

const ProvidersConfigEditor: React.FC<ProvidersConfigEditorProps> = ({
  isOpen = false,
  onClose
}) => {
  const { addToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [configText, setConfigText] = useState('')
  const [originalConfig, setOriginalConfig] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showJsonViewer, setShowJsonViewer] = useState(true)

  // Carregar configuração atual
  const loadCurrentConfig = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Usar o serviço para ler o arquivo
      const { ipcRenderer } = window.require
        ? window.require('electron')
        : require('electron')
      const currentConfig = await ipcRenderer.invoke('read-providers-config')
      const configString = JSON.stringify(currentConfig, null, 2)

      setConfigText(configString)
      setOriginalConfig(configString)
    } catch (err) {
      setError('Erro ao carregar configuração atual')
      console.error('Erro ao carregar providers.json:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Abrir modal
  const handleOpenModal = () => {
    setIsModalOpen(true)
    loadCurrentConfig()
  }

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setConfigText('')
    setOriginalConfig('')
    setError(null)
    if (onClose) {
      onClose()
    }
  }

  // Controlar modal externamente
  useEffect(() => {
    if (isOpen) {
      handleOpenModal()
    } else {
      handleCloseModal()
    }
  }, [isOpen])

  // Validar JSON
  const validateJSON = (text: string): boolean => {
    try {
      const parsed = JSON.parse(text)

      // Validações básicas da estrutura
      if (!parsed.providers || !Array.isArray(parsed.providers)) {
        throw new Error('Configuração deve ter um array "providers"')
      }

      if (
        !parsed.defaultProvider ||
        typeof parsed.defaultProvider !== 'string'
      ) {
        throw new Error('Configuração deve ter um "defaultProvider" válido')
      }

      if (!parsed.defaultModel || typeof parsed.defaultModel !== 'string') {
        throw new Error('Configuração deve ter um "defaultModel" válido')
      }

      if (
        !parsed.defaultSettings ||
        typeof parsed.defaultSettings !== 'object'
      ) {
        throw new Error('Configuração deve ter um objeto "defaultSettings"')
      }

      // Validar cada provider
      parsed.providers.forEach((provider: any, index: number) => {
        if (!provider.id || !provider.name || !provider.displayName) {
          throw new Error(
            `Provider ${index + 1} deve ter id, name e displayName`
          )
        }

        if (!provider.models || !Array.isArray(provider.models)) {
          throw new Error(
            `Provider ${provider.name} deve ter um array "models"`
          )
        }

        if (!provider.requestFormat || !provider.responseFormat) {
          throw new Error(
            `Provider ${provider.name} deve ter requestFormat e responseFormat`
          )
        }
      })

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON inválido')
      return false
    }
  }

  // Salvar configuração
  const handleSave = async () => {
    if (!validateJSON(configText)) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const parsedConfig = JSON.parse(configText)

      // Usar o serviço para salvar o arquivo
      const { ipcRenderer } = window.require
        ? window.require('electron')
        : require('electron')
      await ipcRenderer.invoke('write-providers-config', parsedConfig)

      // Atualizar a configuração original
      setOriginalConfig(configText)

      addToast({
        type: 'success',
        title: 'Configuração salva',
        description: 'O arquivo providers.json foi atualizado com sucesso.'
      })

      handleCloseModal()
    } catch (err) {
      setError('Erro ao salvar configuração')
      console.error('Erro ao salvar providers.json:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Resetar para configuração original
  const handleReset = () => {
    setConfigText(originalConfig)
    setError(null)
  }

  // Obter dados JSON parseados
  const getParsedConfig = () => {
    try {
      return JSON.parse(configText)
    } catch {
      return null
    }
  }

  // Verificar se houve mudanças
  const hasChanges = configText !== originalConfig

  return (
    <>
      {!isOpen && (
        <Button onClick={handleOpenModal}>
          <ButtonContent>
            <FiCode size={16} />
            <ButtonText>providers.json</ButtonText>
          </ButtonContent>
        </Button>
      )}

      <Modal visible={isModalOpen} onRequestClose={handleCloseModal}>
        <Container>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid #322D41'
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 600,
                color: '#E1E1E6'
              }}
            >
              {t('promptEditor.editProvidersConfig')}
            </h2>
            <CloseButton onClick={handleCloseModal}>
              <FiX size={20} />
            </CloseButton>
          </div>

          {error && (
            <ErrorMessage>
              <strong>Erro:</strong> {error}
            </ErrorMessage>
          )}

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <p
                style={{
                  color: '#E1E1E6',
                  fontSize: '14px',
                  margin: 0,
                  opacity: 0.8
                }}
              >
                Visualize e edite a configuração de providers. Use "Visualizar"
                para navegar pela estrutura ou "Editar" para modificar o JSON.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <button
                  onClick={() => setShowJsonViewer(true)}
                  style={{
                    background: showJsonViewer ? '#8257e6' : 'transparent',
                    color: showJsonViewer ? '#fff' : '#8257e6',
                    border: '1px solid #8257e6',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  disabled={isLoading}
                >
                  <FiEye size={12} />
                  Visualizar
                </button>

                <button
                  onClick={() => setShowJsonViewer(false)}
                  style={{
                    background: !showJsonViewer ? '#8257e6' : 'transparent',
                    color: !showJsonViewer ? '#fff' : '#8257e6',
                    border: '1px solid #8257e6',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  disabled={isLoading}
                >
                  <FiEdit3 size={12} />
                  Editar
                </button>
              </div>
            </div>
          </div>

          {showJsonViewer ? (
            getParsedConfig() ? (
              <JsonViewer
                data={getParsedConfig()}
                title="Configuração de Providers"
                showControls={true}
                collapsed={false}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={true}
                style={{
                  height: '60vh',
                  border: '1px solid #322D41',
                  borderRadius: '8px'
                }}
              />
            ) : (
              <div
                style={{
                  background: '#18181a',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#ef4444',
                  textAlign: 'center',
                  height: '60vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <p>JSON inválido. Use o editor para corrigir os erros.</p>
              </div>
            )
          ) : (
            <TextArea
              value={configText}
              onChange={e => {
                setConfigText(e.target.value)
                setError(null)
              }}
              placeholder={t('promptEditor.providersConfigDescription')}
              spellCheck={false}
              disabled={isLoading}
            />
          )}

          <ButtonGroup>
            <ResetButton
              onClick={handleReset}
              disabled={!hasChanges || isLoading}
            >
              <FiRefreshCw size={16} />
              Resetar
            </ResetButton>

            <SaveButton
              onClick={handleSave}
              disabled={!hasChanges || isLoading || !!error}
            >
              <FiSave size={16} />
              Salvar
            </SaveButton>
          </ButtonGroup>
        </Container>
      </Modal>
    </>
  )
}

export default ProvidersConfigEditor
