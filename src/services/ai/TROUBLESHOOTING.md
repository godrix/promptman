# Guia de Troubleshooting - APIs de IA

## Problemas Comuns e Soluções

### 🔑 Erro: "Method doesn't allow unregistered callers"

**Causa**: API key inválida ou mal configurada

**Soluções**:

1. **Verificar API Key**:
   - Certifique-se de que a API key está correta
   - Copie a chave completa do Google AI Studio
   - Não inclua espaços extras

2. **Habilitar API**:
   - Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Verifique se a API está habilitada para seu projeto
   - Crie uma nova API key se necessário

3. **Verificar Quotas**:
   - Verifique se você não excedeu o limite de requisições
   - Algumas contas gratuitas têm limites diários

### 🌐 Erro: "Network Error" ou "Failed to fetch"

**Causa**: Problemas de conectividade ou CORS

**Soluções**:

1. **Verificar Internet**: Teste sua conexão
2. **Proxy/Firewall**: Verifique se não há bloqueios
3. **CORS**: Em desenvolvimento, pode ser necessário configurar proxy

### 📝 Erro: "Invalid request" ou "Bad Request"

**Causa**: Estrutura da requisição incorreta

**Soluções**:

1. **Verificar Modelo**: Certifique-se de que o modelo existe
2. **Verificar Parâmetros**: Temperature entre 0-2, maxTokens válido
3. **Verificar Prompt**: Não muito longo ou vazio

### 🤖 Erro: "models/gemini-pro is not found for API version v1beta"

**Causa**: Modelo não disponível na versão da API

**Soluções**:

1. **Usar Modelos Corretos**:
   - `gemini-1.5-flash` (recomendado)
   - `gemini-1.5-pro`
   - `gemini-pro`

2. **Verificar Disponibilidade**:
   - Alguns modelos podem não estar disponíveis em todas as regiões
   - Verifique se sua conta tem acesso aos modelos

### 🔍 Debug

Para debugar problemas:

1. **Abrir Console do Navegador** (F12)
2. **Verificar Logs**: Procure por mensagens de erro
3. **Verificar Network Tab**: Veja as requisições HTTP
4. **Testar API Key**: Use o Google AI Studio para testar

### 📋 Checklist de Verificação

- [ ] API key válida e copiada corretamente
- [ ] API habilitada no Google AI Studio
- [ ] Modelo selecionado existe
- [ ] Parâmetros dentro dos limites válidos
- [ ] Prompt não está vazio
- [ ] Conexão com internet funcionando

### 🛠️ Teste Rápido

Para testar se sua API key funciona:

1. Acesse [Google AI Studio](https://makersuite.google.com/app/prompts)
2. Cole sua API key
3. Teste um prompt simples
4. Se funcionar lá, deve funcionar aqui

### 📞 Suporte

Se o problema persistir:

1. Verifique os logs no console do navegador
2. Teste a API key no Google AI Studio
3. Verifique a documentação oficial do Gemini
4. Considere criar uma nova API key 