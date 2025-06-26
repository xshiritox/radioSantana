import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Configure plugins
  plugins: [vue()],

  // Basic configuration
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@heroicons/vue/24/outline']
  },

  // Build configuration
  build: {
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          icons: ['@heroicons/vue/24/outline']
        }
      }
    }
  },

  // Development server configuration
  server: {
    hmr: true,
    open: true
  },

  // Preview configuration
  preview: {
    port: 4173,
    open: true
  },

  // Global variable definitions
  define: {
    'process.env': {}
  }
});
