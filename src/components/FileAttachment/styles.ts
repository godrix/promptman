import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  display: inline-block;
  z-index: 9998;
`

export const AttachmentButton = styled.button<{ hasFile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme, hasFile }) =>
    hasFile ? theme.colors.purple : theme.backgrounds.lighter};
  color: ${({ theme, hasFile }) => (hasFile ? 'white' : theme.colors.white)};
  border: 1px solid
    ${({ theme, hasFile }) =>
      hasFile ? theme.colors.purple : theme.backgrounds.lightest};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme, hasFile }) =>
      hasFile ? theme.colors.purpleDark : theme.backgrounds.light};
    border-color: ${({ theme, hasFile }) =>
      hasFile ? theme.colors.purpleDark : theme.colors.purple};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg:last-child {
    transform: rotate(180deg);
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.backgrounds.dark};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  margin-top: 4px;
  overflow: hidden;
  min-width: 120px;
`

export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.lighter};
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`

export const FileInput = styled.input`
  display: none;
`

export const FilePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.backgrounds.lighter};
  border: 1px solid ${({ theme }) => theme.backgrounds.lightest};
  border-radius: 4px;
  max-width: 300px;
`

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;

  div {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .filename {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .filesize {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.7;
  }
`

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.7;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.light};
    opacity: 1;
  }
`
