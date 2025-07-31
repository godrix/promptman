# JsonViewer

Componente para exibir JSON formatado com syntax highlighting, cores e funcionalidades interativas.

## Funcionalidades

### ✅ Syntax Highlighting

- Cores diferentes para strings, números, booleanos, null
- Destaque para chaves, colchetes, vírgulas e dois pontos
- Tema escuro e claro personalizáveis

### ✅ Controles Interativos

- Expandir/colapsar objetos e arrays
- Mostrar/ocultar tipos de dados
- Mostrar/ocultar tamanho dos objetos
- Copiar JSON completo para clipboard
- Maximizar/minimizar visualização

### ✅ Interface Intuitiva

- Botões de controle com ícones
- Tooltips informativos
- Scrollbar customizada
- Responsivo e bem dimensionado

### ✅ Integração

- Compatível com o tema da aplicação
- Fácil integração em outros componentes
- Suporte a dados JSON inválidos

## Como Usar

### Importação

```tsx
import JsonViewer from '../../components/JsonViewer'
```

### Uso Básico

```tsx
<JsonViewer data={jsonData} title="Título do JSON" showControls={true} />
```

### Uso Avançado

```tsx
<JsonViewer
  data={jsonData}
  title="Configuração de Providers"
  showControls={true}
  collapsed={true}
  displayDataTypes={false}
  displayObjectSize={false}
  enableClipboard={true}
  style={{
    height: '60vh',
    border: '1px solid #322D41',
    borderRadius: '8px'
  }}
/>
```

## Props

| Prop                | Tipo                  | Padrão            | Descrição                              |
| ------------------- | --------------------- | ----------------- | -------------------------------------- |
| `data`              | `any`                 | -                 | Dados JSON para exibir                 |
| `theme`             | `'dark' \| 'light'`   | `'dark'`          | Tema de cores                          |
| `collapsed`         | `boolean`             | `false`           | Se os objetos devem começar colapsados |
| `displayDataTypes`  | `boolean`             | `false`           | Mostrar tipos de dados                 |
| `displayObjectSize` | `boolean`             | `false`           | Mostrar tamanho dos objetos            |
| `enableClipboard`   | `boolean`             | `true`            | Habilitar cópia para clipboard         |
| `style`             | `React.CSSProperties` | -                 | Estilos customizados                   |
| `title`             | `string`              | `'JSON Response'` | Título do componente                   |
| `showControls`      | `boolean`             | `true`            | Mostrar controles                      |

## Controles Disponíveis

### 👁️ Expandir/Colapsar

- Alterna entre visualização expandida e colapsada
- Útil para navegar em JSONs grandes

### 📊 Tipos

- Mostra/oculta os tipos de dados (string, number, boolean, etc.)
- Ajuda na compreensão da estrutura

### 📏 Tamanho

- Mostra/oculta o tamanho dos objetos e arrays
- Útil para entender a complexidade dos dados

### 📋 Copiar

- Copia todo o JSON formatado para o clipboard
- Preserva a formatação e indentação

### 🔍 Maximizar

- Expande a visualização para ocupar mais espaço
- Útil para analisar JSONs complexos

## Temas

### Tema Escuro (Padrão)

- Cores baseadas no tema da aplicação
- Alto contraste para melhor legibilidade
- Cores específicas para cada tipo de dado

### Tema Claro

- Versão clara para ambientes com fundo claro
- Mantém a mesma estrutura de cores
- Adaptado para melhor visibilidade

## Integração com ProvidersConfigEditor

O JsonViewer foi integrado ao ProvidersConfigEditor para oferecer duas formas de visualizar o arquivo `providers.json`:

1. **Editor de Texto**: Para edição direta do JSON
2. **Visualização Formatada**: Para análise e navegação da estrutura

### Como Usar no ProvidersConfigEditor

1. Abra o editor de providers (`{} providers.json`)
2. Use os botões "Editor" e "Visualizar" para alternar entre os modos
3. No modo visualização, use os controles do JsonViewer para navegar
4. Volte ao editor para fazer alterações

## Exemplo de Uso

```tsx
// Exemplo de resposta da API
const apiResponse = {
  content: "Resposta do modelo",
  usage: {
    promptTokens: 100,
    completionTokens: 50,
    totalTokens: 150
  },
  raw: {
    id: "chatcmpl-123",
    object: "chat.completion",
    created: 1677652288,
    model: "gpt-4",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: "Resposta do modelo"
        },
        finish_reason: "stop"
      }
    ],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150
    }
  }
}

// Uso no componente
<JsonViewer
  data={apiResponse.raw}
  title="Resposta da API"
  showControls={true}
  collapsed={false}
/>
```

## Dependências

- `react-json-view`: Biblioteca principal para renderização do JSON
- `react-icons/fi`: Ícones dos controles
- `styled-components`: Estilização customizada
