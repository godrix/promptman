#!/bin/bash

# Script para criar uma nova release do PromptMan
# Uso: ./scripts/release.sh <version>
# Exemplo: ./scripts/release.sh 1.0.0

set -e

# Verificar se a versão foi fornecida
if [ -z "$1" ]; then
    echo "❌ Erro: Versão não fornecida"
    echo "Uso: ./scripts/release.sh <version>"
    echo "Exemplo: ./scripts/release.sh 1.0.0"
    exit 1
fi

VERSION=$1
TAG_NAME="V$VERSION"

echo "🚀 Criando release para versão $VERSION"

# Verificar se estamos no branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Aviso: Você está no branch '$CURRENT_BRANCH'. É recomendado estar no branch 'main' para criar releases."
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Release cancelada"
        exit 1
    fi
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erro: Há mudanças não commitadas no repositório"
    echo "Por favor, faça commit de todas as mudanças antes de criar uma release"
    git status --short
    exit 1
fi

# Verificar se a tag já existe
if git tag -l | grep -q "^$TAG_NAME$"; then
    echo "❌ Erro: A tag $TAG_NAME já existe"
    exit 1
fi

# Atualizar a versão no package.json
echo "📝 Atualizando versão no package.json..."
npm version $VERSION --no-git-tag-version

# Fazer commit da mudança de versão
git add package.json
git commit -m "chore: bump version to $VERSION"

# Criar a tag
echo "🏷️  Criando tag $TAG_NAME..."
git tag -a $TAG_NAME -m "Release $VERSION"

# Fazer push das mudanças e da tag
echo "📤 Fazendo push das mudanças e da tag..."
git push origin main
git push origin $TAG_NAME

echo "✅ Release criada com sucesso!"
echo "🎉 A tag $TAG_NAME foi criada e o GitHub Actions irá gerar automaticamente os builds para todas as plataformas"
echo "📋 Você pode acompanhar o progresso em: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')/actions"
