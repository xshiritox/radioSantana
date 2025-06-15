import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [vue()],
  server: {
    proxy: {
      // Configuración de proxy para Firebase
      '^/(firestore|identitytoolkit|securetoken)/.*': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          if (path.startsWith('/firestore')) {
            return path.replace('/firestore', '/v1/projects/radiosantananm-cda61/databases/(default)/documents');
          }
          return path;
        }
      },
      // Configuración para autenticación
      '^/__/auth/.*': {
        target: 'https://identitytoolkit.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__\/auth\//, '')
      }
    },
    cors: {
      origin: true, // Permite todos los orígenes
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  },
  base: './'
});
