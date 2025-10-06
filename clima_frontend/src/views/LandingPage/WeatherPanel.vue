<template>
  <div class="weather-panel-container bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white border border-white/10 shadow-2xl max-w-screen-xl mx-auto">
    <!-- Header con ubicación actual -->
    <div class="flex justify-between items-center mb-6 sm:mb-8">
      <div class="flex items-center gap-2 sm:gap-4">
        <div class="text-2xl sm:text-3xl bg-white/10 p-2 sm:p-3 rounded-lg sm:rounded-xl">📍</div>
        <div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold m-0 text-white leading-tight">{{ currentLocation }}</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 mb-0">{{ currentDate }}</p>
        </div>
      </div>
      <div class="weather-icon-main text-4xl sm:text-5xl md:text-6xl flex-shrink-0">
        {{ weatherIcon }}
      </div>
    </div>

    <!-- Temperatura actual destacada -->
    <div class="current-weather flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10">
      <div class="flex items-start">
        <span class="text-6xl sm:text-7xl md:text-8xl font-bold leading-none text-white">{{ currentTemp }}</span>
        <span class="text-2xl sm:text-3xl font-light text-slate-400 ml-2">°C</span>
      </div>
      <div class="flex-1">
        <p class="text-xl sm:text-2xl font-semibold m-0 mb-1 sm:mb-2 text-white">{{ weatherCondition }}</p>
        <p class="text-sm sm:text-base text-slate-400 m-0">{{ t('weather.panel.feelsLike') }}: {{ feelsLike }}°</p>
      </div>
    </div>

    <!-- Métricas principales -->
    <div class="metrics-grid grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
      <div class="metric-card flex items-center gap-1.5 sm:gap-2 md:gap-3 p-2.5 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 transition-all duration-300 overflow-hidden">
        <div class="text-xl sm:text-2xl md:text-3xl bg-white/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">💨</div>
        <div class="flex-1 min-w-0 overflow-hidden">
          <p class="text-[10px] sm:text-xs text-slate-400 m-0 mb-0.5 leading-tight">{{ t('weather.panel.wind') }}</p>
          <p class="text-sm sm:text-base md:text-lg font-semibold text-white m-0 truncate leading-tight">{{ wind }} km/h</p>
        </div>
      </div>
      
      <div class="metric-card flex items-center gap-1.5 sm:gap-2 md:gap-3 p-2.5 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 transition-all duration-300 overflow-hidden">
        <div class="text-xl sm:text-2xl md:text-3xl bg-white/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">💧</div>
        <div class="flex-1 min-w-0 overflow-hidden">
          <p class="text-[10px] sm:text-xs text-slate-400 m-0 mb-0.5 leading-tight">{{ t('weather.panel.humidity') }}</p>
          <p class="text-sm sm:text-base md:text-lg font-semibold text-white m-0 truncate leading-tight">{{ humidity }}%</p>
        </div>
      </div>
      
      <div class="metric-card flex items-center gap-1.5 sm:gap-2 md:gap-3 p-2.5 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 transition-all duration-300 overflow-hidden">
        <div class="text-xl sm:text-2xl md:text-3xl bg-white/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">🌡️</div>
        <div class="flex-1 min-w-0 overflow-hidden">
          <p class="text-[10px] sm:text-xs text-slate-400 m-0 mb-0.5 leading-tight">{{ t('weather.panel.pressure') }}</p>
          <p class="text-sm sm:text-base md:text-lg font-semibold text-white m-0 truncate leading-tight">{{ pressure }} hPa</p>
        </div>
      </div>
      
      <div class="metric-card flex items-center gap-1.5 sm:gap-2 md:gap-3 p-2.5 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 transition-all duration-300 overflow-hidden">
        <div class="text-xl sm:text-2xl md:text-3xl bg-white/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">☀️</div>
        <div class="flex-1 min-w-0 overflow-hidden">
          <p class="text-[10px] sm:text-xs text-slate-400 m-0 mb-0.5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{{ t('weather.panel.uvRadiation') }}</p>
          <p class="text-sm sm:text-base md:text-lg font-semibold text-white m-0 truncate leading-tight">{{ uvIndex }}</p>
        </div>
      </div>
    </div>

    <!-- Pronóstico semanal -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-white m-0 mb-5">{{ t('weather.panel.weeklyForecast') }}</h3>
      
      <!-- Vista Desktop (grid) -->
      <div class="hidden lg:grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
        <div 
          v-for="day in forecast" 
          :key="day.day"
          class="forecast-day-card bg-white/5 rounded-2xl p-5 text-center border border-white/10 transition-all duration-300"
        >
          <p class="text-sm font-semibold text-slate-400 m-0 mb-3">{{ day.day }}</p>
          <div class="text-4xl my-3">{{ day.icon }}</div>
          <div class="flex justify-center gap-2 my-3">
            <span class="text-lg font-semibold text-white">{{ day.max }}°</span>
            <span class="text-lg text-slate-600">{{ day.min }}°</span>
          </div>
          <p class="text-xs text-slate-400 mt-2 mb-0">{{ day.condition }}</p>
        </div>
      </div>

      <!-- Vista Tablet/Mobile (carrusel) -->
      <div class="lg:hidden relative">
        <!-- Botones de navegación -->
        <button 
          @click="previousSlide"
          :disabled="currentSlide === 0"
          class="carousel-btn absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-2 transition-all duration-300 border border-white/20"
          :class="{ 'hover:scale-110': currentSlide !== 0 }"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <button 
          @click="nextSlide"
          :disabled="currentSlide >= maxSlide"
          class="carousel-btn absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-2 transition-all duration-300 border border-white/20"
          :class="{ 'hover:scale-110': currentSlide < maxSlide }"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Contenedor del carrusel -->
        <div class="overflow-hidden px-10">
          <div 
            class="flex transition-transform duration-500 ease-out gap-3"
            :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }"
          >
            <div 
              v-for="day in forecast" 
              :key="day.day"
              class="forecast-day-card bg-white/5 rounded-2xl p-4 text-center border border-white/10 flex-shrink-0"
              :class="cardsPerView === 3 ? 'w-[calc(33.333%-8px)]' : cardsPerView === 2 ? 'w-[calc(50%-6px)]' : 'w-full'"
            >
              <p class="text-sm font-semibold text-slate-400 m-0 mb-2">{{ day.day }}</p>
              <div class="text-3xl my-2">{{ day.icon }}</div>
              <div class="flex justify-center gap-2 my-2">
                <span class="text-base font-semibold text-white">{{ day.max }}°</span>
                <span class="text-base text-slate-600">{{ day.min }}°</span>
              </div>
              <p class="text-xs text-slate-400 mt-1 mb-0">{{ day.condition }}</p>
            </div>
          </div>
        </div>

        <!-- Indicadores de página -->
        <div class="flex justify-center gap-2 mt-4">
          <button
            v-for="(dot, index) in totalDots"
            :key="index"
            @click="goToSlide(index)"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 'bg-emerald-400 w-6' : 'bg-white/30 hover:bg-white/50'"
          ></button>
        </div>
      </div>
    </div>

    <!-- Gráfico de temperatura (Chart.js) -->
    <div class="mb-6 sm:mb-8">
      <h3 class="text-lg sm:text-xl font-semibold text-white m-0 mb-4 sm:mb-5">{{ t('weather.panel.hourlyTemperature') }}</h3>
      <div class="bg-white/[0.03] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 h-[250px] sm:h-[300px]">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Gráfico de lluvia -->
    <div class="mb-6 sm:mb-8">
      <h3 class="text-lg sm:text-xl font-semibold text-white m-0 mb-4 sm:mb-5">{{ t('weather.panel.rain') }} (mm)</h3>
      <div class="bg-white/[0.03] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 h-[250px] sm:h-[300px]">
        <Bar :data="rainChartData" :options="rainChartOptions" />
      </div>
    </div>

    <!-- Información adicional -->
    <div class="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
      <div class="info-row flex justify-between py-2 sm:py-3 border-b border-white/10">
        <span class="text-sm sm:text-base text-slate-400">☀️ {{ t('weather.panel.sunrise') }}:</span>
        <span class="text-sm sm:text-base font-semibold text-white">{{ sunrise }}</span>
      </div>
      <div class="info-row flex justify-between py-2 sm:py-3 border-b border-white/10">
        <span class="text-sm sm:text-base text-slate-400">🌙 {{ t('weather.panel.sunset') }}:</span>
        <span class="text-sm sm:text-base font-semibold text-white">{{ sunset }}</span>
      </div>
      <div class="flex justify-between py-2 sm:py-3">
        <span class="text-sm sm:text-base text-slate-400">☁️ {{ t('weather.panel.cloudCover') }}:</span>
        <span class="text-sm sm:text-base font-semibold text-white">{{ cloudiness }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import openWeatherService from '../../services/openWeatherService.js'

const { t } = useI18n()

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Props desde LandingPage
const props = defineProps({
  weatherData: {
    type: Object,
    default: null
  },
  selectedLocation: {
    type: Object,
    default: null
  }
})

// Datos reactivos con valores por defecto
const currentLocation = ref('Huánuco, Perú')
const currentDate = ref('Sábado, 5 de Octubre 2025')
const currentTemp = ref(17)
const feelsLike = ref(17)
const weatherCondition = ref('Parcialmente Nublado')
const weatherIcon = ref('🌤️')
const wind = ref('2')
const humidity = ref('79')
const pressure = ref('1018')
const uvIndex = ref(t('weather.uvLevels.low'))
const cloudiness = ref('14')
const sunrise = ref('05:45')
const sunset = ref('18:01')

// Pronóstico semanal (valores por defecto)
const forecast = ref([
  { day: 'Lun', icon: '☀️', max: 29, min: 13, condition: 'Soleado' },
  { day: 'Mar', icon: '🌤️', max: 27, min: 14, condition: 'Nublado' },
  { day: 'Mié', icon: '☁️', max: 24, min: 16, condition: 'Nublado' },
  { day: 'Jue', icon: '🌧️', max: 22, min: 14, condition: 'Lluvia' },
  { day: 'Vie', icon: '🌤️', max: 24, min: 15, condition: 'Nublado' },
  { day: 'Sáb', icon: '⛈️', max: 25, min: 14, condition: 'Tormenta' },
  { day: 'Dom', icon: '☁️', max: 25, min: 14, condition: 'Nublado' }
])

// Watch para actualizar cuando llegan nuevos datos del clima actual
watch(() => props.weatherData?.current, (newCurrent) => {
  if (newCurrent) {
    console.log('🔄 WeatherPanel: Actualizando datos del clima actual:', newCurrent)
    
    currentLocation.value = newCurrent.location || 'Ubicación desconocida'
    currentTemp.value = newCurrent.temperature || 0
    feelsLike.value = newCurrent.feelsLike || 0
    weatherCondition.value = newCurrent.description || 'N/A'
    weatherIcon.value = openWeatherService.getWeatherEmoji(newCurrent.icon) || '🌤️'
    wind.value = String(newCurrent.windSpeed || 0)
    humidity.value = String(newCurrent.humidity || 0)
    pressure.value = String(newCurrent.pressure || 0)
    cloudiness.value = String(newCurrent.cloudiness || 0)
    sunrise.value = newCurrent.sunrise || 'N/A'
    sunset.value = newCurrent.sunset || 'N/A'
    
      // UV Index - por ahora "Baja/Low" ya que el API básico no lo incluye
      uvIndex.value = t('weather.uvLevels.low')
    console.log('✅ WeatherPanel: Datos actualizados correctamente')
  }
}, { immediate: true, deep: true })

// Watch para actualizar el pronóstico semanal
watch(() => props.weatherData?.forecast, (newForecast) => {
  if (newForecast && Array.isArray(newForecast) && newForecast.length > 0) {
    console.log('🔄 WeatherPanel: Actualizando pronóstico semanal:', newForecast)
    
    forecast.value = newForecast.map(day => ({
      day: day.day || 'N/A',
      icon: openWeatherService.getWeatherEmoji(day.icon) || '🌤️',
      max: day.tempMax || 0,
      min: day.tempMin || 0,
      condition: day.description || 'N/A'
    }))
    
    console.log('✅ WeatherPanel: Pronóstico actualizado:', forecast.value)
  }
}, { immediate: true, deep: true })

// Watch para actualizar la fecha cuando cambia la ubicación
watch(() => props.selectedLocation, (newLocation) => {
  if (newLocation) {
    // Actualizar con la fecha actual
    const now = new Date()
    const dias = [
      t('weather.days.sunday'),
      t('weather.days.monday'),
      t('weather.days.tuesday'),
      t('weather.days.wednesday'),
      t('weather.days.thursday'),
      t('weather.days.friday'),
      t('weather.days.saturday')
    ]
    const meses = [
      t('weather.months.january'),
      t('weather.months.february'),
      t('weather.months.march'),
      t('weather.months.april'),
      t('weather.months.may'),
      t('weather.months.june'),
      t('weather.months.july'),
      t('weather.months.august'),
      t('weather.months.september'),
      t('weather.months.october'),
      t('weather.months.november'),
      t('weather.months.december')
    ]
    
    currentDate.value = `${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]} ${now.getFullYear()}`
  }
}, { immediate: true })

// Carrusel responsive
const currentSlide = ref(0)
const cardsPerView = ref(3) // 3 para tablet, 2 para móvil pequeño, 1 para muy pequeño

// Calcular valores del carrusel
const slideWidth = computed(() => {
  return 100 / cardsPerView.value
})

const maxSlide = computed(() => {
  return Math.max(0, forecast.value.length - cardsPerView.value)
})

const totalDots = computed(() => {
  return maxSlide.value + 1
})

// Funciones del carrusel
const nextSlide = () => {
  if (currentSlide.value < maxSlide.value) {
    currentSlide.value++
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Detectar tamaño de pantalla y ajustar cardsPerView
const updateCardsPerView = () => {
  const width = window.innerWidth
  if (width >= 768) {
    cardsPerView.value = 3 // Tablet
  } else if (width >= 480) {
    cardsPerView.value = 2 // Móvil grande
  } else {
    cardsPerView.value = 1 // Móvil pequeño
  }
  // Ajustar slide actual si es necesario
  if (currentSlide.value > maxSlide.value) {
    currentSlide.value = maxSlide.value
  }
}

onMounted(() => {
  updateCardsPerView()
  window.addEventListener('resize', updateCardsPerView)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCardsPerView)
})

// Datos para el gráfico de temperatura por hora
const chartData = computed(() => ({
  labels: ['08:00', '14:00', '20:00', '02:00', '08:00', '14:00', '20:00'],
  datasets: [
    {
      label: 'Temperatura (°C)',
      data: [20, 28, 18, 15, 19, 29, 18],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
}))

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#3b82f6',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#94a3b8',
        callback: function(value: any) {
          return value + '°'
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
})

// Datos para el gráfico de lluvia
const rainChartData = computed(() => ({
  labels: [
    t('weather.days.mondayShort'),
    t('weather.days.tuesdayShort'),
    t('weather.days.wednesdayShort'),
    t('weather.days.thursdayShort'),
    t('weather.days.fridayShort'),
    t('weather.days.saturdayShort'),
    t('weather.days.sundayShort')
  ],
  datasets: [
    {
      label: 'Lluvia (mm)',
      data: [0.1, 2.2, 3.1, 2.5, 1.5, 3.6, 0],
      backgroundColor: '#10b981',
      borderColor: '#059669',
      borderWidth: 1,
      borderRadius: 6
    }
  ]
}))

const rainChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#10b981',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#94a3b8',
        callback: function(value: any) {
          return value + ' mm'
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
})
</script>

<style scoped>
/* Efectos especiales que Tailwind no puede replicar completamente */
.weather-icon-main {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.current-weather {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2));
}

.metric-card {
  min-width: 0;
  max-width: 100%;
}

.metric-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.forecast-day-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.info-row:last-child {
  border-bottom: none;
}

/* Carrusel - Ocultar scrollbar */
.overflow-hidden {
  overflow: hidden;
}

/* Botones del carrusel con backdrop blur */
.carousel-btn {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.carousel-btn:hover:not(:disabled) {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Asegurar que las tarjetas del carrusel no se compriman */
.forecast-day-card {
  min-width: 0;
}

/* Responsive - Ajustes adicionales */
@media (max-width: 640px) {
  .weather-panel-container {
    padding: 16px !important;
  }
  
  /* Asegurar que las métricas no se desborden en móviles muy pequeños */
  .metric-card {
    min-height: 70px;
  }
}

@media (max-width: 380px) {
  /* Para móviles muy pequeños (iPhone SE, etc) */
  .weather-panel-container {
    padding: 12px !important;
  }
  
  .metric-card {
    min-height: 65px;
  }
}

/* Layout adaptativo según ancho del contenedor */
/* Cuando el panel está abajo del mapa (pantalla completa) - 4 columnas */
@media (min-width: 768px) and (max-width: 1399px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Cuando el panel está en el lateral (pantallas muy grandes) - mantener 2x2 */
@media (min-width: 1400px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Reducir espaciado vertical cuando está en sidebar */
  .weather-panel-container {
    padding: 1rem 1.5rem !important;
  }
  
  /* Reducir márgenes entre secciones */
  .weather-panel-container > div {
    margin-bottom: 1rem !important;
  }
  
  /* Header más compacto */
  .weather-panel-container > div:first-child {
    margin-bottom: 1rem !important;
  }
  
  /* Temperatura actual más compacta */
  .current-weather {
    padding: 1rem !important;
    margin-bottom: 1rem !important;
  }
  
  /* Métricas más compactas */
  .metrics-grid {
    gap: 0.5rem !important;
    margin-bottom: 1rem !important;
  }
  
  .metric-card {
    padding: 0.625rem !important;
  }
  
  /* Pronóstico semanal más compacto */
  .weather-panel-container > div:nth-child(4) {
    margin-bottom: 1rem !important;
  }
  
  .weather-panel-container > div:nth-child(4) h3 {
    margin-bottom: 0.75rem !important;
  }
  
  .forecast-day-card {
    padding: 0.875rem !important;
  }
  
  /* Gráfico más compacto */
  .weather-panel-container > div:last-child {
    margin-bottom: 0 !important;
  }
  
  .weather-panel-container > div:last-child h3 {
    margin-bottom: 0.75rem !important;
  }
}
</style>
