import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px;
  background: ${({ theme }) => theme.backgrounds.dark};
  overflow: hidden;
`

export const Button = styled.button`
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
  min-height: 40px;

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
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
    color: ${({ theme }) => theme.colors.white};
  }
`

export const TextArea = styled.textarea`
  flex: 1;
  background: ${({ theme }) => theme.backgrounds.dark};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  padding: 16px;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.backgrounds.lightest};
`

export const SaveButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 24px;
  background: ${({ theme, disabled }) =>
    disabled ? theme.backgrounds.lightest : theme.colors.purple};
  color: ${({ theme, disabled }) => (disabled ? theme.colors.grey : 'white')};
  border: 1px solid
    ${({ theme, disabled }) =>
      disabled ? theme.backgrounds.lightest : theme.colors.purple};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.purpleDark};
    border-color: ${({ theme }) => theme.colors.purpleDark};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`

export const ResetButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 24px;
  background: transparent;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.grey : theme.colors.white};
  border: 1px solid
    ${({ theme, disabled }) =>
      disabled ? theme.backgrounds.lightest : theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.backgrounds.lighter};
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`

export const ErrorMessage = styled.div`
  background: rgba(233, 99, 121, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.red};
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.red};
  font-size: 14px;
  line-height: 1.4;
`
