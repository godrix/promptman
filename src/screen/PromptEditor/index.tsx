import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { FiPlay, FiChevronDown, FiChevronRight, FiCode, FiX, FiSliders, FiMessageSquare, FiPlus, FiTrash2, FiUser, FiMessageCircle, FiMaximize2, FiArrowUp, FiArrowDown, FiHash, FiCopy, FiStar, FiZap, FiThermometer, FiBarChart, FiTarget, FiRotateCcw, FiUserCheck, FiSquare, FiCircle, FiMinus } from 'react-icons/fi'

import { getAvailableProvidersList, getAvailableModelsForProvider, getCurrentModelName } from '../../store/modelSettings'
import { getDefaultModelForProvider } from '../../config'
import { useModelSettings } from '../../hooks/useModelSettings'
import { usePrompts } from '../../hooks/usePrompts'
import { aiService } from '../../services/ai/aiService'
import { useToast } from '../../context/toast'
import { countPromptTokens, formatTokenCount, estimateTokenCount } from '../../utils/tokenCounter'
import Modal from '../../components/Modal'
import { useTranslation } from 'react-i18next'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
}


import {
  Container,
  Header,
  Title,
  RunButton,
  Content,
  EditorSection,
  ConfigSection,
  VariablesButton,
  ModelSettingsButton,
  TemplalizeButton,
  VariablesBadge,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  RemoveVariableButton,
  Select,
  RangeContainer,
  RangeLabel,
  RangeValue,
  RangeInput,
  SaveButton,
  ApiKeyInput,
  AccordionSection,
  AccordionHeader,
  AccordionContent,
  TestSection,
  Label,
  TextArea,
  VariableInput,
  VariableList,
  VariableItem,
  RemoveButton,
  TestButton,
  ResponseArea,
  Footer,
  TokenProgressBar,
  TokenProgressBarTrack,
  TokenProgressBarFill,
  TokenCounter,
  AddMessageButton,
  MessagePair,
  MessageHeader,
  MessageType,
  RemoveMessageButton,
  MessageContent,
  Loading,
  Spinner
} from './styles'

