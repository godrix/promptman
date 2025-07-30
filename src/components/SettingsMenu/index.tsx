import React, { useState, useRef, useEffect } from 'react'
import {
  FiSettings,
  FiChevronDown,
  FiCode,
  FiSliders,
  FiInfo,
  FiCpu
} from 'react-icons/fi'
import { useToast } from '../../context/toast'
import { t } from '../../strings'
import ProvidersConfigEditor from '../ProvidersConfigEditor'
import ModelSettings from '../ModelSettings'
import {
  Container,
  SettingsButton,
  ButtonContent,
  ButtonText,
  Dropdown,
  DropdownItem,
  DropdownIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  SettingsList,
  SettingsItem,
  SettingsItemIcon,
  SettingsItemContent,
  SettingsItemTitle,
  SettingsItemDescription
} from './styles'

interface SettingsMenuProps {
  className?: string
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ className }) => {
  const { addToast } = useToast()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isProvidersConfigOpen, setIsProvidersConfigOpen] = useState(false)
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSettingsClick = () => {
    setIsDropdownOpen(false)
    setIsSettingsModalOpen(true)
  }

  const handleProvidersConfigClick = () => {
    setIsSettingsModalOpen(false)
    setIsProvidersConfigOpen(true)
  }

  const handleCloseProvidersConfig = () => {
    setIsProvidersConfigOpen(false)
  }

  const handleModelSettingsClick = () => {
    setIsSettingsModalOpen(false)
    setIsModelSettingsOpen(true)
  }

  const handleCloseModelSettings = () => {
    setIsModelSettingsOpen(false)
  }

  const settingsItems = [
    {
      id: 'model',
      title: t('promptEditor.modelSettingsTitle'),
      description: t('promptEditor.modelSettingsDescription'),
      icon: <FiCpu size={20} />,
      onClick: handleModelSettingsClick
    },
    {
      id: 'providers',
      title: t('promptEditor.providersConfigTitle'),
      description: t('promptEditor.providersConfigDescriptionShort'),
      icon: <FiCode size={20} />,
      onClick: handleProvidersConfigClick
    }
    // {
    //   id: 'general',
    //   title: t('promptEditor.generalSettings'),
    //   description: t('promptEditor.generalSettingsDescription'),
    //   icon: <FiSliders size={20} />,
    //   onClick: () => {
    //     addToast({
    //       type: 'info',
    //       title: 'Em desenvolvimento',
    //       description: 'Configurações gerais serão implementadas em breve.'
    //     })
    //   }
    // },
    // {
    //   id: 'about',
    //   title: t('promptEditor.about'),
    //   description: t('promptEditor.aboutDescription'),
    //   icon: <FiInfo size={20} />,
    //   onClick: () => {
    //     addToast({
    //       type: 'info',
    //       title: 'PromptMan',
    //       description: 'Versão 1.0.0 - Ferramenta para gerenciamento de prompts de IA'
    //     })
    //   }
    // }
  ]

  return (
    <>
      <Container className={className} ref={dropdownRef}>
        <SettingsButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <ButtonContent>
            <FiSettings size={16} />
            {/* <ButtonText>{t('promptEditor.settings')}</ButtonText> */}
            <DropdownIcon isOpen={isDropdownOpen}>
              <FiChevronDown size={12} />
            </DropdownIcon>
          </ButtonContent>
        </SettingsButton>

        {isDropdownOpen && (
          <Dropdown>
            {settingsItems.map(item => (
              <DropdownItem key={item.id} onClick={item.onClick}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{ color: '#E1E1E6', opacity: 0.8 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#E1E1E6',
                        marginBottom: '2px'
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#E1E1E6',
                        opacity: 0.6
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </Container>

      {/* Modal de Configurações */}
      {isSettingsModalOpen && (
        <Modal>
          <ModalOverlay onClick={() => setIsSettingsModalOpen(false)}>
            <ModalContent
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>{t('promptEditor.settingsTitle')}</ModalTitle>
                <CloseButton onClick={() => setIsSettingsModalOpen(false)}>
                  ×
                </CloseButton>
              </ModalHeader>

              <SettingsList>
                {settingsItems.map(item => (
                  <SettingsItem key={item.id} onClick={item.onClick}>
                    <SettingsItemIcon>{item.icon}</SettingsItemIcon>
                    <SettingsItemContent>
                      <SettingsItemTitle>{item.title}</SettingsItemTitle>
                      <SettingsItemDescription>
                        {item.description}
                      </SettingsItemDescription>
                    </SettingsItemContent>
                  </SettingsItem>
                ))}
              </SettingsList>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      )}

      {/* Modal do Providers Config Editor */}
      {isProvidersConfigOpen && (
        <ProvidersConfigEditor
          isOpen={isProvidersConfigOpen}
          onClose={handleCloseProvidersConfig}
        />
      )}

      {/* Modal do Model Settings */}
      {isModelSettingsOpen && (
        <ModelSettings
          isOpen={isModelSettingsOpen}
          onClose={handleCloseModelSettings}
        />
      )}
    </>
  )
}

export default SettingsMenu
