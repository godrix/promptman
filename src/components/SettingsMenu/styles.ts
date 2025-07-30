import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  display: inline-block;
`

export const SettingsButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  min-height: 36px;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &:active {
    transform: translateY(1px);
  }
`

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const ButtonText = styled.span`
  font-size: 12px;
  font-weight: 500;
`

interface DropdownIconProps {
  isOpen: boolean
}

export const DropdownIcon = styled.div<DropdownIconProps>`
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  opacity: 0.6;
`

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: ${({ theme }) => theme.backgrounds.dark};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 6px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 280px;
  z-index: 1000;
  overflow: hidden;
`

export const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid ${({ theme }) => theme.backgrounds.lightest};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
  }

  &:active {
    background: ${({ theme }) => theme.backgrounds.lightest};
  }
`

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.backgrounds.dark};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 8px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
  width: 90vw;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.backgrounds.lightest};
`

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.grey};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
    color: ${({ theme }) => theme.colors.white};
  }
`

export const SettingsList = styled.div`
  padding: 16px 0;
  overflow-y: auto;
  flex: 1;
`

export const SettingsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
  }

  &:active {
    background: ${({ theme }) => theme.backgrounds.lightest};
  }
`

export const SettingsItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;
`

export const SettingsItemContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const SettingsItemTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 4px;
`

export const SettingsItemDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey};
  line-height: 1.4;
`
