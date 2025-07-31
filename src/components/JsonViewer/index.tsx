import React, { useState } from 'react'
import ReactJson from 'react-json-view'
import {
  FiCopy,
  FiEye,
  FiEyeOff,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi'
import {
  JsonViewerWrapper,
  JsonViewerHeader,
  JsonViewerControls,
  ControlButton
} from './styles'

interface JsonViewerProps {
  data: any
  theme?: 'dark' | 'light'
  collapsed?: boolean
  displayDataTypes?: boolean
  displayObjectSize?: boolean
  enableClipboard?: boolean
  style?: React.CSSProperties
  title?: string
  showControls?: boolean
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  theme = 'dark',
  collapsed = false,
  displayDataTypes = false,
  displayObjectSize = false,
  enableClipboard = true,
  style,
  title = 'JSON Response',
  showControls = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showDataTypes, setShowDataTypes] = useState(displayDataTypes)
  const [showObjectSize, setShowObjectSize] = useState(displayObjectSize)
  const [isExpanded, setIsExpanded] = useState(false)
  const getTheme = () => {
    if (theme === 'dark') {
      return {
        base00: '#18181a', // background
        base01: '#27272a', // lighter background
        base02: '#3f3f46', // selection background
        base03: '#52525b', // comments, invisibles, line highlighting
        base04: '#71717a', // dark foreground, used for status bars
        base05: '#a1a1aa', // default foreground
        base06: '#d4d4d8', // light foreground
        base07: '#fafafa', // light background
        base08: '#ef4444', // variables, XML tags, markup link text, markup lists, diff deleted
        base09: '#f97316', // integers, boolean, constants, XML attributes, markup link url
        base0A: '#eab308', // classes, markup bold, search text background
        base0B: '#22c55e', // strings, inherited class, markup code, diff inserted
        base0C: '#06b6d4', // support, regular expressions, escape characters, markup quotes
        base0D: '#3b82f6', // functions, methods, attribute IDs, headings
        base0E: '#8b5cf6', // keywords, storage, selector, markup italic, diff changed
        base0F: '#ec4899' // deprecated, opening/closing embedded language tags, e.g. <?php ?>
      }
    }

    return {
      base00: '#ffffff',
      base01: '#f5f5f5',
      base02: '#e5e5e5',
      base03: '#d4d4d4',
      base04: '#737373',
      base05: '#525252',
      base06: '#404040',
      base07: '#262626',
      base08: '#dc2626',
      base09: '#ea580c',
      base0A: '#ca8a04',
      base0B: '#16a34a',
      base0C: '#0891b2',
      base0D: '#2563eb',
      base0E: '#7c3aed',
      base0F: '#db2777'
    }
  }

  const handleCopyAll = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      navigator.clipboard.writeText(jsonString)
    } catch (error) {
      console.error('Erro ao copiar JSON:', error)
    }
  }

  return (
    <JsonViewerWrapper
      style={{
        ...style,
        maxHeight: isExpanded ? '80vh' : '600px'
      }}
    >
      {showControls && (
        <JsonViewerHeader>
          <h4>{title}</h4>
          <JsonViewerControls>
            <ControlButton
              active={!isCollapsed}
              onClick={() => setIsCollapsed(!isCollapsed)}
              title="Expandir/Colapsar"
            >
              {isCollapsed ? <FiEye size={12} /> : <FiEyeOff size={12} />}
            </ControlButton>
            <ControlButton
              active={showDataTypes}
              onClick={() => setShowDataTypes(!showDataTypes)}
              title="Mostrar tipos de dados"
            >
              Tipos
            </ControlButton>
            <ControlButton
              active={showObjectSize}
              onClick={() => setShowObjectSize(!showObjectSize)}
              title="Mostrar tamanho dos objetos"
            >
              Tamanho
            </ControlButton>
            <ControlButton onClick={handleCopyAll} title="Copiar JSON completo">
              <FiCopy size={12} />
            </ControlButton>
            <ControlButton
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimizar' : 'Maximizar'}
            >
              {isExpanded ? (
                <FiMinimize2 size={12} />
              ) : (
                <FiMaximize2 size={12} />
              )}
            </ControlButton>
          </JsonViewerControls>
        </JsonViewerHeader>
      )}

      <ReactJson
        src={data}
        theme={getTheme()}
        collapsed={isCollapsed}
        displayDataTypes={showDataTypes}
        displayObjectSize={showObjectSize}
        enableClipboard={enableClipboard}
        name={null}
        indentWidth={2}
        collapseStringsAfterLength={80}
        groupArraysAfterLength={100}
        sortKeys={false}
        quotesOnKeys={false}
        validationMessage="JSON inválido"
        style={{
          backgroundColor: 'transparent',
          fontSize: '13px',
          fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
        }}
      />
    </JsonViewerWrapper>
  )
}

export default JsonViewer
