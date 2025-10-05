<template>
  <div class="example-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">
        Ejemplo de Integración
      </h1>

      <!-- Sección de Iconos -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles :size="28" class="text-yellow-500" />
          Iconos Lucide
        </h2>
        <IconShowcase />
      </section>

      <!-- Sección de Gráficos -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp :size="28" class="text-green-500" />
          Gráficos con Chart.js
        </h2>
        <div class="h-96">
          <WeatherChart
            title="Temperatura de la Semana"
            :labels="chartLabels"
            :data="chartData"
            label="Temperatura (°C)"
          />
        </div>
      </section>

      <!-- Sección de Tailwind CSS -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Palette :size="28" class="text-purple-500" />
          Tailwind CSS Ejemplos
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Tarjeta 1 -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <CloudRain :size="48" class="mb-4" />
            <h3 class="text-xl font-bold mb-2">Clima Lluvioso</h3>
            <p class="text-blue-100">Probabilidad de lluvia: 80%</p>
          </div>

          <!-- Tarjeta 2 -->
          <div class="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
            <Sun :size="48" class="mb-4" />
            <h3 class="text-xl font-bold mb-2">Día Soleado</h3>
            <p class="text-yellow-100">Temperatura: 28°C</p>
          </div>

          <!-- Tarjeta 3 -->
          <div class="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl shadow-lg p-6 text-white">
            <Cloud :size="48" class="mb-4" />
            <h3 class="text-xl font-bold mb-2">Nublado</h3>
            <p class="text-gray-300">Visibilidad: Moderada</p>
          </div>
        </div>
      </section>

      <!-- Sección de Estado con Pinia -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Database :size="28" class="text-indigo-500" />
          Estado con Pinia
        </h2>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="mb-4">
            <p class="text-gray-700 mb-2">
              <strong>Autenticado:</strong> 
              <span :class="authStore.isAuthenticated ? 'text-green-600' : 'text-red-600'">
                {{ authStore.isAuthenticated ? 'Sí' : 'No' }}
              </span>
            </p>
            <p class="text-gray-700 mb-2">
              <strong>Usuario:</strong> {{ authStore.userName || 'No hay usuario' }}
            </p>
            <p class="text-gray-700">
              <strong>Ubicación seleccionada:</strong> {{ weatherStore.selectedLocation || 'Ninguna' }}
            </p>
          </div>
          
          <button
            @click="testStores"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw :size="20" />
            Probar Stores
          </button>
        </div>
      </section>

      <!-- Sección de API -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Wifi :size="28" class="text-teal-500" />
          Conexión con Backend (Django)
        </h2>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <p class="text-gray-700 mb-4">
            <strong>URL de API:</strong> 
            <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ apiUrl }}</code>
          </p>
          
          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">
              Probar endpoint:
            </label>
            <div class="flex gap-2">
              <input
                v-model="testEndpoint"
                type="text"
                placeholder="/auth/user/"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                @click="testApi"
                :disabled="loading"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Cargando...' : 'Probar' }}
              </button>
            </div>
          </div>

          <div v-if="apiResponse" class="bg-gray-50 rounded-lg p-4 overflow-auto max-h-64">
            <p class="text-sm text-gray-600 mb-2">Respuesta:</p>
            <pre class="text-xs">{{ apiResponse }}</pre>
          </div>

          <div v-if="apiError" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p class="text-red-700">{{ apiError }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useWeatherStore } from '@/store/weather';
import IconShowcase from '@/components/IconShowcase.vue';
import WeatherChart from '@/components/WeatherChart.vue';
import api from '@/services/api';
import { handleApiError } from '@/utils/helpers';
import {
  Sparkles,
  TrendingUp,
  Palette,
  Database,
  Wifi,
  CloudRain,
  Sun,
  Cloud,
  RefreshCw
} from 'lucide-vue-next';

// Stores
const authStore = useAuthStore();
const weatherStore = useWeatherStore();

// Datos para el gráfico
const chartLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const chartData = [22, 25, 23, 28, 26, 24, 27];

// API
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const testEndpoint = ref('/auth/user/');
const loading = ref(false);
const apiResponse = ref(null);
const apiError = ref(null);

// Probar stores
const testStores = () => {
  console.log('Auth Store:', authStore);
  console.log('Weather Store:', weatherStore);
  alert('Revisa la consola para ver el estado de los stores');
};

// Probar API
const testApi = async () => {
  loading.value = true;
  apiResponse.value = null;
  apiError.value = null;

  try {
    const response = await api.get(testEndpoint.value);
    apiResponse.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    apiError.value = handleApiError(error);
    console.error('Error en la petición:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.example-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);
}
</style>
