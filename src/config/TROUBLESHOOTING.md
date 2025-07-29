# Troubleshooting - Problemas Comuns

Este documento lista problemas comuns e suas soluções no PromptMan.

## Problemas de API

### Erro: "Invalid type for 'temperature': expected a decimal, but got a string instead"

**Causa:** O campo `temperature` está sendo enviado como string em vez de número decimal para a API do OpenAI.

**Solução:** ✅ **Corrigido** - O sistema agora converte automaticamente `temperature` para número decimal.

**Detalhes Técnicos:**
- A função `replaceInObject` foi atualizada para detectar campos `{temperature}`
- Quando encontrado, o valor é convertido diretamente para número decimal
- Isso garante compatibilidade com todas as APIs que esperam números decimais

### Erro: "Invalid type for 'max_tokens': expected an integer, but got a string instead"

**Causa:** O campo `max_tokens` está sendo enviado como string em vez de número inteiro para a API do OpenAI.

**Solução:** ✅ **Corrigido** - O sistema agora converte automaticamente `max_tokens` para número inteiro.

**Detalhes Técnicos:**
- A função `replaceInObject` foi atualizada para detectar campos `{maxTokens}`
- Quando encontrado, o valor é convertido diretamente para número inteiro
- Isso garante compatibilidade com todas as APIs que esperam números

### Erro: "Provider 'openai' não encontrado"

**Causa:** O provider não está configurado corretamente ou o arquivo de configuração está corrompido.

**Soluções:**
1. Verifique se `src/config/providers.json` existe e está correto
2. Reinicie a aplicação
3. Verifique se não há erros de sintaxe JSON

### Erro: "Chave de API não configurada"

**Causa:** A chave de API para o provider atual não foi configurada.

**Solução:**
1. Acesse **Model Settings** no PromptEditor
2. Configure a chave de API para o provider desejado
3. Teste a conexão antes de usar

## Problemas de Interface

### Modelo não muda automaticamente ao trocar provider

**Causa:** A funcionalidade de seleção automática pode estar com problema.

**Solução:** ✅ **Corrigido** - O sistema agora seleciona automaticamente o modelo padrão do novo provider.

### Toast não aparece ao trocar modelo

**Causa:** O contexto de toast pode não estar funcionando.

**Solução:**
1. Verifique se o `ToastProvider` está envolvendo a aplicação
2. Reinicie a aplicação
3. Verifique o console para erros

## Problemas de Configuração

### Configurações não são salvas

**Causa:** Problema com o Electron Store ou permissões de arquivo.

**Soluções:**
1. Verifique se a aplicação tem permissão para escrever no diretório de configuração
2. Reinicie a aplicação
3. Verifique se não há outros processos usando o arquivo de configuração

### Configurações antigas persistem

**Causa:** Cache do Electron Store ou arquivo de configuração corrompido.

**Solução:**
1. Feche a aplicação
2. Delete o arquivo de configuração: `~/.config/promptman/config.json`
3. Reinicie a aplicação

## Problemas de Rede

### Timeout na requisição

**Causa:** Problema de conectividade ou API lenta.

**Soluções:**
1. Verifique sua conexão com a internet
2. Tente novamente em alguns segundos
3. Verifique se a API do provider está funcionando

### Erro de CORS

**Causa:** Problema de configuração do Electron para requisições externas.

**Solução:** ✅ **Não aplicável** - O Electron não tem restrições de CORS.

## Problemas de Performance

### Aplicação lenta

**Causa:** Muitos prompts salvos ou configurações pesadas.

**Soluções:**
1. Limpe prompts antigos não utilizados
2. Reinicie a aplicação
3. Verifique o uso de memória

### Travamento ao usar Templalize

**Causa:** Problema na requisição para a API de templalização.

**Solução:** ✅ **Corrigido** - Timeout de 30 segundos implementado.

## Logs e Debug

### Como verificar logs

1. Abra o **Developer Tools** (F12)
2. Vá para a aba **Console**
3. Procure por erros ou avisos

### Informações úteis para debug

- **Provider atual:** Verificado em Model Settings
- **Modelo atual:** Mostrado no dropdown de modelos
- **Chave de API:** Verificada automaticamente
- **Configurações salvas:** Persistidas no Electron Store

## Contato e Suporte

### Antes de reportar um problema

1. Verifique se o problema está listado aqui
2. Tente as soluções sugeridas
3. Colete logs do console
4. Descreva os passos para reproduzir o problema

### Informações para incluir no report

- **Versão do PromptMan:** Verificada em `package.json`
- **Sistema Operacional:** Windows, macOS, Linux
- **Provider afetado:** OpenAI, Gemini, Anthropic
- **Passos para reproduzir:** Lista detalhada
- **Logs do console:** Erros e avisos
- **Comportamento esperado vs atual:** Descrição clara 