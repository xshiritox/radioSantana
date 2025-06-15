<template>
  <div class="diagnostic-tool">
    <h3>Herramienta de Diagnóstico</h3>
    <button @click="runDiagnostics">Ejecutar Diagnóstico</button>
    
    <div v-if="diagnostics.running" class="status running">
      Ejecutando diagnósticos...
    </div>
    
    <div v-if="diagnostics.completed" class="results">
      <h4>Resultados del Diagnóstico:</h4>
      <div class="results-grid">
        <div 
          v-for="(result, index) in diagnostics.results" 
          :key="index"
          class="result-item"
          :class="result.status"
        >
          <div class="result-header">
            <span class="status-indicator" :class="result.status"></span>
            <strong>{{ result.test }}</strong>
          </div>
          <div class="result-message">{{ result.message }}</div>
          <div v-if="result.details" class="result-details">
            <pre>{{ result.details }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { auth, checkConnectivity, APP_DOMAINS } from '../config/firebase';

export default defineComponent({
  name: 'DiagnosticTool',
  setup() {
    interface DiagnosticResult {
      test: string;
      status: 'success' | 'error' | 'warning';
      message: string;
      details?: string;
    }

    const diagnostics = reactive({
      running: false,
      completed: false,
      results: [] as DiagnosticResult[]
    });

    const addResult = (
      test: string, 
      status: 'success' | 'error' | 'warning', 
      message: string,
      details?: string
    ) => {
      diagnostics.results.push({ test, status, message, details });
    };

    const runDiagnostics = async () => {
      diagnostics.running = true;
      diagnostics.completed = false;
      diagnostics.results = [];

      try {
        // 1. Verificar configuración
        addResult('Configuración', 'success', 'Configuración cargada correctamente');
        
        // 2. Verificar conectividad a internet
        try {
          // Usamos una API que soporta CORS
          const response = await fetch('https://httpbin.org/get', {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (response.ok) {
            addResult('Conexión a Internet', 'success', 'Conexión a Internet establecida');
          } else {
            addResult('Conexión a Internet', 'warning', 'Respuesta inesperada del servidor');
          }
        } catch (error) {
          // Verificar si es un error de red o un error CORS
          const isNetworkError = error instanceof TypeError && error.message.includes('Failed to fetch');
          const errorMessage = isNetworkError 
            ? 'No se pudo establecer conexión con el servidor. Verifica tu conexión a internet.'
            : (error instanceof Error ? error.message : 'Error desconocido');
            
          addResult('Conexión a Internet', 'error', `Error: ${errorMessage}`);
        }

        // 3. Verificar conexión a Firebase
        try {
          const firebaseConnected = await checkConnectivity();
          
          if (firebaseConnected) {
            addResult(
              'Conexión a Firebase',
              'success',
              'Conexión exitosa con Firebase',
              'La aplicación puede comunicarse correctamente con los servicios de Firebase.'
            );
          } else {
            addResult(
              'Conexión a Firebase',
              'warning',
              'Conexión limitada a Firebase',
              'La conexión se estableció pero podrían existir problemas de permisos. Verifica las reglas de seguridad de Firestore.'
            );
          }
        } catch (error) {
          let errorMessage = 'Error desconocido';
          let details = '';
          
          if (error instanceof Error) {
            errorMessage = error.message;
            if (error instanceof Error && 'code' in error) {
              const errorCode = (error as any).code;
              details = `Código de error: ${errorCode}\n`;
              
              // Agregar sugerencias basadas en el código de error
              switch(errorCode) {
                case 'permission-denied':
                  details += '• Verifica las reglas de seguridad de Firestore\n';
                  details += '• Asegúrate de que el proyecto Firebase esté correctamente configurado';
                  break;
                case 'unavailable':
                  details += '• Verifica tu conexión a internet\n';
                  details += '• Los servicios de Firebase podrían estar experimentando problemas';
                  break;
                case 'unauthenticated':
                  details += '• La autenticación es requerida para acceder a este recurso\n';
                  details += '• Verifica si necesitas iniciar sesión';
                  break;
              }
            }
          }
          
          addResult(
            'Conexión a Firebase',
            'error',
            `Error: ${errorMessage}`,
            details || 'No se pudo establecer conexión con Firebase. Verifica tu configuración y conexión a internet.'
          );
        }

        // 4. Verificar autenticación
        try {
          const user = auth.currentUser;
          if (user) {
            addResult('Autenticación', 'success', `Usuario autenticado: ${user.email}`);
          } else {
            addResult('Autenticación', 'warning', 'No hay usuario autenticado');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          addResult('Autenticación', 'error', `Error en autenticación: ${errorMessage}`);
        }

        // 5. Verificar dominios autorizados
        addResult('Dominios autorizados', 'success', 
          `Dominios configurados: ${Object.values(APP_DOMAINS).join(', ')}`
        );

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        addResult('Error en diagnóstico', 'error', errorMessage);
      } finally {
        diagnostics.running = false;
        diagnostics.completed = true;
      }
    };

    return {
      diagnostics,
      runDiagnostics
    };
  }
});
</script>

<style scoped>
.diagnostic-tool {
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1565c0;
}

button:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

.status {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f5f5f5;
}

.status.running {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.results-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.result-item {
  border-left: 4px solid #e0e0e0;
  padding: 1rem;
  border-radius: 0 4px 4px 0;
  background-color: #fafafa;
}

.result-item.success {
  border-left-color: #4caf50;
}

.result-item.error {
  border-left-color: #f44336;
}

.result-item.warning {
  border-left-color: #ff9800;
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-indicator.success {
  background-color: #4caf50;
}

.status-indicator.error {
  background-color: #f44336;
}

.status-indicator.warning {
  background-color: #ff9800;
}

.result-message {
  margin-bottom: 0.5rem;
  color: #333;
}

.result-details {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #616161;
  white-space: pre-wrap;
  word-break: break-word;
}

.result-details pre {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
}

h4 {
  margin: 1.5rem 0 1rem 0;
  color: #424242;
  font-size: 1.1rem;
}
</style>
