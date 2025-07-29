import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Prevent CORS issues with ReactQuill
  optimizeDeps: {
    include: ['react-quill']
  },
  // Fix react-quill warning
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}); 