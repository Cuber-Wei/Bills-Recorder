import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

export default defineConfig({
  plugins: [
    vue(),
    electron({
      // 主进程入口文件
      entry: 'electron/main.js',
      // 打包配置
      vite: {
        build: {
          // 输出目录
          outDir: 'dist-electron',
          rollupOptions: {
            external: ['electron']
          }
        }
      }
    })
  ],
  // 配置 base URL
  base: './',
  // 开发服务器配置
  server: {
    host: '127.0.0.1',
    port: 5173
  },
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    // 资源目录
    assetsDir: 'assets',
    // 清空输出目录
    emptyOutDir: true
  }
})