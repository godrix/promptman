import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export interface ConfigService {
  readProvidersConfig(): Promise<any>
  writeProvidersConfig(config: any): Promise<void>
  validateProvidersConfig(config: any): boolean
}

class ConfigServiceImpl implements ConfigService {
  private getConfigPath(): string {
    // Em desenvolvimento, usar o caminho relativo ao diretório do projeto
    if (process.env.NODE_ENV === 'development') {
      return path.join(__dirname, '../src/config/providers.json')
    }

    // Em produção, usar o caminho da aplicação
    return path.join(app.getAppPath(), 'src/config/providers.json')
  }

  async readProvidersConfig(): Promise<any> {
    try {
      const configPath = this.getConfigPath()
      const configContent = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(configContent)
    } catch (error) {
      console.error('Erro ao ler providers.json:', error)
      throw new Error(
        'Não foi possível ler o arquivo de configuração dos providers'
      )
    }
  }

  async writeProvidersConfig(config: any): Promise<void> {
    try {
      const configPath = this.getConfigPath()

      // Validar a configuração antes de salvar
      if (!this.validateProvidersConfig(config)) {
        throw new Error('Configuração inválida')
      }

      // Fazer backup do arquivo atual
      const backupPath = configPath + '.backup'
      if (fs.existsSync(configPath)) {
        fs.copyFileSync(configPath, backupPath)
      }

      // Salvar a nova configuração
      const configContent = JSON.stringify(config, null, 2)
      fs.writeFileSync(configPath, configContent, 'utf8')

      console.log('providers.json atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao salvar providers.json:', error)
      throw new Error(
        'Não foi possível salvar o arquivo de configuração dos providers'
      )
    }
  }

  validateProvidersConfig(config: any): boolean {
    try {
      // Validações básicas da estrutura
      if (!config || typeof config !== 'object') {
        return false
      }

      if (!config.providers || !Array.isArray(config.providers)) {
        return false
      }

      if (
        !config.defaultProvider ||
        typeof config.defaultProvider !== 'string'
      ) {
        return false
      }

      if (!config.defaultModel || typeof config.defaultModel !== 'string') {
        return false
      }

      if (
        !config.defaultSettings ||
        typeof config.defaultSettings !== 'object'
      ) {
        return false
      }

      // Validar cada provider
      for (const provider of config.providers) {
        if (!provider.id || !provider.name || !provider.displayName) {
          return false
        }

        if (!provider.models || !Array.isArray(provider.models)) {
          return false
        }

        if (!provider.requestFormat || !provider.responseFormat) {
          return false
        }

        // Validar cada modelo do provider
        for (const model of provider.models) {
          if (!model.id || !model.name || !model.displayName) {
            return false
          }

          if (
            typeof model.maxTokens !== 'number' ||
            typeof model.defaultTemperature !== 'number' ||
            typeof model.defaultMaxTokens !== 'number'
          ) {
            return false
          }
        }
      }

      return true
    } catch (error) {
      console.error('Erro na validação da configuração:', error)
      return false
    }
  }
}

// Instância singleton do serviço
export const configService = new ConfigServiceImpl()
