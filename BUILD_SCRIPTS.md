# Scripts de Build para Diferentes Plataformas

O PromptMan inclui scripts específicos para gerar versões para Linux, Mac e Windows, facilitando a distribuição multiplataforma.

## Scripts Disponíveis

### **🔧 Scripts de Build:**

#### **📦 Build Geral:**
```bash
npm run package
# ou
yarn package
```
- **Funcionalidade:** Build para a plataforma atual
- **Uso:** Desenvolvimento e testes locais

#### **🐧 Build para Linux:**
```bash
npm run package:linux
# ou
yarn package:linux
```
- **Funcionalidade:** Gera versões para Linux
- **Formatos:** AppImage, DEB, RPM
- **Arquitetura:** x64

#### **🍎 Build para macOS:**
```bash
npm run package:mac
# ou
yarn package:mac
```
- **Funcionalidade:** Gera versões para macOS
- **Formatos:** DMG, ZIP
- **Arquitetura:** x64, ARM64 (Apple Silicon)

#### **🪟 Build para Windows:**
```bash
npm run package:windows
# ou
yarn package:windows
```
- **Funcionalidade:** Gera versões para Windows
- **Formatos:** NSIS Installer, Portable
- **Arquitetura:** x64

#### **🌍 Build para Todas as Plataformas:**
```bash
npm run package:all
# ou
yarn package:all
```
- **Funcionalidade:** Gera versões para todas as plataformas
- **Uso:** Distribuição completa
- **Tempo:** Mais demorado, mas completo

## Formatos de Saída

### **🐧 Linux:**
- **AppImage:** Executável portátil (recomendado)
- **DEB:** Pacote para distribuições baseadas em Debian/Ubuntu
- **RPM:** Pacote para distribuições baseadas em Red Hat/Fedora

### **🍎 macOS:**
- **DMG:** Instalador nativo do macOS
- **ZIP:** Arquivo compactado portátil

### **🪟 Windows:**
- **NSIS:** Instalador com interface gráfica
- **Portable:** Executável portátil (sem instalação)

## Configurações do Build

### **⚙️ Configurações Gerais:**
```json
{
  "appId": "com.promptman.app",
  "productName": "PromptMan",
  "copyright": "Copyright © 2024 Carlos Gabriel Godri",
  "compression": "maximum"
}
```

### **🎯 Configurações por Plataforma:**

#### **Linux:**
```json
"linux": {
  "target": [
    {
      "target": "AppImage",
      "arch": ["x64"]
    },
    {
      "target": "deb",
      "arch": ["x64"]
    },
    {
      "target": "rpm",
      "arch": ["x64"]
    }
  ],
  "category": "Development"
}
```

#### **macOS:**
```json
"mac": {
  "category": "public.app-category.developer-tools",
  "target": [
    {
      "target": "dmg",
      "arch": ["x64", "arm64"]
    },
    {
      "target": "zip",
      "arch": ["x64", "arm64"]
    }
  ]
}
```

#### **Windows:**
```json
"win": {
  "target": [
    {
      "target": "nsis",
      "arch": ["x64"]
    },
    {
      "target": "portable",
      "arch": ["x64"]
    }
  ]
}
```

## Diretórios de Saída

### **📁 Estrutura:**
```
release/
├── linux/
│   ├── PromptMan-1.0.0.AppImage
│   ├── promptman_1.0.0_amd64.deb
│   └── promptman-1.0.0.x86_64.rpm
├── mac/
│   ├── PromptMan-1.0.0.dmg
│   └── PromptMan-1.0.0-mac.zip
└── win/
    ├── PromptMan Setup 1.0.0.exe
    └── PromptMan-1.0.0-win.zip
```

## Requisitos por Plataforma

### **🐧 Linux:**
- **Sistema:** Linux x64
- **Dependências:** FUSE (para AppImage)
- **Distribuições:** Ubuntu, Fedora, Arch, etc.

### **🍎 macOS:**
- **Sistema:** macOS 10.14+ (Mojave)
- **Arquiteturas:** Intel x64, Apple Silicon ARM64
- **Certificação:** Opcional (para distribuição na App Store)

### **🪟 Windows:**
- **Sistema:** Windows 10/11
- **Arquitetura:** x64
- **Dependências:** Visual C++ Redistributable (incluso)

## Processo de Build

### **🔄 Fluxo Completo:**

1. **Preparação:**
   ```bash
   npm install
   # ou
   yarn install
   ```

2. **Build do Código:**
   ```bash
   npm run build
   # ou
   yarn build
   ```

3. **Empacotamento:**
   ```bash
   npm run package:linux    # Para Linux
   npm run package:mac      # Para macOS
   npm run package:windows  # Para Windows
   npm run package:all      # Para todas
   ```

4. **Resultado:**
   - Arquivos gerados em `release/`
   - Prontos para distribuição

## Otimizações

### **📦 Compressão:**
- **Configuração:** `"compression": "maximum"`
- **Benefício:** Arquivos menores
- **Tempo:** Build mais lento, mas resultado otimizado

### **🎯 Arquiteturas:**
- **Linux:** x64 (mais comum)
- **macOS:** x64 + ARM64 (Apple Silicon)
- **Windows:** x64 (padrão atual)

### **⚡ Performance:**
- **Build paralelo:** Possível com `package:all`
- **Cache:** Electron-builder mantém cache
- **Incremental:** Reutiliza builds anteriores

## Troubleshooting

### **Problema: Build falha no Linux**
**Solução:** Verifique se o FUSE está instalado
```bash
sudo apt-get install fuse
```

### **Problema: Build falha no macOS**
**Solução:** Verifique se o Xcode Command Line Tools está instalado
```bash
xcode-select --install
```

### **Problema: Build falha no Windows**
**Solução:** Verifique se o Visual Studio Build Tools está instalado

### **Problema: Arquivos muito grandes**
**Solução:** Verifique se `node_modules` não está sendo incluído

## Distribuição

### **📤 Opções de Distribuição:**

#### **GitHub Releases:**
- **Formato:** ZIP, DMG, AppImage
- **Vantagem:** Gratuito e confiável
- **Uso:** Projetos open source

#### **App Stores:**
- **macOS:** Mac App Store
- **Linux:** Snap Store, Flathub
- **Windows:** Microsoft Store

#### **Sites Próprios:**
- **Controle total:** Sobre a distribuição
- **Personalização:** Branding próprio
- **Analytics:** Dados de download

## Monitoramento

### **📊 Métricas Importantes:**
- **Tamanho dos arquivos:** Para otimização
- **Tempo de build:** Para eficiência
- **Taxa de erro:** Para estabilidade
- **Downloads:** Para popularidade

### **🎯 Melhorias Baseadas em Dados:**
- **Otimização de tamanho:** Baseado no feedback
- **Melhoria de performance:** Baseado nos testes
- **Novos formatos:** Baseado na demanda

## Futuras Melhorias

### **🎯 Funcionalidades Planejadas:**
- **Auto-updater:** Atualizações automáticas
- **Code signing:** Assinatura digital
- **Notarization:** Para macOS
- **CI/CD:** Builds automatizados

### **🔧 Melhorias Técnicas:**
- **Builds incrementais:** Mais rápidos
- **Cache otimizado:** Melhor performance
- **Paralelização:** Builds simultâneos
- **Testes automatizados:** Qualidade garantida

Os scripts de build facilitam a distribuição multiplataforma do PromptMan! 🚀 