import {
  app,
  BrowserWindow,
  nativeImage,
  Menu,
  shell,
  MenuItemConstructorOptions,
  ipcMain
} from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'

import {
  getWindowBounds,
  setWindowBounds
} from '../src/utils/windowBoundsController'

// Importar o serviço de configuração
import { configService } from '../src/services/configService'

let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`)

  if (app.dock) {
    app.dock.setIcon(icon)
  }

  mainWindow = new BrowserWindow({
    ...getWindowBounds(),
    icon,
    minWidth: 1000,
    minHeight: 600,
    frame: false,

    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // mainWindow.webContents.openDevTools()

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('close', () => {
    setWindowBounds(mainWindow?.getBounds())
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function createMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'PromptMan',
      submenu: [
        {
          label: 'New Connection',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('newPrompt')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Executar Prompt Selecionado',
          accelerator: 'CmdOrCtrl+Enter',
          click: () => {
            mainWindow?.webContents.send('runSelectedPrompt')
          }
        },
        {
          label: 'Salvar Prompt Selecionado',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('saveSelectedPrompt')
          }
        },
        {
          label: 'Exit',
          role: 'quit',
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            shell.openExternal('https://github.com/diego3g/promptman/')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
  createMenu()

  // Configurar handlers IPC para o serviço de configuração
  setupConfigHandlers()
})

// Configurar handlers IPC para o serviço de configuração
function setupConfigHandlers() {
  // Handler para ler a configuração dos providers
  ipcMain.handle('read-providers-config', async () => {
    try {
      return await configService.readProvidersConfig()
    } catch (error) {
      console.error('Erro ao ler providers config:', error)
      throw error
    }
  })

  // Handler para escrever a configuração dos providers
  ipcMain.handle('write-providers-config', async (event, config) => {
    try {
      await configService.writeProvidersConfig(config)
      return { success: true }
    } catch (error) {
      console.error('Erro ao escrever providers config:', error)
      throw error
    }
  })
}

app.allowRendererProcessReuse = true
