<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { testInternetConnectivity, testFirebaseConnectivity } from '../utils/connectivityTest';

interface StatusDetail {
  url: string;
  success: boolean;
  status?: number;
  statusText?: string;
  responseTime: number;
  responseSize?: number;
  responseBody?: string;
  error?: string;
  errorName?: string;
  isTimeout?: boolean;
  headers?: Record<string, string>;
  timestamp?: string;
}

const internetStatus = ref({
  loading: true,
  connected: false,
  error: '' as string | undefined,
  details: [] as StatusDetail[],
  lastChecked: ''
});

const firebaseStatus = ref({
  loading: true,
  connected: false,
  status: 0,
  error: '' as string | undefined,
  details: [] as StatusDetail[],
  lastChecked: ''
});

const showDetails = ref({
  internet: false,
  firebase: false
});

const formatTime = (date: Date) => {
  return date.toLocaleTimeString();
};

const checkConnectivity = async () => {
  const now = new Date();
  const timestamp = formatTime(now);
  
  // Reset status
  internetStatus.value = { 
    ...internetStatus.value, 
    loading: true, 
    connected: false, 
    error: '',
    lastChecked: timestamp
  };
  
  firebaseStatus.value = { 
    ...firebaseStatus.value,
    loading: true, 
    connected: false, 
    status: 0, 
    error: '',
    lastChecked: timestamp
  };

  try {
    // Test internet connectivity
    const internetResult = await testInternetConnectivity();
    internetStatus.value = {
      ...internetStatus.value,
      loading: false,
      connected: internetResult.success,
      error: internetResult.error,
      details: internetResult.details,
      lastChecked: timestamp
    };

    // Test Firebase connectivity
    const firebaseResult = await testFirebaseConnectivity();
    firebaseStatus.value = {
      ...firebaseStatus.value,
      loading: false,
      connected: firebaseResult.success,
      status: firebaseResult.success ? 200 : 0,
      error: firebaseResult.error,
      details: firebaseResult.details,
      lastChecked: timestamp
    };
    
  } catch (error) {
    console.error('Error checking connectivity:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (!internetStatus.value.connected) {
      internetStatus.value = {
        ...internetStatus.value,
        loading: false,
        connected: false,
        error: `Error: ${errorMessage}`,
        lastChecked: timestamp
      };
    }
    
    firebaseStatus.value = {
      ...firebaseStatus.value,
      loading: false,
      connected: false,
      status: 0,
      error: `Error: ${errorMessage}`,
      lastChecked: timestamp
    };
  }
};

const toggleDetails = (type: 'internet' | 'firebase') => {
  showDetails.value[type] = !showDetails.value[type];
};

// Check connectivity on component mount
onMounted(() => {
  checkConnectivity();
  
  // Check connectivity every 30 seconds
  const interval = setInterval(checkConnectivity, 30000);
  
  // Cleanup interval on component unmount
  return () => clearInterval(interval);
});
</script>

