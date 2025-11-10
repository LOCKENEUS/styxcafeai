import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'sporty-booking.preview.emergentagent.com',
      'localhost',
      '127.0.0.1',
      '.emergentagent.com'
    ]
  }
})
