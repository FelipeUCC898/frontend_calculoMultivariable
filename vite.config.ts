/**
 * vite.config.ts
 * Configuración de Vite para el proyecto React + TypeScript
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Alias para imports más limpios
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    host: true, // Permite acceso desde la red local
    proxy: {
      // Proxy para evitar problemas de CORS en desarrollo
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  // Build optimizations
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors grandes en chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-three': ['three'],
        },
      },
    },
  },

  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', 'axios', 'three'],
  },
});