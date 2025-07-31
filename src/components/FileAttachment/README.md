# FileAttachment Component

Componente para anexar arquivos PDF aos prompts do usuário, seguindo as especificações da [API Gemini para processamento de documentos](https://ai.google.dev/gemini-api/docs/document-processing?hl=pt-br).

## Funcionalidades

- **Suporte a PDFs**: Apenas arquivos PDF são suportados (conforme especificação da API Gemini)
- **Limites de tamanho**: Máximo de 20MB por arquivo (conforme API Gemini)
- **Limites de páginas**: Até 1.000 páginas por documento (conforme API Gemini)
- **Preview do arquivo**: Mostra nome e tamanho do arquivo anexado
- **Remoção de arquivo**: Botão para remover o arquivo anexado
- **Validação de modelo**: Verifica se o modelo selecionado suporta arquivos (visão)
- **Indicadores visuais**: Mostra quando há arquivo anexado em diferentes partes da interface

## Uso

```tsx
import FileAttachment from '../../components/FileAttachment'

;<FileAttachment
  onFileSelect={handleFileSelect}
  onFileRemove={handleFileRemove}
  selectedFile={attachedFile}
  disabled={isLoading}
/>
```

## Props

| Prop           | Tipo                   | Descrição                                        |
| -------------- | ---------------------- | ------------------------------------------------ |
| `onFileSelect` | `(file: File) => void` | Callback chamado quando um arquivo é selecionado |
| `onFileRemove` | `() => void`           | Callback chamado quando o arquivo é removido     |
| `selectedFile` | `File \| null`         | Arquivo atualmente anexado                       |
| `disabled`     | `boolean`              | Se o componente está desabilitado                |

## Integração com o PromptEditor

O componente está integrado ao PromptEditor e inclui:

1. **Validação de modelo**: Verifica se o modelo suporta visão antes de permitir anexar arquivos
2. **Indicadores visuais**:
   - Badge no header do User Prompt
   - Indicador na área de resposta
   - Preview do arquivo abaixo do textarea
3. **Limpeza automática**: O arquivo é removido automaticamente ao:
   - Salvar o prompt
   - Trocar de prompt
   - Executar o prompt

## Processamento do Arquivo

Quando um arquivo PDF é anexado:

1. O arquivo é validado (apenas PDFs são aceitos)
2. Tamanho é verificado (máximo 20MB conforme API Gemini)
3. Contexto específico sobre o documento é adicionado ao prompt
4. O prompt é enviado para o modelo com instruções para analisar o PDF
5. O modelo deve suportar visão para processar arquivos

### Especificações da API Gemini

- **Tipo de arquivo**: Apenas PDFs são suportados significativamente
- **Tamanho máximo**: 20MB por arquivo
- **Páginas máximas**: 1.000 páginas por documento
- **Resolução**: Páginas são redimensionadas para 3072x3072 (máximo) ou 768x768 (mínimo)
- **Tokens**: Cada página equivale a 258 tokens

## Estrutura de Arquivos

```
src/components/FileAttachment/
├── index.tsx          # Componente principal
├── styles.ts          # Estilos styled-components
└── README.md          # Esta documentação
```

## Limitações e Considerações

### API Gemini

- **Apenas PDFs**: Outros tipos de arquivo (TXT, Markdown, HTML, XML) são extraídos como texto puro
- **Visão nativa**: O Gemini usa visão nativa para entender contextos de documentos inteiros
- **Análise completa**: Pode analisar texto, imagens, diagramas, gráficos e tabelas

### Práticas Recomendadas

- Gire as páginas para a orientação correta antes do upload
- Evite páginas desfocadas
- Para uma única página, coloque o comando de texto depois dela

## Futuras Expansões

O componente está preparado para suportar outros tipos de arquivo, mas note que apenas PDFs têm suporte significativo na API Gemini:

- Imagens (PNG, JPG, etc.) - para análise de imagens
- Documentos (DOCX, TXT, etc.) - extraídos como texto puro
- Outros formatos suportados pelos modelos de IA

Para adicionar novos tipos, basta:

1. Adicionar o item no dropdown
2. Atualizar a validação de arquivo
3. Modificar o processamento no aiService
