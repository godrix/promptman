import styled from 'styled-components'

export const Container = styled.div`
  width: 450px;
  padding: 20px;
  background: ${({ theme }) => theme.backgrounds.dark};
`

export const Button = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  min-height: 40px;
  width: 140px;
  opacity: 0.7;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
    opacity: 1;
  }
`

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: space-between;
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
  font-size: 20px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
    color: ${({ theme }) => theme.colors.white};
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme.backgrounds.dark};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.purple};
  }

  option {
    background: ${({ theme }) => theme.backgrounds.dark};
    color: ${({ theme }) => theme.colors.white};
  }
`

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
`

export const ApiKeyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme.backgrounds.dark};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`

export const SaveButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.purple};
  color: white;
  border: 1px solid ${({ theme }) => theme.colors.purple};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.purpleDark};
    border-color: ${({ theme }) => theme.colors.purpleDark};
  }
`

export const TestButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
    border-color: ${({ theme }) => theme.colors.purple};
  }
`