<template>
  <div class="fixed bottom-4 left-4 z-50">
    <div class="bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-xl max-w-md">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-bold">Estado de conexión</h3>
        <span class="text-xs text-gray-400">
          {{ new Date().toLocaleTimeString() }}
        </span>
      </div>
      
      <div class="space-y-3">
        <!-- Internet Status -->
        <div class="bg-gray-900 bg-opacity-50 rounded p-3">
          <div class="flex items-center cursor-pointer" @click="toggleDetails('internet')">
            <div 
              class="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              :class="{
                'bg-green-500': internetStatus.connected,
                'bg-red-500': !internetStatus.connected && !internetStatus.loading,
                'bg-yellow-500': internetStatus.loading,
                'animate-pulse': internetStatus.loading
              }"
            ></div>
            <div class="flex-1">
              <div class="font-medium flex justify-between">
                <span>Internet</span>
                <span class="text-xs font-normal text-gray-400">
                  {{ internetStatus.lastChecked }}
                </span>
              </div>
              <div class="text-xs text-gray-300">
                <template v-if="internetStatus.loading">Verificando conexión...</template>
                <template v-else>
                  <div>
                    {{ internetStatus.connected ? '✅ Conectado' : '❌ Sin conexión' }}
                    <span v-if="internetStatus.error" class="text-red-400"> - {{ internetStatus.error }}</span>
                  </div>
                </template>
              </div>
            </div>
            <ChevronDownIcon 
              class="h-4 w-4 text-gray-400 transition-transform duration-200"
              :class="{ 'transform rotate-180': showDetails.internet }"
            />
          </div>
          
          <!-- Internet Details -->
          <div v-if="showDetails.internet" class="mt-2 pt-2 border-t border-gray-700 text-xs">
            <div v-if="internetStatus.details?.length" class="space-y-2">
              <div v-for="(test, index) in internetStatus.details" :key="index" class="p-2 bg-gray-800 rounded">
                <div class="font-medium">{{ test.url }}</div>
                <div :class="{
                  'text-green-400': test.success,
                  'text-red-400': !test.success
                }">
                  {{ test.success ? '✅ ' : '❌ ' }}
                  {{ test.status || 'Error' }}
                  <span v-if="test.statusText"> - {{ test.statusText }}</span>
                </div>
                <div v-if="test.responseTime" class="text-gray-400 text-xs">
                  {{ test.responseTime }}ms
                  <span v-if="test.responseSize"> • {{ test.responseSize }} bytes</span>
                </div>
                <div v-if="test.error" class="text-red-300 text-xs mt-1">
                  {{ test.error }}
                </div>
              </div>
            </div>
            <div v-else class="text-gray-400 italic">
              No hay detalles disponibles
            </div>
          </div>
        </div>
        
        <!-- Firebase Status -->
        <div class="bg-gray-900 bg-opacity-50 rounded p-3">
          <div class="flex items-center cursor-pointer" @click="toggleDetails('firebase')">
            <div 
              class="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              :class="{
                'bg-green-500': firebaseStatus.connected,
                'bg-yellow-500': !firebaseStatus.connected && firebaseStatus.status >= 400 && firebaseStatus.status < 500,
                'bg-red-500': !firebaseStatus.connected && (!firebaseStatus.status || firebaseStatus.status >= 500),
                'bg-gray-500': firebaseStatus.loading,
                'animate-pulse': firebaseStatus.loading
              }"
            ></div>
            <div class="flex-1">
              <div class="font-medium flex justify-between">
                <span>Firebase</span>
                <span class="text-xs font-normal text-gray-400">
                  {{ firebaseStatus.lastChecked }}
                </span>
              </div>
              <div class="text-xs text-gray-300">
                <template v-if="firebaseStatus.loading">Verificando conexión...</template>
                <template v-else>
                  <div>
                    <template v-if="firebaseStatus.connected">
                      ✅ Conectado
                    </template>
                    <template v-else>
                      ❌ Error de conexión
                      <span v-if="firebaseStatus.status">({{ firebaseStatus.status }})</span>
                    </template>
                    <span v-if="firebaseStatus.error" class="text-red-400"> - {{ firebaseStatus.error }}</span>
                  </div>
                </template>
              </div>
            </div>
            <ChevronDownIcon 
              class="h-4 w-4 text-gray-400 transition-transform duration-200"
              :class="{ 'transform rotate-180': showDetails.firebase }"
            />
          </div>
          
          <!-- Firebase Details -->
          <div v-if="showDetails.firebase" class="mt-2 pt-2 border-t border-gray-700 text-xs">
            <div v-if="firebaseStatus.details?.length" class="space-y-2">
              <div v-for="(test, index) in firebaseStatus.details" :key="index" class="p-2 bg-gray-800 rounded">
                <div class="font-medium">{{ test.url }}</div>
                <div :class="{
                  'text-green-400': test.status && test.status < 400,
                  'text-yellow-400': test.status && test.status >= 400 && test.status < 500,
                  'text-red-400': !test.status || test.status >= 500
                }">
                  {{ test.success ? '✅ ' : '❌ ' }}
                  {{ test.status || 'Error' }}
                  <span v-if="test.statusText"> - {{ test.statusText }}</span>
                </div>
                <div v-if="test.responseTime" class="text-gray-400 text-xs">
                  {{ test.responseTime }}ms
                  <span v-if="test.responseSize"> • {{ test.responseSize }} bytes</span>
                </div>
                <div v-if="test.error" class="text-red-300 text-xs mt-1">
                  {{ test.error }}
                </div>
              </div>
            </div>
            <div v-else class="text-gray-400 italic">
              No hay detalles disponibles
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-3 flex justify-between items-center">
        <button 
          @click="checkConnectivity"
          class="text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
          :disabled="internetStatus.loading || firebaseStatus.loading"
        >
          <ArrowPathIcon class="h-3 w-3 mr-1" :class="{ 'animate-spin': internetStatus.loading || firebaseStatus.loading }" />
          Reintentar
        </button>
        
        <div class="text-xs text-gray-400">
          <button 
            v-if="!showDetails.internet || !showDetails.firebase"
            @click="showDetails = { internet: true, firebase: true }"
            class="hover:text-blue-400 mr-2"
          >
            Ver detalles
          </button>
          <button 
            v-else
            @click="showDetails = { internet: false, firebase: false }"
            class="hover:text-blue-400"
          >
            Ocultar detalles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ChevronDownIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    ChevronDownIcon,
    ArrowPathIcon
  }
}
</script>
