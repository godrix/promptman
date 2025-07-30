# 🚀 Guia de Releases - PromptMan

Este guia explica como criar releases automatizadas do PromptMan usando GitHub Actions.

## 📋 Pré-requisitos

- Acesso de push ao repositório
- Node.js e Yarn instalados localmente
- Git configurado corretamente

## 🎯 Como Funciona

O sistema de releases automatizado funciona da seguinte forma:

1. **Criação da Tag**: Quando você cria uma tag no formato `V{version}` (ex: `V1.0.0`)
2. **Trigger Automático**: O GitHub Actions detecta a tag e inicia o workflow de release
3. **Build Multi-plataforma**: Gera builds para Windows, macOS e Linux
4. **Release Automática**: Cria uma release no GitHub com todos os artefatos

## 🛠️ Como Criar uma Release

### Método 1: Usando o Script Automatizado (Recomendado)

```bash
# Criar uma nova release
yarn release 1.0.0

# Ou usando npm
npm run release 1.0.0
```

O script irá:

- ✅ Verificar se você está no branch main
- ✅ Verificar se não há mudanças não commitadas
- ✅ Atualizar a versão no `package.json`
- ✅ Criar a tag `V{version}`
- ✅ Fazer push das mudanças e da tag
- ✅ Trigger automático do GitHub Actions

### Método 2: Manual

```bash
# 1. Atualizar versão no package.json
npm version 1.0.0 --no-git-tag-version

# 2. Fazer commit da mudança
git add package.json
git commit -m "chore: bump version to 1.0.0"

# 3. Criar e fazer push da tag
git tag -a V1.0.0 -m "Release 1.0.0"
git push origin main
git push origin V1.0.0
```

## 📦 Artefatos Gerados

Cada release inclui os seguintes arquivos:

### Windows

- `PromptMan-Setup-{version}-Windows.exe` - Instalador NSIS
- `PromptMan-Portable-{version}-Windows.exe` - Versão portátil

### macOS

- `PromptMan-{version}-macOS.dmg` - Instalador DMG
- `PromptMan-{version}-macOS.zip` - Versão compactada

### Linux

- `PromptMan-{version}-Linux.AppImage` - Executável universal
- `PromptMan-{version}-Linux.deb` - Pacote Debian/Ubuntu
- `PromptMan-{version}-Linux.rpm` - Pacote Red Hat/Fedora

## 🔧 Workflows Disponíveis

### 1. `release.yml`

- **Trigger**: Tags com padrão `V*`
- **Função**: Criar release com builds multi-plataforma
- **Artefatos**: Todos os executáveis para download

### 2. `build.yml`

- **Trigger**: Push para `main`/`develop` e Pull Requests
- **Função**: Validação de código (lint, test, build)
- **Artefatos**: Nenhum (apenas validação)

## 📋 Checklist Antes da Release

Antes de criar uma release, certifique-se de:

- [ ] A versão no `package.json` está correta
- [ ] O changelog está atualizado (se aplicável)
- [ ] Você está no branch `main`

## 🐛 Troubleshooting

### Erro: "Tag já existe"

```bash
# Remover tag local se necessário
git tag -d V1.0.0
git push origin :refs/tags/V1.0.0
```

### Erro: "Mudanças não commitadas"

```bash
# Verificar status
git status

# Fazer commit das mudanças
git add .
git commit -m "feat: prepare for release"
```

### Workflow falhou

1. Verificar os logs em: `https://github.com/{user}/{repo}/actions`
2. Verificar se todas as dependências estão instaladas
3. Verificar se o `package.json` está válido

## 📈 Monitoramento

- **Status do Workflow**: https://github.com/{user}/{repo}/actions
- **Releases**: https://github.com/{user}/{repo}/releases
- **Logs Detalhados**: Clique em qualquer workflow para ver logs completos

## 🔄 Versionamento

Siga o [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

Exemplos:

- `V1.0.0` - Primeira versão estável
- `V1.1.0` - Nova funcionalidade
- `V1.0.1` - Correção de bug

## 🎉 Próximos Passos

Após criar a release:

1. **Monitorar**: Acompanhe o progresso no GitHub Actions
2. **Testar**: Baixe e teste os artefatos gerados
3. **Comunicar**: Anuncie a nova versão para os usuários
4. **Documentar**: Atualize a documentação se necessário

---

**💡 Dica**: Use `yarn release --help` para ver todas as opções disponíveis no script de release.
