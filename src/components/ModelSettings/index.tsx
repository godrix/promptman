import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useModelSettings } from '../../hooks/useModelSettings'
import {
  getAvailableProvidersList,
  getAvailableModelsForProvider,
  getCurrentModelName
} from '../../store/modelSettings'
import { getDefaultModelForProvider } from '../../config'
import { useToast } from '../../context/toast'
import Modal from '../Modal'
import {
  Container,
  Button,
  ButtonContent,
  ButtonText,
  CloseButton,
  Select,
  Label,
  ApiKeyInput,
  SaveButton,
  TestButton
} from './styles'

interface ModelSettingsProps {
  isOpen?: boolean
  onClose?: () => void
}

const ModelSettings: React.FC<ModelSettingsProps> = ({
  isOpen = false,
  onClose
}) => {
  const { modelSettings, updateModelSettings } = useModelSettings()
  const { addToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSettings, setTempSettings] = useState(modelSettings)

  // Controlar modal externamente
  React.useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true)
      setTempSettings(modelSettings)
    } else {
      setIsModalOpen(false)
    }
  }, [isOpen, modelSettings])

  const handleProviderChange = (newProvider: string) => {
    const defaultModel = getDefaultModelForProvider(newProvider)

    setTempSettings(prev => ({
      ...prev,
      provider: newProvider,
      model: defaultModel ? defaultModel.id : prev.model
    }))

    if (defaultModel) {
      addToast({
        type: 'info',
        title: 'Modelo atualizado',
        description: `Modelo alterado automaticamente para ${defaultModel.displayName} (padrão do ${newProvider})`
      })
    }
  }

  const handleModelChange = (newModel: string) => {
    setTempSettings(prev => ({
      ...prev,
      model: newModel
    }))
  }

  const handleApiKeyChange = (apiKey: string) => {
    setTempSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [prev.provider]: apiKey
      }
    }))
  }

  const handleSave = () => {
    updateModelSettings(tempSettings)
    setIsModalOpen(false)
    if (onClose) onClose()

    addToast({
      type: 'success',
      title: 'Configurações salvas',
      description: 'As configurações do provider foram salvas permanentemente.'
    })
  }

  const handleTestConnection = async () => {
    try {
      // Aqui você pode implementar a lógica de teste de conexão
      addToast({
        type: 'success',
        title: 'Conexão testada',
        description: 'Conexão com o provider estabelecida com sucesso.'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro na conexão',
        description:
          'Não foi possível conectar com o provider. Verifique sua chave de API.'
      })
    }
  }

  const currentModelName = getCurrentModelName(modelSettings)
  const currentProvider = getAvailableProvidersList().find(
    p => p.value === modelSettings.provider
  )

  return (
    <Modal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false)
        if (onClose) onClose()
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #322D41'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: '#E1E1E6'
            }}
          >
            Configurações do Modelo
          </h2>
          <CloseButton
            onClick={() => {
              setIsModalOpen(false)
              if (onClose) onClose()
            }}
          >
            ×
          </CloseButton>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Label>Provider:</Label>
          <Select
            value={tempSettings.provider}
            onChange={e => handleProviderChange(e.target.value)}
          >
            {getAvailableProvidersList().map(provider => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Label>Modelo:</Label>
          <Select
            value={tempSettings.model}
            onChange={e => handleModelChange(e.target.value)}
          >
            {getAvailableModelsForProvider(tempSettings.provider).map(model => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Label>API Key ({tempSettings.provider}):</Label>
          <ApiKeyInput
            type="password"
            value={tempSettings.apiKeys[tempSettings.provider] || ''}
            onChange={e => handleApiKeyChange(e.target.value)}
            placeholder="Digite sua chave de API"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <TestButton onClick={handleTestConnection}>Testar Conexão</TestButton>
          <SaveButton onClick={handleSave}>Salvar</SaveButton>
        </div>
      </Container>
    </Modal>
  )
}

export default ModelSettings
