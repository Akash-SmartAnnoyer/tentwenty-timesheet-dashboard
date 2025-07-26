import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/tentwenty-timesheet-dashboard/', // Set base for GitHub Pages
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
}) 