import React, { useState, useRef, useEffect } from 'react'
import { FiPaperclip, FiX, FiFile, FiChevronDown } from 'react-icons/fi'

import {
  Container,
  AttachmentButton,
  Dropdown,
  DropdownItem,
  FileInput,
  FilePreview,
  FileInfo,
  RemoveButton
} from './styles'

interface FileAttachmentProps {
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  selectedFile?: File | null
  disabled?: boolean
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  disabled = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleButtonClick = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      console.log('Arquivo selecionado:', file)

      if (file && onFileSelect) {
        // Validar se é um PDF
        if (file.type !== 'application/pdf') {
          console.error('Tipo de arquivo não suportado:', file.type)
          return
        }

        // Validar tamanho do arquivo (máximo 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          console.error('Arquivo muito grande:', file.size)
          return
        }

        console.log('Chamando onFileSelect com arquivo válido')
        onFileSelect(file)
      }
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Erro ao processar arquivo:', error)
      setIsDropdownOpen(false)
    }
  }

  const handleRemoveFile = () => {
    if (onFileRemove) {
      onFileRemove()
    }
  }

  const handlePDFClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Container ref={containerRef}>
      <AttachmentButton
        onClick={handleButtonClick}
        disabled={disabled}
        hasFile={!!selectedFile}
      >
        <FiPaperclip size={16} />
        <span>Anexar</span>
        <FiChevronDown size={14} />
      </AttachmentButton>

      {isDropdownOpen && (
        <Dropdown>
          <DropdownItem onClick={handlePDFClick}>
            <FiFile size={16} />
            <span>PDF</span>
          </DropdownItem>
          {/* Futuros tipos de arquivo podem ser adicionados aqui */}
        </Dropdown>
      )}

      <FileInput
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {selectedFile && (
        <FilePreview>
          <FileInfo>
            <FiFile size={16} />
            <div>
              <span className="filename">{selectedFile.name}</span>
              <span className="filesize">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </FileInfo>
          <RemoveButton onClick={handleRemoveFile}>
            <FiX size={14} />
          </RemoveButton>
        </FilePreview>
      )}
    </Container>
  )
}

export default FileAttachment
