<p align="center">
  <h1>🚀</h1>
</p>

<h1 align="center">
  PromptMan
</h1>

PromptMan é uma ferramenta gráfica para testar e gerenciar prompts de IA com facilidade.

🚧 **PromptMan está em desenvolvimento** 🚧

## Funcionalidades

- 📝 **Editor de Prompts**: Interface intuitiva para criar e editar prompts
- 🔧 **Variáveis Dinâmicas**: Suporte a variáveis que podem ser substituídas durante o teste
- 🧪 **Teste de Prompts**: Teste seus prompts com diferentes valores de variáveis
- 💾 **Gerenciamento**: Salve e organize seus prompts favoritos
- 🎨 **Interface Moderna**: Design elegante e responsivo
⚡ **Templalização**: Transforme seus prompts em templates estruturados

## Como Usar

1. **Criar um Prompt**: Clique no botão "+" na lista de prompts
2. **Editar Conteúdo**: Digite seu prompt no editor
3. **Adicionar Variáveis**: Use `{{nome_da_variavel}}` no seu prompt
4. **Salvar**: Use `Ctrl + S` para salvar o prompt
5. **Executar**: Use `Ctrl + Enter` ou clique no botão "Run" para testar o prompt
6. **Templalizar**: Clique no botão "Templalize" para estruturar seu prompt

## Exemplo de Prompt

### System Prompt:
```
Você é um assistente especializado em {{area}} com {{anos_experiencia}} anos de experiência.
```

### User Prompt:
```
Olá {{nome}}, você tem {{idade}} anos e mora em {{cidade}}.

Por favor, me ajude com {{tarefa}} relacionada a {{area}}.
```

### Variáveis Detectadas Automaticamente:
- `area`
- `anos_experiencia`
- `nome`
- `idade`
- `cidade`
- `tarefa`

As variáveis são detectadas automaticamente quando você usa o formato `{{nome_da_variavel}}` no texto.

## Contributing

Este repositório está atualmente em desenvolvimento. Se você quiser contribuir, faça um fork do repositório e comece a trabalhar, faça as mudanças que desejar e envie um Pull request.

## Building

Você precisará do [Node.js](https://nodejs.org) instalado no seu computador para construir este app.

```bash
git clone https://github.com/diego3g/promptman.git
$ cd promptman
$ yarn install
$ yarn dev
```

Executa o app em modo de desenvolvimento.<br/>