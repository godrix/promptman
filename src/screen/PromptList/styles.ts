import styled from 'styled-components'

export const Container = styled.div`
  width: 300px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border-right: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  display: flex;
  flex-direction: column;
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

export const AddButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.purple};
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.purpleDark};
  }
`

export const PromptItem = styled.div<{ isSelected?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  background: ${({ theme, isSelected }) => 
    isSelected ? theme.backgrounds.lightest : 'transparent'};
  position: relative;

  &:hover {
    background: ${({ theme, isSelected }) => 
      isSelected ? theme.backgrounds.lightest : theme.backgrounds.dark};
  }
`

export const PromptContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

export const PromptInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const PromptActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${PromptItem}:hover & {
    opacity: 1;
  }
`

export const ActionButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.grey};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.dark};
    color: ${({ theme }) => theme.colors.white};
  }

  &.save:hover {
    color: ${({ theme }) => theme.colors.green || '#67e480'};
  }

  &.delete:hover {
    color: ${({ theme }) => theme.colors.red || '#ff6b6b'};
  }
`

export const PromptName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const UnsavedIndicator = styled.span`
  color: ${({ theme }) => theme.colors.red || '#ff6b6b'};
  display: flex;
  align-items: center;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

export const PromptDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.grey};
  line-height: 1.4;
` 