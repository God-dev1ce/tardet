import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
targetIP="115.190.42.141:8000"
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://'+targetIP,
        // target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      },
      '/ws': {
        target: 'ws://'+targetIP,
        // target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, '')
      }
    }
  }
})
