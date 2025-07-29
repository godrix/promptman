import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.backgrounds.dark};
`

export const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  margin: 0;
`

export const RunButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.purple};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.purpleDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .shortcut {
    font-size: 12px;
    opacity: 0.7;
    margin-left: 4px;
  }
`

export const Content = styled.div`
  flex: 1;
  display: flex;
  padding: 20px;
  gap: 20px;
`

export const EditorSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`



export const ConfigSection = styled.div`
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
`

export const VariablesButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.purple : theme.backgrounds.lighter};
  color: ${({ theme, isActive }) => 
    isActive ? 'white' : theme.colors.white};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.purple : theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: ${({ theme, isActive }) => 
      isActive ? theme.colors.purpleDark : theme.backgrounds.dark};
  }
`

export const ModelSettingsButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.purple : theme.backgrounds.lighter};
  color: ${({ theme, isActive }) => 
    isActive ? 'white' : theme.colors.white};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.purple : theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  position: relative;
  min-height: 40px;

  &:hover {
    background: ${({ theme, isActive }) => 
      isActive ? theme.colors.purpleDark : theme.backgrounds.dark};
  }
`

export const TemplalizeButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.purple : theme.backgrounds.lighter};
  color: ${({ theme, isActive }) => 
    isActive ? 'white' : theme.colors.white};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.purple : theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  position: relative;
  min-height: 40px;

  &:hover {
    background: ${({ theme, isActive }) => 
      isActive ? theme.colors.purpleDark : theme.backgrounds.dark};
  }
`

export const VariablesBadge = styled.span`
  background: ${({ theme }) => theme.colors.red};
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -6px;
  right: -6px;
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.backgrounds.dark};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`

export const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
  }
`

export const RemoveVariableButton = styled.button`
  background: ${({ theme }) => theme.colors.red};
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.red};
    opacity: 0.8;
    transform: scale(1.1);
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
  }

  option {
    background: ${({ theme }) => theme.backgrounds.dark};
    color: ${({ theme }) => theme.colors.white};
  }
`

export const RangeContainer = styled.div`
  margin-bottom: 16px;
`

export const RangeLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

export const RangeValue = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.grey};
  background: ${({ theme }) => theme.backgrounds.lighter};
  padding: 2px 6px;
  border-radius: 3px;
`

export const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.purple};
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.purple};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`

export const SaveButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.purple};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.purpleDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const ApiKeyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`

export const AccordionSection = styled.div`
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  overflow: hidden;
`

export const AccordionHeader = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.dark};
  }
`

export const AccordionContent = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.backgrounds.dark};
  border-top: 1px solid ${({ theme }) => theme.backgrounds.lightest};
`

export const TestSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  padding-left: 20px;
`

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
  display: block;
`

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  caret-color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }


`

export const VariableInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`

export const VariableList = styled.div`
  margin-bottom: 16px;
`

export const VariableItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.white};
`

export const RemoveButton = styled.button`
  background: ${({ theme }) => theme.colors.red};
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &:hover {
    opacity: 0.8;
  }
`

export const TestButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.purple};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.purpleDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const ResponseArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
  }
`

export const Footer = styled.div`
  padding: 12px 20px;
  border-top: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  background: ${({ theme }) => theme.backgrounds.darker};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.grey};
`

export const TokenProgressBar = styled.div`
  flex: 1;
  margin-right: 16px;
`

export const TokenProgressBarTrack = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 2px;
  overflow: hidden;
`

export const TokenProgressBarFill = styled.div<{ percentage: number; isWarning: boolean }>`
  width: ${({ percentage }) => Math.min(percentage, 100)}%;
  height: 100%;
  background-color: ${({ theme, isWarning }) => 
    isWarning ? theme.colors.red : theme.colors.green};
  transition: width 0.3s ease;
`

export const TokenCounter = styled.span<{ isWarning: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: ${({ theme, isWarning }) => 
    isWarning ? theme.colors.red : theme.colors.grey};
  cursor: help;
  font-size: 11px;
`

export const AddMessageButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.grey};
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  margin-top: 8px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`

export const MessagePair = styled.div`
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  overflow: hidden;
`

export const MessageHeader = styled.div`
  padding: 8px 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border-bottom: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MessageType = styled.span<{ isAssistant?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme, isAssistant }) => 
    isAssistant ? theme.colors.purple : theme.colors.white};
  display: flex;
  align-items: center;
  gap: 4px;
`

export const RemoveMessageButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.grey};
  font-size: 14px;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.red};
    background: ${({ theme }) => theme.backgrounds.dark};
  }
`

export const MessageContent = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.backgrounds.dark};
` 

export const Loading = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${rotate} 2s linear infinite;

  svg {
    margin: 0;
    height: 16px;
    width: 16px;
  }
`

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #8257e6;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
` 