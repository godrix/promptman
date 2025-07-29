// Função para estimar a quantidade de tokens em um texto
// Esta é uma estimativa aproximada baseada em regras comuns de tokenização
export const estimateTokenCount = (text: string): number => {
  if (!text || text.trim() === '') {
    return 0
  }

  // Regras básicas de estimativa de tokens:
  // - Palavras: ~1 token por palavra
  // - Pontuação: ~1 token por símbolo
  // - Espaços: geralmente não contam como tokens separados
  // - Números: ~1 token por número
  // - Caracteres especiais: ~1 token por caractere

  // Remove espaços extras e quebras de linha
  const cleanText = text.trim()
  
  // Divide o texto em tokens aproximados
  const tokens = cleanText
    .split(/\s+/)
    .filter(token => token.length > 0)
    .map(token => {
      // Se o token contém pontuação, pode ser dividido
      if (/[^\w\s]/.test(token)) {
        // Divide por pontuação e mantém a pontuação
        return token.split(/([^\w\s])/).filter(t => t.length > 0)
      }
      return [token]
    })
    .flat()

  return tokens.length
}

// Função para contar tokens em um prompt completo (system + user)
export const countPromptTokens = (systemPrompt: string, userPrompt: string): number => {
  const systemTokens = estimateTokenCount(systemPrompt)
  const userTokens = estimateTokenCount(userPrompt)
  
  // Adiciona um pequeno overhead para formatação
  const overhead = systemPrompt && userPrompt ? 10 : 0
  
  return systemTokens + userTokens + overhead
}

// Função para formatar a contagem de tokens
export const formatTokenCount = (count: number): string => {
  if (count === 0) return '0 tokens'
  if (count === 1) return '1 token'
  return `${count} tokens`
} 