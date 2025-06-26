import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Base URL configuration
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  
  // Configure plugins
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ],

  // Basic configuration
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@heroicons/vue/24/outline'
    ]
  },

  // Build configuration
  build: {
    minify: 'esbuild' as const,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          icons: ['@heroicons/vue/24/outline']
        },
        // Ensure proper handling of dynamic imports
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    // Ensure proper MIME types for assets
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
    // Ensure proper MIME types in development
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },

  // Preview configuration
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },

  // Global variable definitions
  define: {
    'process.env': {},
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },

  // Configure esbuild for TypeScript
  esbuild: {
    include: /.*\.tsx?$/,
    exclude: [],
    loader: 'ts',
    jsx: 'preserve',
    tsconfigRaw: {
      compilerOptions: {
        removeComments: true,
        jsx: 'preserve',
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true
      },
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      exclude: ['node_modules']
    },
    // @ts-ignore - This is a valid option
    jsxFactory: 'h',
    // @ts-ignore - This is a valid option
    jsxFragment: 'Fragment',
    // @ts-ignore - This is a valid option
    jsxInject: `import { h, Fragment } from 'vue'`
  }
});
