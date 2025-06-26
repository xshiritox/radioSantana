// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/GitHub/radioSantana/node_modules/.pnpm/vite@5.4.19_@types+node@24.0.4/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/GitHub/radioSantana/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_b00db5e63d9cc9b898ed206b8292b015/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath } from "node:url";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\GitHub\\radioSantana";
var __vite_injected_original_import_meta_url = "file:///D:/GitHub/radioSantana/vite.config.ts";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        // Add Firebase aliases to ensure correct resolution
        "firebase/app": resolve(__vite_injected_original_dirname, "node_modules/firebase/app"),
        "firebase/firestore": resolve(__vite_injected_original_dirname, "node_modules/firebase/firestore"),
        "firebase/auth": resolve(__vite_injected_original_dirname, "node_modules/firebase/auth")
      }
    },
    optimizeDeps: {
      include: [
        "firebase/app",
        "firebase/firestore",
        "firebase/auth"
      ]
    },
    plugins: [vue()],
    server: {
      proxy: {
        // Configuración de proxy para Firebase
        "^/(firestore|identitytoolkit|securetoken)/.*": {
          target: "https://www.googleapis.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            if (path.startsWith("/firestore")) {
              return path.replace("/firestore", "/v1/projects/radiosantananm-cda61/databases/(default)/documents");
            }
            return path;
          }
        },
        // Configuración para autenticación
        "^/__/auth/.*": {
          target: "https://identitytoolkit.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/__\/auth\//, "")
        }
      },
      cors: {
        origin: true,
        // Permite todos los orígenes
        credentials: true
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      },
      hmr: {
        protocol: "ws",
        host: "localhost"
      }
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        external: [...builtinModules],
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("firebase")) {
                return "firebase";
              }
              if (id.includes("vue")) {
                return "vendor-vue";
              }
              return "vendor";
            }
          }
        }
      }
    },
    base: "./",
    define: {
      "process.env": env,
      __APP_ENV__: JSON.stringify(env.NODE_ENV || "development")
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxHaXRIdWJcXFxccmFkaW9TYW50YW5hXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxHaXRIdWJcXFxccmFkaW9TYW50YW5hXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9HaXRIdWIvcmFkaW9TYW50YW5hL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIExvYWQgZW52IGZpbGUgYmFzZWQgb24gYG1vZGVgIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeS5cbiAgLy8gU2V0IHRoZSB0aGlyZCBwYXJhbWV0ZXIgdG8gJycgdG8gbG9hZCBhbGwgZW52IHJlZ2FyZGxlc3Mgb2YgdGhlIGBWSVRFX2AgcHJlZml4LlxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIHJldHVybiB7XG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgIC8vIEFkZCBGaXJlYmFzZSBhbGlhc2VzIHRvIGVuc3VyZSBjb3JyZWN0IHJlc29sdXRpb25cbiAgICAgICAgJ2ZpcmViYXNlL2FwcCc6IHJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL2ZpcmViYXNlL2FwcCcpLFxuICAgICAgICAnZmlyZWJhc2UvZmlyZXN0b3JlJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvZmlyZWJhc2UvZmlyZXN0b3JlJyksXG4gICAgICAgICdmaXJlYmFzZS9hdXRoJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvZmlyZWJhc2UvYXV0aCcpXG4gICAgICB9XG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2ZpcmViYXNlL2FwcCcsXG4gICAgICAgICdmaXJlYmFzZS9maXJlc3RvcmUnLFxuICAgICAgICAnZmlyZWJhc2UvYXV0aCdcbiAgICAgIF1cbiAgICB9LFxuICAgIHBsdWdpbnM6IFt2dWUoKV0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eToge1xuICAgICAgICAvLyBDb25maWd1cmFjaVx1MDBGM24gZGUgcHJveHkgcGFyYSBGaXJlYmFzZVxuICAgICAgICAnXi8oZmlyZXN0b3JlfGlkZW50aXR5dG9vbGtpdHxzZWN1cmV0b2tlbikvLionOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20nLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiB7XG4gICAgICAgICAgICBpZiAocGF0aC5zdGFydHNXaXRoKCcvZmlyZXN0b3JlJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgnL2ZpcmVzdG9yZScsICcvdjEvcHJvamVjdHMvcmFkaW9zYW50YW5hbm0tY2RhNjEvZGF0YWJhc2VzLyhkZWZhdWx0KS9kb2N1bWVudHMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gQ29uZmlndXJhY2lcdTAwRjNuIHBhcmEgYXV0ZW50aWNhY2lcdTAwRjNuXG4gICAgICAgICdeL19fL2F1dGgvLionOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9pZGVudGl0eXRvb2xraXQuZ29vZ2xlYXBpcy5jb20nLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvX19cXC9hdXRoXFwvLywgJycpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb3JzOiB7XG4gICAgICAgIG9yaWdpbjogdHJ1ZSwgLy8gUGVybWl0ZSB0b2RvcyBsb3Mgb3JcdTAwRURnZW5lc1xuICAgICAgICBjcmVkZW50aWFsczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgUEFUQ0gsIE9QVElPTlMnLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBBdXRob3JpemF0aW9uJ1xuICAgICAgfSxcbiAgICAgIGhtcjoge1xuICAgICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCdcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgZXh0ZXJuYWw6IFsuLi5idWlsdGluTW9kdWxlc10sXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZmlyZWJhc2UnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnZmlyZWJhc2UnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndnVlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci12dWUnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGJhc2U6ICcuLycsXG4gICAgZGVmaW5lOiB7XG4gICAgICAncHJvY2Vzcy5lbnYnOiBlbnYsXG4gICAgICBfX0FQUF9FTlZfXzogSlNPTi5zdHJpbmdpZnkoZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCcpXG4gICAgfVxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBQLFNBQVMsY0FBYyxlQUFlO0FBQ2hTLE9BQU8sU0FBUztBQUNoQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFBZ0gsSUFBTSwyQ0FBMkM7QUFLMU0sSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFHeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUE7QUFBQSxRQUVwRCxnQkFBZ0IsUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxRQUM5RCxzQkFBc0IsUUFBUSxrQ0FBVyxpQ0FBaUM7QUFBQSxRQUMxRSxpQkFBaUIsUUFBUSxrQ0FBVyw0QkFBNEI7QUFBQSxNQUNsRTtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLElBQ2YsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBO0FBQUEsUUFFTCxnREFBZ0Q7QUFBQSxVQUM5QyxRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsVUFDUixTQUFTLENBQUMsU0FBUztBQUNqQixnQkFBSSxLQUFLLFdBQVcsWUFBWSxHQUFHO0FBQ2pDLHFCQUFPLEtBQUssUUFBUSxjQUFjLGlFQUFpRTtBQUFBLFlBQ3JHO0FBQ0EsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBO0FBQUEsUUFFQSxnQkFBZ0I7QUFBQSxVQUNkLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxpQkFBaUIsRUFBRTtBQUFBLFFBQ3JEO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTTtBQUFBLFFBQ0osUUFBUTtBQUFBO0FBQUEsUUFDUixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsK0JBQStCO0FBQUEsUUFDL0IsZ0NBQWdDO0FBQUEsUUFDaEMsZ0NBQWdDO0FBQUEsTUFDbEM7QUFBQSxNQUNBLEtBQUs7QUFBQSxRQUNILFVBQVU7QUFBQSxRQUNWLE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsVUFBVSxDQUFDLEdBQUcsY0FBYztBQUFBLFFBQzVCLFFBQVE7QUFBQSxVQUNOLGNBQWMsQ0FBQyxPQUFPO0FBQ3BCLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0Isa0JBQUksR0FBRyxTQUFTLFVBQVUsR0FBRztBQUMzQix1QkFBTztBQUFBLGNBQ1Q7QUFDQSxrQkFBSSxHQUFHLFNBQVMsS0FBSyxHQUFHO0FBQ3RCLHVCQUFPO0FBQUEsY0FDVDtBQUNBLHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLGVBQWU7QUFBQSxNQUNmLGFBQWEsS0FBSyxVQUFVLElBQUksWUFBWSxhQUFhO0FBQUEsSUFDM0Q7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