const PromptEditor: React.FC = () => {
  const { modelSettings, updateModelSettings } = useModelSettings()
  const { prompts, selectedPrompt, setSelectedPrompt, updatePrompts, updatePrompt } = usePrompts()
  const [testVariables, setTestVariables] = useState<Record<string, string>>({})
  const [responses, setResponses] = useState<{ [promptId: string]: string | { text: string; raw: any } }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [systemPromptOpen, setSystemPromptOpen] = useState(false)
  const [variablesPanelOpen, setVariablesPanelOpen] = useState(false)
  const [modelSettingsPanelOpen, setModelSettingsPanelOpen] = useState(false)
  const [templalizePanelOpen, setTemplalizePanelOpen] = useState(false)
  const [templalizeModalOpen, setTemplalizeModalOpen] = useState(false)
  const [templalizedPrompt, setTemplalizedPrompt] = useState('')
  const [isTemplalizing, setIsTemplalizing] = useState(false)
  const [tempModelSettings, setTempModelSettings] = useState(modelSettings)
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false)
  const [modelSettingsSaved, setModelSettingsSaved] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const { addToast } = useToast()
  const [isPromptModalOpen, setPromptModalOpen] = useState(false)
  const [modalPromptValue, setModalPromptValue] = useState(selectedPrompt?.userPrompt || '')
  const [showRawResponse, setShowRawResponse] = useState(false)
  const { t } = useTranslation()

  // Frases engraçadas para mostrar durante o loading
  const loadingPhrases = [
    "🤖 Aquecendo os neurônios artificiais...",
    "🧠 Consultando a sabedoria digital...",
    "⚡ Carregando a inteligência artificial...",
    "🔮 Consultando os oráculos da IA...",
    "🎯 Mirando na resposta perfeita...",
    "🚀 Acelerando os processadores...",
    "💭 Pensando como um humano (mas melhor)...",
    "🎪 Preparando o show da IA...",
    "🔍 Procurando a resposta na nuvem...",
    "⚙️ Ajustando os parâmetros mágicos...",
    "🎨 Pintando com pixels de conhecimento...",
    "🌪️ Gerando uma tempestade de ideias...",
    "🎭 Atuando como um assistente virtual...",
    "🔋 Carregando as baterias da criatividade...",
    "🎪 Preparando o circo da inteligência...",
    "🚁 Decolando para o espaço da resposta...",
    "🎯 Mirando na precisão máxima...",
    "⚡ Energizando os circuitos neurais...",
    "🎨 Misturando cores de conhecimento...",
    "🌟 Buscando estrelas de sabedoria..."
  ]

  const [currentLoadingPhrase, setCurrentLoadingPhrase] = useState(0)

  // Configurações específicas para templalize (sempre Gemini)
  const templalizeSettings = {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    temperature: 1,
    maxTokens: 4096,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    apiKeys: {
      gemini: modelSettings.apiKeys.gemini || ''
    }
  }

  // Estado para armazenar o prompt templalizado para execução
  const [templalizedPromptForExecution, setTemplalizedPromptForExecution] = useState('')

  // Rotacionar frases durante o loading
  useEffect(() => {
    if (!isLoading) {
      setCurrentLoadingPhrase(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentLoadingPhrase(prev => (prev + 1) % loadingPhrases.length)
    }, 2000) // Muda a cada 2 segundos

    return () => clearInterval(interval)
  }, [isLoading, loadingPhrases.length])

  // Função auxiliar para verificar se há resposta
  const hasResponse = () => {
    return responseText && responseText.trim() !== ''
  }

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + S para salvar
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        handleSave()
      }
      
      // Ctrl + Enter para executar
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault()
        handleTestPrompt()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const { ipcRenderer } = window.require ? window.require('electron') : require('electron')
    const handleIpcRunPrompt = () => handleTestPrompt()
    ipcRenderer.addListener('runSelectedPrompt', handleIpcRunPrompt)
    const handleIpcSavePrompt = () => handleSave()
    ipcRenderer.addListener('saveSelectedPrompt', handleIpcSavePrompt)
    return () => {
      ipcRenderer.removeListener('runSelectedPrompt', handleIpcRunPrompt)
      ipcRenderer.removeListener('saveSelectedPrompt', handleIpcSavePrompt)
    }
  }, [])

  // Atualizar tempModelSettings quando modelSettings mudar
  useEffect(() => {
    setTempModelSettings(modelSettings)
  }, [modelSettings])

  // Sincronizar testVariables ao trocar de prompt ou ao salvar
  useEffect(() => {
    if (!selectedPrompt) return
    // Extrair variáveis do texto atual
    const systemVars = extractVariables(selectedPrompt.systemPrompt)
    const userVars = extractVariables(selectedPrompt.userPrompt)
    const allVars = Array.from(new Set([...systemVars, ...userVars]))
    if (JSON.stringify(allVars) !== JSON.stringify(selectedPrompt.variables)) {
      setSelectedPrompt(prev => prev ? { ...prev, variables: allVars } : null)
      return
    }
    // Inicializar testVariables com valores salvos em env, se existirem
    setTestVariables(prev => {
      const env = selectedPrompt.env || {}
      const next: Record<string, string> = { ...env }
      selectedPrompt.variables.forEach(v => {
        if (!(v in next)) next[v] = ''
      })
      Object.keys(next).forEach(k => {
        if (!selectedPrompt.variables.includes(k)) delete next[k]
      })
      return next
    })
  }, [selectedPrompt])

  // Função para atualizar a contagem de tokens
  const updateTokenCount = () => {
    if (selectedPrompt) {
      // Contar tokens do system prompt e user prompt principal
      let totalTokens = countPromptTokens(selectedPrompt.systemPrompt, selectedPrompt.userPrompt)
      
      // Adicionar tokens das mensagens adicionais
      messages.forEach(message => {
        totalTokens += estimateTokenCount(message.content)
      })
      
      setTokenCount(totalTokens)
    } else {
      setTokenCount(0)
    }
  }

  // Função para adicionar um novo par de mensagens
  const addMessagePair = () => {
    const newMessages: Message[] = [
      { id: `user-${Date.now()}`, type: 'user', content: '' },
      { id: `assistant-${Date.now()}`, type: 'assistant', content: '' }
    ]
    setMessages(prev => [...prev, ...newMessages])
  }

  // Função para remover uma mensagem
  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }

  // Função para atualizar o conteúdo de uma mensagem
  const updateMessage = (messageId: string, content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content } : msg
    ))
  }

  // Atualizar contagem de tokens quando o prompt selecionado ou mensagens mudarem
  useEffect(() => {
    updateTokenCount()
  }, [selectedPrompt?.systemPrompt, selectedPrompt?.userPrompt, messages])

  if (!selectedPrompt) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <FiMessageSquare 
            size={64} 
            style={{ 
              color: '#E1E1E6', 
              opacity: 0.3, 
              marginBottom: '24px' 
            }} 
          />
          <h3 style={{ 
            color: '#E1E1E6', 
            fontSize: '20px', 
            fontWeight: 600, 
            margin: '0 0 12px 0',
            opacity: 0.8
          }}>
            {t('promptEditor.welcome')}
          </h3>
          <p style={{ 
            color: '#E1E1E6', 
            fontSize: '14px', 
            margin: '0 0 24px 0',
            opacity: 0.6,
            lineHeight: '1.5',
            maxWidth: '400px'
          }}>
            {t('promptEditor.selectPrompt')}
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#E1E1E6',
            opacity: 0.4,
            fontSize: '12px'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#67e480' 
            }} />
            <span>{t('promptEditor.clickToAdd')}</span>
          </div>
        </div>
      </Container>
    )
  }

  const handleSave = () => {
    if (!selectedPrompt) return
    setSaveStatus('saving')
    // Atualizar as variáveis com base no conteúdo atual
    const systemVariables = extractVariables(selectedPrompt.systemPrompt)
    const userVariables = extractVariables(selectedPrompt.userPrompt)
    const allVariables = Array.from(new Set([...systemVariables, ...userVariables]))
    // Atualizar o prompt com a nova descrição, variáveis, env e marcar como salvo
    const updatedPrompt = {
      ...selectedPrompt,
      description: generateDescription(selectedPrompt.userPrompt, selectedPrompt.systemPrompt),
      variables: allVariables,
      env: testVariables, // Salva os valores das variáveis preenchidas
      isModified: false,
      lastSaved: new Date().toISOString()
    }
    updatePrompts(prompts.map(prompt =>
      prompt.id === selectedPrompt.id ? updatedPrompt : prompt
    ))
    setSelectedPrompt(updatedPrompt)
    // Sincronizar testVariables para manter apenas as variáveis existentes
    setTestVariables(prev => {
      const filtered: Record<string, string> = {}
      updatedPrompt.variables.forEach(v => { if (prev[v] !== undefined) filtered[v] = prev[v] })
      return filtered
    })
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
    console.log('Prompt salvo via Ctrl+S:', updatedPrompt)
  }

  const handleVariableChange = (variable: string, value: string) => {
    setTestVariables(prev => ({
      ...prev,
      [variable]: value
    }))
  }

  const handleRemoveVariable = (variableToRemove: string) => {
    // Remover a variável do prompt
    setSelectedPrompt(prev => prev ? {
      ...prev,
      variables: prev.variables.filter(variable => variable !== variableToRemove)
    } : null)
    
    // Remover a variável da lista de prompts
    updatePrompts(prompts.map(prompt => 
      prompt.id === selectedPrompt?.id ? {
        ...prompt,
        variables: prompt.variables.filter(variable => variable !== variableToRemove)
      } : prompt
    ))
    
    // Remover o valor da variável dos testes
    setTestVariables(prev => {
      const newTestVariables = { ...prev }
      delete newTestVariables[variableToRemove]
      return newTestVariables
    })
  }

  const handleClearAllVariables = () => {
    // Limpar todas as variáveis do prompt
    setSelectedPrompt(prev => prev ? {
      ...prev,
      variables: []
    } : null)
    
    // Limpar todas as variáveis da lista de prompts
    updatePrompts(prompts.map(prompt => 
      prompt.id === selectedPrompt?.id ? {
        ...prompt,
        variables: []
      } : prompt
    ))
    
    // Limpar todos os valores de teste
    setTestVariables({})
  }

  const handleModelSettingsChange = (field: keyof typeof modelSettings, value: string | number | string[] | number | undefined) => {
    // Se o provider foi alterado, atualizar automaticamente o modelo para o padrão do novo provider
    if (field === 'provider') {
      const newProvider = value as string
      const defaultModel = getDefaultModelForProvider(newProvider)
      
      // Se há um modelo padrão disponível, selecionar ele
      if (defaultModel) {
        setTempModelSettings(prev => ({
          ...prev,
          provider: newProvider,
          model: defaultModel.id
        }))
        
        // Mostrar feedback visual de que o modelo foi alterado automaticamente
        addToast({
          type: 'info',
          title: 'Modelo atualizado',
          description: `Modelo alterado automaticamente para ${defaultModel.displayName} (padrão do ${newProvider})`
        })
        
        return
      }
    }
    
    setTempModelSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveModelSettings = () => {
    // Atualizar as configurações do modelo
    updateModelSettings(tempModelSettings)
    
    // Fechar o modal
    setModelSettingsPanelOpen(false)
    
    // Mostrar feedback visual temporário
    setModelSettingsSaved(true)
    setTimeout(() => setModelSettingsSaved(false), 2000)
    
    // Mostrar toast de sucesso
    addToast({
      type: 'success',
      title: 'Configurações salvas',
      description: 'As configurações do modelo foram salvas permanentemente.'
    })
    
    console.log('Model settings saved:', tempModelSettings)
  }

  const handleTestConnection = async () => {
    try {
      const result = await aiService.testConnection(tempModelSettings)
      if (result.success) {
        alert('✅ Conexão testada com sucesso!')
      } else {
        alert(`❌ Erro na conexão: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Erro ao testar conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const handleOpenModelSettings = () => {
    setTempModelSettings(modelSettings)
    setModelSettingsPanelOpen(true)
  }

  const handleOpenTemplalize = () => {
    setTemplalizeModalOpen(true)
    handleTemplalizePrompt()
  }

  const handleTemplalizePrompt = async () => {
    console.log('Iniciando templalização...')
    
    if (!selectedPrompt) {
      console.log('Nenhum prompt selecionado')
      addToast({
        type: 'error',
        title: t('promptEditor.templalizeErrorTitle'),
        description: 'Nenhum prompt selecionado'
      })
      return
    }
    
    // Verificar se o aiService está disponível
    if (!aiService) {
      console.log('aiService não disponível')
      addToast({
        type: 'error',
        title: t('promptEditor.templalizeErrorTitle'),
        description: 'Serviço de IA não disponível'
      })
      return
    }
    
    setIsTemplalizing(true)
    console.log('Estado de loading ativado')
    
    try {
      console.log('Preparando prompts para IA...')
      
      const systemPrompt = `Você é um especialista em análise e estruturação de prompts para IA. 
      
      Sua tarefa é analisar o prompt fornecido e criar uma versão templarizada em formato XML, separando claramente os diferentes componentes do prompt.
      
      O formato deve ser como o exemplo abaixo, não é obrigatorio usar todos os elementos, seu trabalho é analisar o input e usar os elementos que forem necessários para a tarefa.
      
      <system_prompt> 
      // Finalidade: Define a persona ou o papel global que o modelo deve assumir durante toda a interação
      </system_prompt>

      <context>
      // Finalidade: Fornece informações de fundo relevantes para a tarefa, incluindo detalhes sobre o projeto, a empresa, o produto/serviço e, crucialmente, o público-alvo
      </context>

      <task>
      // Contêm a instrução principal ou o comando específico que você deseja que o modelo execute
      <sub_tasks>
      // Lista de subtarefas que devem ser executadas para completar a tarefa principal
      </sub_tasks>
      </task>

      <rules> 
      // Estabelece diretrizes, restrições ou limitações explícitas que a saída deve seguir
      </rules>

      <avoid> 
      // Indica o que deve ser evitado ou evitado
      </avoid>

      <examples> 
      // Fornece exemplos de entrada-saída desejados, ajudando o modelo a entender o formato, o tom, o estilo ou o tipo de resposta que você espera
      </examples>

      <reflection_instruction>
      // Fornece instruções para o modelo refletir sobre a resposta gerada, como verificar se a resposta atende aos requisitos, se há inconsistências, se a resposta é coesa e se atende ao contexto
      </reflection_instruction>

      <output_format>
      // Define o formato de saída desejado, como o tipo de arquivo, a estrutura ou a linguagem de programação
      </output_format>

      IMPORTANTE: Pondere a necessidade de usar os elementos do prompt, se não for necessário, não use.
      IMPORTANTE: Não invente informações, se não souber a resposta, diga que não sabe.
      IMPORTANTE: Não adicione nada além do prompt templarizado.
      IMPORTANTE: NÃo adicone comentários explicativos, apenas o prompt templarizado.
      IMPORTANTE: NÃO adicione marcações de formatação de markdown como por exemplo \`\`\`xml para empacotar o retorno, apenas o prompt templarizado
      
      Analise o prompt fornecido e crie uma versão bem estruturada e organizada.`
      
      const userPrompt = `Analise e templarize o seguinte prompt:
      
      System Prompt: ${selectedPrompt.systemPrompt || 'Não fornecido'}
      
      User Prompt: ${selectedPrompt.userPrompt || 'Não fornecido'}
      
      Crie uma versão templarizada bem estruturada em formato Texto puro.`
      
      console.log('Enviando requisição para IA...')
      console.log('Model Settings:', modelSettings)
      
      // Adicionar timeout para evitar travamento
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Requisição demorou muito')), 30000)
      })
      
      const aiPromise = aiService.generateResponse(
        userPrompt,
        systemPrompt,
        templalizeSettings,
        {}
      )
      
      const response = await Promise.race([aiPromise, timeoutPromise])
      
      console.log('Resposta da IA recebida:', response)
      
      const aiResponse = response as any
      if (aiResponse && aiResponse.error) {
        console.log('Erro na resposta da IA:', aiResponse.error)
        addToast({
          type: 'error',
          title: t('promptEditor.templalizeErrorTitle'),
          description: String(aiResponse.error)
        })
      } else if (aiResponse && aiResponse.content) {
        console.log('Definindo prompt templarizado:', aiResponse.content)
        setTemplalizedPrompt(String(aiResponse.content))
      } else {
        throw new Error('Resposta inválida da IA')
      }
      
    } catch (error) {
      console.error('Erro na templalização:', error)
      addToast({
        type: 'error',
        title: t('promptEditor.templalizeErrorTitle'),
        description: error instanceof Error ? error.message : 'Erro desconhecido na templalização'
      })
    } finally {
      console.log('Finalizando templalização...')
      setIsTemplalizing(false)
    }
  }

  const handleCopyTemplalizedPrompt = async () => {
    try {
      await navigator.clipboard.writeText(templalizedPrompt)
      addToast({
        type: 'success',
        title: t('promptEditor.templalizeCopiedTitle'),
        description: t('promptEditor.templalizeCopiedDescription')
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: t('promptEditor.copyErrorTitle'),
        description: t('promptEditor.copyErrorDescription')
      })
    }
  }

  // Função para executar o prompt templalizado
  const handleRunTemplalizedPrompt = async () => {
    if (!templalizedPrompt.trim()) {
      addToast({
        type: 'error',
        title: 'Prompt não disponível',
        description: 'Nenhum prompt templalizado para executar'
      })
      return
    }

    // Extrair system prompt e user prompt do texto templalizado
    const templalizedText = templalizedPrompt
    
    // Procurar por tags XML no texto templalizado
    const systemMatch = templalizedText.match(/<system_prompt>([\s\S]*?)<\/system_prompt>/i)
    const contextMatch = templalizedText.match(/<context>([\s\S]*?)<\/context>/i)
    const taskMatch = templalizedText.match(/<task>([\s\S]*?)<\/task>/i)
    const rulesMatch = templalizedText.match(/<rules>([\s\S]*?)<\/rules>/i)
    const avoidMatch = templalizedText.match(/<avoid>([\s\S]*?)<\/avoid>/i)
    const examplesMatch = templalizedText.match(/<examples>([\s\S]*?)<\/examples>/i)
    const reflectionMatch = templalizedText.match(/<reflection_instruction>([\s\S]*?)<\/reflection_instruction>/i)
    const outputFormatMatch = templalizedText.match(/<output_format>([\s\S]*?)<\/output_format>/i)

    // Construir system prompt combinando todas as seções relevantes
    let systemPrompt = ''
    if (systemMatch) systemPrompt += systemMatch[1].trim() + '\n\n'
    if (contextMatch) systemPrompt += 'Contexto: ' + contextMatch[1].trim() + '\n\n'
    if (rulesMatch) systemPrompt += 'Regras: ' + rulesMatch[1].trim() + '\n\n'
    if (avoidMatch) systemPrompt += 'Evitar: ' + avoidMatch[1].trim() + '\n\n'
    if (examplesMatch) systemPrompt += 'Exemplos: ' + examplesMatch[1].trim() + '\n\n'
    if (reflectionMatch) systemPrompt += 'Instruções de Reflexão: ' + reflectionMatch[1].trim() + '\n\n'
    if (outputFormatMatch) systemPrompt += 'Formato de Saída: ' + outputFormatMatch[1].trim() + '\n\n'

    // Construir user prompt com a tarefa
    let userPrompt = ''
    if (taskMatch) {
      userPrompt = taskMatch[1].trim()
    } else {
      // Se não encontrar tag task, usar o texto completo como user prompt
      userPrompt = templalizedText
    }

    // Limpar as tags XML do user prompt se ainda houver
    userPrompt = userPrompt.replace(/<[^>]*>/g, '').trim()

    // Validar se temos conteúdo para executar
    if (!userPrompt.trim()) {
      addToast({
        type: 'error',
        title: 'Prompt inválido',
        description: 'Não foi possível extrair uma tarefa válida do prompt templalizado'
      })
      return
    }

    // Fechar o modal de templalize
    setTemplalizeModalOpen(false)

    // Atualizar o prompt selecionado com o conteúdo templalizado
    if (selectedPrompt) {
      setSelectedPrompt({
        ...selectedPrompt,
        systemPrompt: systemPrompt,
        userPrompt: userPrompt,
        isModified: true
      })

      // Atualizar na lista de prompts
      updatePrompts(prompts.map(prompt => 
        prompt.id === selectedPrompt.id 
          ? { ...prompt, systemPrompt, userPrompt, isModified: true }
          : prompt
      ))

      addToast({
        type: 'success',
        title: 'Prompt atualizado',
        description: 'O prompt foi atualizado com a versão templalizada. Clique em "Run" para executar.'
      })
    }
  }

  // Função para extrair variáveis do texto no formato {{nome}}
  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g
    const variables: string[] = []
    let match
    
    while ((match = regex.exec(text)) !== null) {
      const variableName = match[1].trim()
      if (variableName && !variables.includes(variableName)) {
        variables.push(variableName)
      }
    }
    
    return variables
  }

  // Função utilitária para gerar descrição
  const generateDescription = (userPrompt: string, systemPrompt: string): string => {
    const contentToUse = userPrompt.trim() || systemPrompt.trim()
    if (!contentToUse) return 'Sem conteúdo'
    const truncated = contentToUse.substring(0, 50)
    return truncated.length === 50 ? `${truncated}...` : truncated
  }

  // Função para atualizar variáveis baseado no conteúdo dos prompts
  const updateVariablesFromContent = (systemPrompt: string, userPrompt: string) => {
    const systemVariables = extractVariables(systemPrompt)
    const userVariables = extractVariables(userPrompt)
    const allVariables = Array.from(new Set([...systemVariables, ...userVariables]))
    
    setSelectedPrompt(prev => prev ? {
      ...prev,
      variables: allVariables
    } : null)
  }

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSystemPrompt = e.target.value
    setSelectedPrompt(prev => prev ? {
      ...prev,
      systemPrompt: newSystemPrompt,
      isModified: true
    } : null)
    
    // Atualizar na lista de prompts também
    updatePrompts(prompts.map(prompt => 
      prompt.id === selectedPrompt?.id ? {
        ...prompt,
        systemPrompt: newSystemPrompt,
        isModified: true
      } : prompt
    ))
    
    // Abrir accordion automaticamente se começar a digitar
    if (!systemPromptOpen && newSystemPrompt.trim()) {
      setSystemPromptOpen(true)
    }
    
    // Atualizar variáveis automaticamente
    updateVariablesFromContent(newSystemPrompt, selectedPrompt?.userPrompt || '')
    
    // Atualizar descrição automaticamente se não houver User Prompt
    if (!selectedPrompt?.userPrompt.trim()) {
      setSelectedPrompt(prev => prev ? {
        ...prev,
        description: generateDescription(selectedPrompt.userPrompt, newSystemPrompt)
      } : null)
    }
    
    // Atualizar contagem de tokens
    setTimeout(updateTokenCount, 0)
  }

  const handleUserPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUserPrompt = e.target.value
    setSelectedPrompt(prev => prev ? {
      ...prev,
      userPrompt: newUserPrompt,
      isModified: true
    } : null)
    
    // Atualizar na lista de prompts também
    updatePrompts(prompts.map(prompt => 
      prompt.id === selectedPrompt?.id ? {
        ...prompt,
        userPrompt: newUserPrompt,
        isModified: true
      } : prompt
    ))
    
    // Atualizar variáveis automaticamente
    updateVariablesFromContent(selectedPrompt?.systemPrompt || '', newUserPrompt)
    
    // Atualizar descrição automaticamente (priorizar User Prompt)
    setSelectedPrompt(prev => prev ? {
      ...prev,
      description: generateDescription(newUserPrompt, selectedPrompt?.systemPrompt || '')
    } : null)
    
    // Atualizar contagem de tokens
    setTimeout(updateTokenCount, 0)
  }



  const handleTestPrompt = async () => {
    if (!selectedPrompt) return
    
    // Validação: Verificar se há um provider selecionado
    if (!modelSettings.provider || modelSettings.provider.trim() === '') {
      addToast({
        type: 'error',
        title: 'Provider não selecionado',
        description: 'Por favor, configure um provider nas configurações antes de executar o prompt.'
      })
      return
    }
    
    // Validação: Verificar se há um modelo selecionado
    if (!modelSettings.model || modelSettings.model.trim() === '') {
      addToast({
        type: 'error',
        title: 'Modelo não selecionado',
        description: 'Por favor, configure um modelo nas configurações antes de executar o prompt.'
      })
      return
    }
    
    // Validação: Verificar se há API key configurada
    const currentApiKey = modelSettings.apiKeys[modelSettings.provider] || ''
    if (!currentApiKey || currentApiKey.trim() === '') {
      addToast({
        type: 'error',
        title: 'API Key não configurada',
        description: `Por favor, configure sua API Key para o provider '${modelSettings.provider}' nas configurações do modelo antes de executar o prompt.`
      })
      return
    }
    
    // Validação: Verificar se há conteúdo no prompt
    if (!selectedPrompt.userPrompt.trim() && !selectedPrompt.systemPrompt.trim()) {
      addToast({
        type: 'error',
        title: 'Prompt vazio',
        description: 'Adicione conteúdo ao User Prompt ou System Prompt antes de executar.'
      })
      return
    }
    
    setIsLoading(true)
    
    // Selecionar uma frase aleatória para começar
    setCurrentLoadingPhrase(Math.floor(Math.random() * loadingPhrases.length))

    try {
      const result = await aiService.generateResponse(
        selectedPrompt.userPrompt,
        selectedPrompt.systemPrompt,
        modelSettings,
        testVariables
      )
      
      if (result.error) {
        setResponses(prev => ({ ...prev, [selectedPrompt.id]: `Erro: ${result.error}` }))
        addToast({
          type: 'error',
          title: 'Erro na execução',
          description: result.error
        })
      } else {
        let usageInfo = ''
        if (result.usage) {
          usageInfo = `\n\n---\nUso: ${result.usage.promptTokens} tokens de prompt, ${result.usage.completionTokens} tokens de resposta (${result.usage.totalTokens} total)`
        }
        
        // Adicionar informações das configurações usadas
        const settingsInfo = `\n\n---\nConfigurações: [TEMP]${modelSettings.temperature} | [MAX]${modelSettings.maxTokens} | [TOP_P]${modelSettings.topP} | [FREQ]${modelSettings.frequencyPenalty} | [PRES]${modelSettings.presencePenalty}${modelSettings.topK ? ` | [TOP_K]${modelSettings.topK}` : ''}${modelSettings.stopSequences && modelSettings.stopSequences.length > 0 ? ` | [STOP]${modelSettings.stopSequences.join(', ')}` : ''}${modelSettings.seed ? ` | [SEED]${modelSettings.seed}` : ''}`
        
        setResponses(prev => ({ ...prev, [selectedPrompt.id]: { text: result.content + usageInfo + settingsInfo, raw: result.raw } }))
        
        // addToast({
        //   type: 'success',
        //   title: 'Prompt executado com sucesso!',
        //   description: 'A resposta foi gerada e exibida na área de resposta.'
        // })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setResponses(prev => ({ ...prev, [selectedPrompt.id]: `Erro na requisição: ${errorMessage}` }))
      
      addToast({
        type: 'error',
        title: 'Erro na requisição',
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const currentResponseObj = selectedPrompt ? responses[selectedPrompt.id] || { text: '', raw: '' } : { text: '', raw: '' }
  const currentResponse = typeof currentResponseObj === 'string' ? currentResponseObj : currentResponseObj.text
  // Função utilitária para separar texto e metadados
  function splitResponseAndMeta(response: string) {
    if (!response) return { text: '', meta: '', settings: '' }
    const parts = response.split('\n---\n')
    const text = parts[0]?.trim() || ''
    const meta = parts[1]?.trim() || ''
    const settings = parts[2]?.trim() || ''
    return { text, meta, settings }
  }
  const { text: responseText, meta: responseMeta, settings: responseSettings } = splitResponseAndMeta(currentResponse)

  // Função utilitária para extrair tokens dos metadados
  function parseUsageMeta(meta: string) {
    // Exemplo: Uso: 12 tokens de prompt, 34 tokens de resposta (46 total)
    const match = meta.match(/(\d+) tokens de prompt, (\d+) tokens de resposta \((\d+) total\)/)
    if (!match) return null
    return {
      prompt: Number(match[1]),
      completion: Number(match[2]),
      total: Number(match[3])
    }
  }
  const usage = responseMeta ? parseUsageMeta(responseMeta) : null

  return (
    <Container>
      <Header>
        <Title>
          <input
            type="text"
            value={selectedPrompt.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newName = e.target.value
              setSelectedPrompt(prev => prev ? {
                ...prev,
                name: newName,
                isModified: true
              } : null)
              
                  // Atualizar na lista de prompts também
    updatePrompts(prompts.map(prompt => 
      prompt.id === selectedPrompt?.id ? {
        ...prompt,
        name: newName,
        isModified: true
      } : prompt
    ))
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E1E1E6',
              fontSize: '18px',
              fontWeight: 600,
              outline: 'none',
              width: '200px'
            }}
          />
          {saveStatus === 'saved' && (
            <span style={{ 
              fontSize: '12px', 
              color: '#67e480', 
              marginLeft: '8px',
              opacity: 0.8 
            }}>
              {t('promptEditor.saved')}
            </span>
          )}
        </Title>
        <RunButton onClick={handleTestPrompt} disabled={isLoading}>
          <FiPlay size={16} />
          <span>{t('promptEditor.run')}</span>
          <span className="shortcut">⌘↵</span>
        </RunButton>
      </Header>
      
      <Content>
        <EditorSection>
          <ConfigSection>
            <VariablesButton 
              onClick={() => setVariablesPanelOpen(!variablesPanelOpen)}
              isActive={variablesPanelOpen}
            >
              <FiCode size={16} />
              <span>{t('promptEditor.variables')}</span>
              {selectedPrompt.variables.length > 0 && (
                <VariablesBadge>
                  {selectedPrompt.variables.length}
                </VariablesBadge>
              )}
            </VariablesButton>
            
            <ModelSettingsButton 
              onClick={handleOpenModelSettings}
              isActive={modelSettingsPanelOpen}
            >
              <FiSliders  size={16} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span>{t('promptEditor.modelSettings')}</span>
                <span style={{ 
                  fontSize: '10px', 
                  color: modelSettingsSaved ? '#67e480' : '#E1E1E6', 
                  opacity: modelSettingsSaved ? 0.8 : 0.6,
                  fontWeight: 'normal',
                  lineHeight: '1',
                  transition: 'all 0.3s ease'
                }}>
                  {getCurrentModelName(modelSettings)}
                  {modelSettingsSaved && ' ✓'}
                </span>
              </div>
            </ModelSettingsButton>
            
            <TemplalizeButton 
              onClick={handleOpenTemplalize}
              isActive={templalizeModalOpen}
            >
              <FiZap size={16} />
              <span>{t('promptEditor.templalize')}</span>
            </TemplalizeButton>
          </ConfigSection>
          
          <AccordionSection>
            <AccordionHeader onClick={() => setSystemPromptOpen(!systemPromptOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {systemPromptOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                <Label style={{ margin: 0, cursor: 'pointer' }}>{t('promptEditor.systemPromptLabel')}</Label>
                {selectedPrompt.systemPrompt.trim() && (
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#67e480', 
                    backgroundColor: 'rgba(103, 228, 128, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    ✓
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', color: '#E1E1E6', opacity: 0.7 }}>
                {t('promptEditor.optional')}
              </span>
            </AccordionHeader>
            
            {systemPromptOpen && (
              <AccordionContent>
                <TextArea
                  value={selectedPrompt.systemPrompt}
                  onChange={handleSystemPromptChange}
                  placeholder={t('promptEditor.systemPromptPlaceholder')}
                  spellCheck={false}
                />
              </AccordionContent>
            )}
          </AccordionSection>
          
          {variablesPanelOpen && (
            <ModalOverlay onClick={() => setVariablesPanelOpen(false)}>
              <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <ModalHeader>
                  <h3 style={{ margin: 0, color: '#E1E1E6', fontSize: '18px' }}>
                    Variables
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {selectedPrompt.variables.length > 0 && (
                      <button
                        onClick={handleClearAllVariables}
                        style={{
                          background: 'none',
                          border: '1px solid #E96379',
                          color: '#E96379',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#E96379'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none'
                          e.currentTarget.style.color = '#E96379'
                        }}
                      >
                        Clear All
                      </button>
                    )}
                    <CloseButton onClick={() => setVariablesPanelOpen(false)}>
                      ×
                    </CloseButton>
                  </div>
                </ModalHeader>
                
                <div style={{ padding: '20px' }}>
                  {selectedPrompt.variables.length > 0 ? (
                    <div>
                      {selectedPrompt.variables.map((variable) => (
                        <div key={variable} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <Label style={{ fontSize: '14px', margin: 0 }}>{variable}:</Label>
                            <RemoveVariableButton onClick={() => handleRemoveVariable(variable)}>
                              <FiX size={14} />
                            </RemoveVariableButton>
                          </div>
                          <VariableInput
                            value={testVariables[variable] || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariableChange(variable, e.target.value)}
                            placeholder={`Value for ${variable}`}
                          />
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                        <button
                          onClick={() => {
                            setSelectedPrompt(prev => prev ? { ...prev, env: testVariables } : null)
                            updatePrompts(prompts.map(prompt =>
                              prompt.id === selectedPrompt.id ? { ...selectedPrompt, env: testVariables } : prompt
                            ))
                            setVariablesPanelOpen(false)
                          }}
                          style={{
                            background: '#8257e6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '8px 20px',
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
                          }}
                        >
                          Salvar Variáveis
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <FiCode size={32} style={{ color: '#E1E1E6', opacity: 0.5, marginBottom: '12px' }} />
                      <div style={{ color: '#E1E1E6', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                        No variables
                      </div>
                      <div style={{ color: '#E1E1E6', opacity: 0.7, fontSize: '14px', lineHeight: '1.4' }}>
                        Use variables to test the prompt across different scenarios. You can create a variable inline like this: {'{{variable_name}}'}
                      </div>
                    </div>
                  )}
                </div>
              </ModalContent>
            </ModalOverlay>
          )}
          
          {modelSettingsPanelOpen && (
            <ModalOverlay onClick={() => setModelSettingsPanelOpen(false)}>
              <ModalContent 
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                style={{ maxWidth: '500px', maxHeight: '80vh', overflow: 'hidden' }}
              >
                <ModalHeader>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Model Settings</h2>
                </ModalHeader>
                <div style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto', padding: '0 20px 20px 20px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <Label style={{ fontSize: '14px', marginBottom: '8px' }}>Provider:</Label>
                    <Select
                      value={tempModelSettings.provider}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleModelSettingsChange('provider', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #4A5568',
                        borderRadius: '4px',
                        background: '#2D3748',
                        color: '#E2E8F0',
                        fontSize: '14px'
                      }}
                    >
                      {getAvailableProvidersList().map(provider => (
                        <option key={provider.value} value={provider.value}>
                          {provider.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <Label style={{ fontSize: '14px', marginBottom: '8px' }}>Model:</Label>
                    <Select
                      value={tempModelSettings.model}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleModelSettingsChange('model', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #4A5568',
                        borderRadius: '4px',
                        background: '#2D3748',
                        color: '#E2E8F0',
                        fontSize: '14px'
                      }}
                    >
                      {getAvailableModelsForProvider(tempModelSettings.provider).map(model => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <Label style={{ fontSize: '14px', marginBottom: '8px' }}>API Key ({tempModelSettings.provider}):</Label>
                    <ApiKeyInput
                      type="password"
                      value={tempModelSettings.apiKeys[tempModelSettings.provider] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newApiKeys = { ...tempModelSettings.apiKeys }
                        newApiKeys[tempModelSettings.provider] = e.target.value
                        setTempModelSettings(prev => ({
                          ...prev,
                          apiKeys: newApiKeys
                        }))
                      }}
                      placeholder="Enter your API key"
                    />
                  </div>
                  
                  <RangeContainer>
                    <RangeLabel>
                      <Label style={{ fontSize: '14px', margin: 0 }}>Temperature:</Label>
                      <RangeValue>{tempModelSettings.temperature}</RangeValue>
                    </RangeLabel>
                    <RangeInput
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={tempModelSettings.temperature}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleModelSettingsChange('temperature', parseFloat(e.target.value))}
                    />
                  </RangeContainer>
                  
                  <RangeContainer>
                    <RangeLabel>
                      <Label style={{ fontSize: '14px', margin: 0 }}>Max Tokens:</Label>
                      <RangeValue>{tempModelSettings.maxTokens}</RangeValue>
                    </RangeLabel>
                    <RangeInput
                      type="range"
                      min="1"
                      max="8192"
                      step="1"
                      value={tempModelSettings.maxTokens}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleModelSettingsChange('maxTokens', parseInt(e.target.value))}
                    />
                  </RangeContainer>
                  
                  <AccordionSection style={{ marginTop: '20px' }}>
                    <AccordionHeader 
                      onClick={(e) => {
                        setAdvancedSettingsOpen(!advancedSettingsOpen)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Label style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Advanced Settings</Label>
                        <span style={{ 
                          transform: advancedSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          fontSize: '12px'
                        }}>
                          ▼
                        </span>
                      </div>
                    </AccordionHeader>
                    
                    {advancedSettingsOpen && (
                      <div style={{ padding: '20px', borderTop: '1px solid #4A5568', background: '#1A202C', borderRadius: '4px', marginTop: '8px' }}>
                        <RangeContainer>
                          <RangeLabel>
                            <Label style={{ fontSize: '14px', margin: 0 }}>Top P:</Label>
                            <RangeValue>{tempModelSettings.topP}</RangeValue>
                          </RangeLabel>
                          <RangeInput
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={tempModelSettings.topP}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleModelSettingsChange('topP', parseFloat(e.target.value))}
                          />
                        </RangeContainer>
                        
                        <RangeContainer>
                          <RangeLabel>
                            <Label style={{ fontSize: '14px', margin: 0 }}>Frequency Penalty:</Label>
                            <RangeValue>{tempModelSettings.frequencyPenalty}</RangeValue>
                          </RangeLabel>
                          <RangeInput
                            type="range"
                            min="-2"
                            max="2"
                            step="0.1"
                            value={tempModelSettings.frequencyPenalty}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleModelSettingsChange('frequencyPenalty', parseFloat(e.target.value))}
                          />
                        </RangeContainer>
                        
                        <RangeContainer>
                          <RangeLabel>
                            <Label style={{ fontSize: '14px', margin: 0 }}>Presence Penalty:</Label>
                            <RangeValue>{tempModelSettings.presencePenalty}</RangeValue>
                          </RangeLabel>
                          <RangeInput
                            type="range"
                            min="-2"
                            max="2"
                            step="0.1"
                            value={tempModelSettings.presencePenalty}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleModelSettingsChange('presencePenalty', parseFloat(e.target.value))}
                          />
                        </RangeContainer>
                        
                        <RangeContainer>
                          <RangeLabel>
                            <Label style={{ fontSize: '14px', margin: 0 }}>Top K:</Label>
                            <RangeValue>{tempModelSettings.topK || 1}</RangeValue>
                          </RangeLabel>
                          <RangeInput
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={tempModelSettings.topK || 1}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleModelSettingsChange('topK', parseInt(e.target.value))}
                          />
                        </RangeContainer>
                        
                        <div style={{ marginBottom: '16px' }}>
                          <Label style={{ fontSize: '14px', marginBottom: '8px' }}>Stop Sequences (separadas por vírgula):</Label>
                          <input
                            type="text"
                            value={tempModelSettings.stopSequences?.join(', ') || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const sequences = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                              handleModelSettingsChange('stopSequences', sequences)
                            }}
                            placeholder="Ex: END, STOP, ###"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #4A5568',
                              borderRadius: '4px',
                              background: '#2D3748',
                              color: '#E2E8F0',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                          <Label style={{ fontSize: '14px', marginBottom: '8px' }}>Seed (opcional):</Label>
                          <input
                            type="number"
                            value={tempModelSettings.seed || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined
                              handleModelSettingsChange('seed', value)
                            }}
                            placeholder="Número para reprodutibilidade"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #4A5568',
                              borderRadius: '4px',
                              background: '#2D3748',
                              color: '#E2E8F0',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </AccordionSection>
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #4A5568' }}>
                    <button
                      onClick={handleTestConnection}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#2D3748',
                        color: 'white',
                        border: '1px solid #4A5568',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#4A5568'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#2D3748'
                      }}
                    >
                      Test Connection
                    </button>
                    <SaveButton onClick={handleSaveModelSettings}>
                      Save Settings
                    </SaveButton>
                  </div>
                </div>
              </ModalContent>
            </ModalOverlay>
          )}
          
          <AccordionSection>
            <AccordionHeader style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Label style={{ margin: 0 }}>User Prompt</Label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  title="Expandir para tela cheia"
                  onClick={() => {
                    setModalPromptValue(selectedPrompt?.userPrompt || '')
                    setPromptModalOpen(true)
                  }}
                  onMouseOver={e => {
                    const icon = e.currentTarget.firstChild as HTMLElement | null
                    if (icon && 'style' in icon) {
                      (icon as HTMLElement).style.color = '#8257e6'
                    }
                  }}
                  onMouseOut={e => {
                    const icon = e.currentTarget.firstChild as HTMLElement | null
                    if (icon && 'style' in icon) {
                      (icon as HTMLElement).style.color = '#E1E1E6'
                    }
                  }}
                >
                  <FiMaximize2 size={18} style={{ color: '#E1E1E6', transition: 'color 0.2s' }} />
                </button>
              </div>
            </AccordionHeader>
            
            <AccordionContent>
              <TextArea
                value={selectedPrompt.userPrompt}
                onChange={handleUserPromptChange}
                placeholder="Enter instructions..."
                spellCheck={false}
              />
            </AccordionContent>
          </AccordionSection>

          {/* Modal de edição expandida do prompt */}
          {isPromptModalOpen && (
            <Modal visible={isPromptModalOpen} onRequestClose={() => setPromptModalOpen(false)}>
              <ModalContent style={{ width: '90vw', maxWidth: 900, height: '90vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
                <ModalHeader>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>Editar Prompt</span>
                  <CloseButton onClick={() => setPromptModalOpen(false)} title="Fechar">
                    <FiX size={20} />
                  </CloseButton>
                </ModalHeader>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
                  <TextArea
                    style={{ flex: 1, minHeight: 0 }}
                    value={modalPromptValue}
                    onChange={e => setModalPromptValue(e.target.value)}
                    autoFocus
                    spellCheck={false}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
                    <button
                      type="button"
                      style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#444', color: '#fff', cursor: 'pointer' }}
                      onClick={() => setPromptModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#8257e6', color: '#fff', cursor: 'pointer', fontWeight: 500 }}
                      onClick={() => {
                        const currentSystemPrompt = prompts.find(p => p.id === selectedPrompt?.id)?.systemPrompt || ''
                        setSelectedPrompt(prev => prev ? {
                          ...prev,
                          userPrompt: modalPromptValue,
                          isModified: true,
                          description: generateDescription(modalPromptValue, currentSystemPrompt)
                        } : null)
                        updatePrompts(prompts.map(prompt => 
                          prompt.id === selectedPrompt?.id ? {
                            ...prompt,
                            userPrompt: modalPromptValue,
                            isModified: true,
                            description: generateDescription(modalPromptValue, currentSystemPrompt)
                          } : prompt
                        ))
                        updateVariablesFromContent(currentSystemPrompt, modalPromptValue)
                        setTimeout(updateTokenCount, 0)
                        setPromptModalOpen(false)
                      }}
                    >
                      {t('promptEditor.save')}
                    </button>
                  </div>
                </div>
              </ModalContent>
            </Modal>
          )}

          {/* Botão para adicionar mensagens - OCULTO TEMPORARIAMENTE */}
          {/* <AddMessageButton onClick={addMessagePair}>
            <FiPlus size={14} />
            Add message pair
          </AddMessageButton> */}

          {/* Lista de mensagens */}
          {messages.map((message) => (
            <MessagePair key={message.id}>
              <MessageHeader>
                <MessageType isAssistant={message.type === 'assistant'}>
                  {message.type === 'assistant' ? (
                    <>
                      <FiMessageCircle size={14} />
                      {t('promptEditor.assistant')}
                    </>
                  ) : (
                    <>
                      <FiUser size={14} />
                      {t('promptEditor.user')}
                    </>
                  )}
                </MessageType>
                <RemoveMessageButton onClick={() => removeMessage(message.id)}>
                  <FiTrash2 size={12} />
                </RemoveMessageButton>
              </MessageHeader>
              <MessageContent>
                <TextArea
                  value={message.content}
                  onChange={(e) => updateMessage(message.id, e.target.value)}
                  placeholder={message.type === 'assistant' ? t('promptEditor.assistantResponsePlaceholder') : t('promptEditor.userMessagePlaceholder')}
                  style={{ minHeight: '80px', margin: 0 }}
                />
              </MessageContent>
            </MessagePair>
          ))}

        </EditorSection>
        
        <TestSection>
          {/* Botão de alternância de visualização da resposta */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, justifyContent: 'flex-end', gap: 8 }}>
            <button
              onClick={() => setShowRawResponse(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: showRawResponse ? '#222' : 'transparent',
                color: showRawResponse ? '#fff' : '#8257e6',
                border: '1px solid #222',
                borderRadius: 4,
                padding: '4px 14px',
                fontWeight: 500,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              // O título pode ser adicionado ao locale se necessário
            >
              <FiCode size={18} />
              {t('promptEditor.response')}
            </button>
            <button
              onClick={async () => {
                let textToCopy = responseText
                if (showRawResponse) {
                  if (typeof currentResponseObj === 'object' && currentResponseObj !== null && 'raw' in currentResponseObj) {
                    textToCopy = typeof currentResponseObj.raw === 'string'
                      ? currentResponseObj.raw
                      : JSON.stringify(currentResponseObj.raw, null, 2)
                  } else {
                    textToCopy = typeof currentResponseObj === 'string' ? currentResponseObj : ''
                  }
                }
                await navigator.clipboard.writeText(textToCopy)
                addToast({
                  type: 'success',
                  title: t('promptEditor.copied'),
                  description: t('promptEditor.responseCopied')
                })
              }}
              disabled={!hasResponse()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: !hasResponse() ? '#444' : 'transparent',
                color: !hasResponse() ? '#666' : '#8257e6',
                border: '1px solid #222',
                borderRadius: 4,
                padding: '4px 14px',
                fontWeight: 500,
                fontSize: 15,
                cursor: !hasResponse() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              title={!hasResponse() ? "Nenhuma resposta para copiar" : "Copiar resposta"}
            >
              <FiCopy size={18} />
            </button>
          </div>
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 8,
              padding: 40,
              gap: 20
            }}>
              <Spinner />
              <div style={{
                textAlign: 'center',
                color: '#E1E1E6',
                fontSize: 16,
                fontWeight: 500,
                maxWidth: '400px',
                lineHeight: 1.5
              }}>
                {loadingPhrases[currentLoadingPhrase]}
              </div>
            </div>
          ) : currentResponse ? (
            <>
              {usage && (
                <div style={{
                  marginBottom: 12,
                  display: 'flex',
                  gap: 10,
                  fontSize: 13,
                  opacity: 0.8,
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#222', color: '#fff', borderRadius: 4, padding: '2px 10px', fontWeight: 500 }}
                  title="Tokens usados no prompt (entrada)">
                    <FiArrowUp style={{ marginRight: 6 }} /> {usage.prompt}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#222', color: '#fff', borderRadius: 4, padding: '2px 10px', fontWeight: 500 }}
                  title="Tokens usados na resposta (saída)">
                    <FiArrowDown style={{ marginRight: 6 }} /> {usage.completion}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#222', color: '#fff', borderRadius: 4, padding: '2px 10px', fontWeight: 500 }}
                  title="Total de tokens usados (entrada + saída)">
                    <FiCircle style={{ marginRight: 6 }} /> {usage.total}
                  </span>
                </div>
              )}
              {showRawResponse ? (
                <ResponseArea
                  value={(() => {
                    if (typeof currentResponseObj === 'object' && currentResponseObj !== null && 'raw' in currentResponseObj) {
                      return typeof currentResponseObj.raw === 'string'
                        ? currentResponseObj.raw
                        : JSON.stringify(currentResponseObj.raw, null, 2)
                    }
                    return typeof currentResponseObj === 'string' ? currentResponseObj : ''
                  })()}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: 13, background: '#18181a', color: '#e1e1e6' }}
                />
              ) : (
                <ResponseArea value={responseText} readOnly />
              )}
              {responseSettings && (
                <div style={{
                  marginTop: 12,
                  display: 'flex',
                  gap: 8,
                  fontSize: 12,
                  opacity: 0.7,
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                  title="Temperatura - Controla a aleatoriedade das respostas">
                    <FiThermometer size={12} style={{ marginRight: 4 }} /> {modelSettings.temperature}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                  title="Máximo de tokens - Limite de tokens para a resposta">
                    <FiBarChart size={12} style={{ marginRight: 4 }} /> {modelSettings.maxTokens}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                  title="Top P - Núcleo de probabilidade">
                    <FiTarget size={12} style={{ marginRight: 4 }} /> {modelSettings.topP}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                  title="Frequency Penalty - Penalidade de frequência">
                    <FiRotateCcw size={12} style={{ marginRight: 4 }} /> {modelSettings.frequencyPenalty}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                  title="Presence Penalty - Penalidade de presença">
                    <FiUserCheck size={12} style={{ marginRight: 4 }} /> {modelSettings.presencePenalty}
                  </span>
                  {modelSettings.topK && (
                    <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                    title="Top K - Variedade de tokens">
                      <FiSquare size={12} style={{ marginRight: 4 }} /> {modelSettings.topK}
                    </span>
                  )}
                  {modelSettings.stopSequences && modelSettings.stopSequences.length > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                    title="Stop Sequences - Sequências de parada">
                      <FiMinus size={12} style={{ marginRight: 4 }} /> {modelSettings.stopSequences.join(', ')}
                    </span>
                  )}
                  {modelSettings.seed && (
                    <span style={{ display: 'flex', alignItems: 'center', background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}
                    title="Seed - Semente para reprodutibilidade">
                      <FiCircle size={12} style={{ marginRight: 4 }} /> {modelSettings.seed}
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#444',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed #444',
              borderRadius: 8,
              margin: '16px 0',
              padding: 32
            }}>
              <FiMessageSquare size={72} style={{ opacity: 0.18, marginBottom: 24 }} />
              <div style={{ fontSize: 16, opacity: 0.7, marginBottom: 0 }}></div>
              <div style={{ fontSize: 15, opacity: 0.5, textAlign: 'center', marginTop: 8, width: '100%', maxWidth: 320 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ background: '#222', color: '#fff', borderRadius: 4, padding: '2px 14px', marginBottom: 4, fontSize: 16 }}>Cmd + Enter</span>
                    <span><b>Enviar Prompt</b></span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ background: '#222', color: '#fff', borderRadius: 4, padding: '2px 14px', marginBottom: 4, fontSize: 16 }}>Cmd + N</span>
                    <span><b>Novo Prompt</b></span>
                  </div>
                </div>
            </div>
          )}
        </TestSection>
      </Content>
      
      {/* Footer com Contador de Tokens */}
      <Footer>
        <TokenProgressBar>
          <TokenProgressBarTrack>
            <TokenProgressBarFill 
              percentage={(tokenCount / modelSettings.maxTokens) * 100}
              isWarning={tokenCount > modelSettings.maxTokens * 0.8}
            />
          </TokenProgressBarTrack>
        </TokenProgressBar>
        
        <TokenCounter 
          isWarning={tokenCount > modelSettings.maxTokens * 0.8}
          title={`Tokens estimados no prompt atual: ${tokenCount}\nLimite configurado: ${modelSettings.maxTokens.toLocaleString()}\n\nEsta é uma estimativa aproximada. O número real pode variar dependendo do modelo usado.`}
        >
          <span style={{ fontSize: '10px' }}></span>
          {formatTokenCount(tokenCount)} / {modelSettings.maxTokens.toLocaleString()}
        </TokenCounter>
      </Footer>

          {/* Modal de Templalize */}
          {templalizeModalOpen && (
            <Modal visible={templalizeModalOpen} onRequestClose={() => setTemplalizeModalOpen(false)}>
              <ModalContent style={{ width: '90vw', maxWidth: 800, height: '80vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
                <ModalHeader>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{t('promptEditor.templalizeModalTitle')}</span>
                  <CloseButton onClick={() => setTemplalizeModalOpen(false)} title={t('promptEditor.close')}>
                    <FiX size={20} />
                  </CloseButton>
                </ModalHeader>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, overflow: 'hidden' }}>
                  {isTemplalizing ? (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      gap: 16
                    }}>
                      <Spinner />
                      <span style={{ color: '#E1E1E6', fontSize: 16 }}>{t('promptEditor.templalizing')}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ 
                        flex: 1, 
                        background: '#1a1a1a', 
                        border: '1px solid #333', 
                        borderRadius: 8, 
                        padding: 16, 
                        overflow: 'auto',
                        fontFamily: 'monospace',
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: '#E1E1E6'
                      }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {templalizedPrompt || t('promptEditor.noTemplalizedPrompt')}
                        </pre>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
                        <button
                          onClick={handleCopyTemplalizedPrompt}
                          disabled={!templalizedPrompt}
                          style={{
                            padding: '8px 16px',
                            background: templalizedPrompt ? '#8257e6' : '#444',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: templalizedPrompt ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <FiCopy size={16} />
                          {t('promptEditor.copyTemplalized')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </ModalContent>
            </Modal>
          )}
    </Container>
  )
}

export default PromptEditor 