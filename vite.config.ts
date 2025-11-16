import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    host: true,
    strictPort: true, // Force le port 3002, erreur si occupé
    // DÉSACTIVER COMPLÈTEMENT LE HMR
    hmr: false, // Plus de Hot Module Reload
    watch: {
      ignored: ['**/*'] // Ignorer tous les changements de fichiers
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]-[hash].js`,
        chunkFileNames: `[name]-[hash].js`, 
        assetFileNames: `[name]-[hash].[ext]`,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor': ['lucide-react']
        }
      }
    },
    manifest: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: true
    }
  },
  // PWA configuration
  publicDir: 'public'
})
