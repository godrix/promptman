import styled from 'styled-components'

export const ProviderButton = styled.button`
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
  min-height: 28px;
  width: 140px;
  opacity: 0.7;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
    opacity: 1;
  }
`

export const ProviderButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
`

export const ProviderButtonText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  span {
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #4a5568;
  border-radius: 4px;
  background: #2d3748;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.purple};
  }
`

export const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
`

export const ApiKeyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #4a5568;
  border-radius: 4px;
  background: #2d3748;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.purple};
  }

  &::placeholder {
    color: #a0aec0;
  }
`

export const SaveButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${({ theme }) => theme.colors.purple};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.purpleDark};
  }
`

export const TestButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #2d3748;
  color: white;
  border: 1px solid #4a5568;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4a5568;
  }
`
