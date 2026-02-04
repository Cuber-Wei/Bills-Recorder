import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 禁用安全警告（仅开发）
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            // 启用 Node.js 集成
            nodeIntegration: true,
            // 启用上下文隔离（推荐）
            contextIsolation: false,
            // 预加载脚本
            preload: path.join(__dirname, 'preload.ts')
        },
        // 隐藏默认菜单
        autoHideMenuBar: true
    })

    // 开发环境下加载开发服务器
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
        mainWindow.webContents.openDevTools()
    } else {
        // 生产环境加载打包文件
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    // 可选：自定义菜单
    const menu = Menu.buildFromTemplate([
        {
            label: '应用',
            submenu: [
                {
                    label: '退出',
                    click: () => app.quit()
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)
}

// 应用准备就绪
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// IPC 通信示例
ipcMain.handle('get-app-info', () => {
    return {
        version: app.getVersion(),
        platform: process.platform
    }
})