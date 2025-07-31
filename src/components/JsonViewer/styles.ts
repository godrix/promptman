import styled from 'styled-components'

export const JsonViewerWrapper = styled.div`
  background: #18181a;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #27272a;
  overflow: auto;
  max-height: 600px;
  height: 100%;

  .react-json-view {
    background: transparent !important;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.4;
  }

  /* Custom colors for JSON syntax highlighting */
  .react-json-view .string-value {
    color: #a8ff60 !important;
  }

  .react-json-view .number-value {
    color: #ff9d00 !important;
  }

  .react-json-view .boolean-value {
    color: #ff628c !important;
  }

  .react-json-view .null-value {
    color: #ff628c !important;
  }

  .react-json-view .object-key {
    color: #5ccfe6 !important;
  }

  .react-json-view .array-key {
    color: #5ccfe6 !important;
  }

  .react-json-view .object-key-val {
    color: #5ccfe6 !important;
  }

  .react-json-view .array-key-val {
    color: #5ccfe6 !important;
  }

  .react-json-view .brace {
    color: #e1e1e6 !important;
  }

  .react-json-view .bracket {
    color: #e1e1e6 !important;
  }

  .react-json-view .colon {
    color: #e1e1e6 !important;
  }

  .react-json-view .comma {
    color: #e1e1e6 !important;
  }

  .react-json-view .expand-icon {
    color: #8257e6 !important;
  }

  .react-json-view .collapse-icon {
    color: #8257e6 !important;
  }

  .react-json-view .copy-icon {
    color: #8257e6 !important;
  }

  .react-json-view .copy-icon:hover {
    color: #a855f7 !important;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #27272a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #52525b;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #71717a;
  }
`

export const JsonViewerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #27272a;

  h4 {
    margin: 0;
    color: #e1e1e6;
    font-size: 14px;
    font-weight: 600;
  }
`

export const JsonViewerControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const ControlButton = styled.button<{ active?: boolean }>`
  background: ${props => (props.active ? '#8257e6' : 'transparent')};
  color: ${props => (props.active ? '#fff' : '#8257e6')};
  border: 1px solid #8257e6;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.active ? '#a855f7' : '#8257e6')};
    color: #fff;
  }
`
