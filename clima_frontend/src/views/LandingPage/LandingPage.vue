<template>
    <div class="landing-root">
        <!-- DarkVeil as full-bleed background -->
        <DarkVeil
            class="background-veil"
            :hue-shift="0"
            :noise-intensity="0"
            :scanline-intensity="0"
            :speed="0.5"
            :scanline-frequency="0"
            :warp-amount="0"
            :resolution-scale="1"
        />
        <div class="landing-container">
            <!-- Componente del mapa -->
            <div class="map-wrapper">
                <OpenStreetMap 
                    @weather-data-loaded="handleWeatherDataLoaded"
                    @location-selected="handleLocationSelected"
                />
            </div>

            <!-- Panel de información del clima (collapsable) -->
            <transition name="slide-fade">
                <div v-if="showWeatherPanel" class="weather-panel-wrapper">
                    <WeatherPanel 
                        :weather-data="weatherData"
                        :selected-location="selectedLocation"
                    />
                </div>
            </transition>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import OpenStreetMap from './OpenStreetMap.vue'
import WeatherPanel from './WeatherPanel.vue'
import DarkVeil from '../DarkVeil.vue'

// Estado para almacenar los datos del clima
const weatherData = ref<any>(null)
const selectedLocation = ref<any>(null)

// Computed para saber si el panel debe mostrarse
const showWeatherPanel = computed(() => {
    return weatherData.value !== null && weatherData.value.current !== undefined
})

// Handlers para eventos del mapa
const handleWeatherDataLoaded = (data: any) => {
    console.log('🌍 LandingPage: Datos del clima recibidos:', data)
    weatherData.value = data
}

const handleLocationSelected = (location: any) => {
    console.log('📍 LandingPage: Ubicación seleccionada:', location)
    selectedLocation.value = location
}
</script>

<style scoped>
.landing-root {
    min-height: 100vh;
    color: #fff;
    position: relative;
    background: #0e0e0e; /* fallback if DarkVeil is not available */
    overflow: hidden;
}

.background-veil {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* size responsive but constrained so the veil looks centered */
    width: min(1100px, 90vw);
    height: min(700px, 70vh);
    z-index: 0;
    pointer-events: none; /* allow clicks through to map */
    opacity: 0.98;
}

.landing-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 0;
    position: relative;
    z-index: 2; /* content above the DarkVeil */
}

.map-wrapper {
    width: 100%;
}

.weather-panel-wrapper {
    width: 100%;
    padding: 0 20px 40px 20px;
}

/* Responsive para pantallas grandes: mapa y panel lado a lado */
@media (min-width: 1400px) {
    .landing-container {
        flex-direction: row;
        gap: 32px;
        padding: 0 20px;
    }

    .map-wrapper {
        flex: 1;
        min-width: 0;
    }

    .weather-panel-wrapper {
        flex: 0 0 500px;
        padding: 40px 20px;
        max-height: 100vh;
        overflow-y: auto;
    }

    .weather-panel-wrapper::-webkit-scrollbar {
        width: 8px;
    }

    .weather-panel-wrapper::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
    }

    .weather-panel-wrapper::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
    }

    .weather-panel-wrapper::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }
}

/* Para tablets y móviles */
@media (max-width: 768px) {
    .weather-panel-wrapper {
        padding: 0 16px 32px 16px;
    }
}

/* Transiciones para el panel collapsable */
.slide-fade-enter-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

/* En móvil, deslizar desde abajo */
@media (max-width: 1399px) {
    .slide-fade-enter-from {
        transform: translateY(50px);
        opacity: 0;
    }
    
    .slide-fade-leave-to {
        transform: translateY(50px);
        opacity: 0;
    }
}
</style>