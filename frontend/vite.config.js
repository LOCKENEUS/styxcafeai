import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Allows access from any device on the network
    port: 3000,
    allowedHosts: [
      'styxcafe-revamp.preview.emergentagent.com',
      'cafe-admin-panel.preview.emergentagent.com',
      'localhost',
      '.preview.emergentagent.com'
    ],
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()], // Handles JSX automatically
});

