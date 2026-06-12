import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          axios: ['axios'],
          icons: ['lucide-react'],
          leaflet: ['leaflet'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
