import { contextBridge, ipcRenderer } from 'electron'

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    // 获取应用信息
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),

    // 发送消息给主进程
    sendMessage: (message: any) => ipcRenderer.send('message', message),

    // 接收主进程消息
    onMessage: (callback: Function) => {
        ipcRenderer.on('message', (event, message) => callback(message))
    },

    // 文件操作示例
    readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),

    // 平台信息
    platform: process.platform
})

// 或者使用更简洁的方式
contextBridge.exposeInMainWorld('api', {
    platform: process.platform,
    versions: process.versions
})