import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: nome do repo no GitHub Pages (https://<user>.github.io/claru/)
export default defineConfig({
  plugins: [react()],
  base: '/claru/',
})
