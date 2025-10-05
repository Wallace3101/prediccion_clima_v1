<template>
    <div class="section-hero-wrapper">
        <div class="map-section relative overflow-hidden min-h-[500px]">
            <section id="weather-map"
                class="relative py-6 overflow-hidden">
                <!-- Fondo mejorado con efectos glassmorphism -->
                <div class="absolute inset-0 enhanced-gradient"></div>

                <!-- Elementos decorativos con movimiento sutil -->
                <div class="absolute inset-0 z-0 opacity-20">
                    <div
                        class="absolute top-16 left-16 w-40 h-40 bg-emerald-300/30 rounded-full blur-3xl animate-float-slow">
                    </div>
                    <div
                        class="absolute bottom-10 right-20 w-56 h-56 bg-teal-300/25 rounded-full blur-3xl animate-float-reverse">
                    </div>
                    <div
                        class="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl animate-float">
                    </div>
                    <div
                        class="absolute top-1/4 left-1/3 w-24 h-24 bg-teal-200/25 rounded-full blur-xl animate-pulse-slow">
                    </div>
                </div>

                <div class="container mx-auto px-4 py-2 relative z-10">
                    <!-- Header mejorado con efectos -->
                    <div ref="titleRef" class="text-center mb-2 animate-on-scroll">
                        <div class="inline-block relative">
                            <h2 class="section-title mb-0">
                            <SplitText
                                text="ClimaMapa Huánuco"
                                class-name="text-3xl font-semibold text-center leading-tight"
                                :delay="100"
                                :duration="0.6"
                                ease="power3.out"
                                split-type="chars"
                                :from="{ opacity: 0, y: 40 }"
                                :to="{ opacity: 1, y: 0 }"
                                :threshold="0.1"
                                root-margin="-100px"
                                text-align="center"
                                @animation-complete="handleAnimationComplete"
                              />
                            </h2>
                            <p class="text-primary text-lg mt-0 mb-0 leading-tight">Tu pronóstico interactivo del clima</p>
                            <!-- Elemento decorativo detrás del título -->
                            <div class="absolute -top-4 -left-4 w-full h-full blur-sm -z-10"></div>
                        </div>
                        <div class="flex items-center justify-center gap-2 flex-wrap mt-1">
                        <p class="text-sm text-slate-400 mb-0">👆 Haz clic en el mapa para ver el clima en cualquier punto</p>
                        <RotatingText
                        :texts="['Soleado', 'Lluvioso', 'Nublado', 'Templado', 'Fresco', 'Variado']"
                        mainClassName="px-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold overflow-hidden py-1 justify-center rounded-lg inline-flex shadow-lg"
                        staggerFrom="last"
                        :initial="{ y: '100%' }"
                        :animate="{ y: 0 }"
                        :exit="{ y: '-120%' }"
                        :staggerDuration="0.025"
                        splitLevelClassName="overflow-hidden pb-0.5"
                        :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
                        :rotationInterval="4000"
                        />
                        </div>
                    </div>

                    <!-- Barra de búsqueda mejorada -->
                    <div ref="searchRef" class="search-container max-w-[650px] mx-auto mb-4 animate-on-scroll">
                        <div class="search-enhanced rounded-2xl p-1 transition-all duration-300 hover:shadow-xl group">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <svg class="w-5 h-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input v-model="searchQuery" type="text"
                                    placeholder="Buscar ubicación por nombre o condición climática..." class="w-full pl-12 pr-4 py-4 bg-transparent border-0 rounded-xl 
                        text-slate-700 placeholder-slate-400
                        focus:outline-none focus:ring-0 
                        text-base font-medium" />
                                <!-- Indicador de resultados -->
                                <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <span
                                        class="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                                        {{ filteredLocations.length }} encontradas
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contenedor del mapa mejorado -->
                    <div ref="mapRef" class="map-container-enhanced relative animate-on-scroll">
                        <!-- Mapa principal -->
                        <div ref="mapContainer" class="map-display h-[600px] w-full rounded-3xl overflow-hidden 
                        shadow-2xl border border-white/50 relative z-10"></div>

                        <!-- Panel de controles mejorado con tooltips -->
                        <div class="controls-panel absolute top-4 right-4 z-20 flex flex-col gap-2">
                            <!-- Botón de ubicación -->
                            <button @click="showUserLocation" :disabled="!isSecureContext || showingUserLocation"
                                class="control-button location-btn group relative w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div class="control-tooltip">
                                    {{ showingUserLocation ? 'Obteniendo ubicación...' : 'Mi ubicación' }}
                                </div>
                                <div class="flex items-center justify-center">
                                    <svg v-if="!showingUserLocation"
                                        class="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                                        </path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <div v-else
                                        class="animate-spin w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full">
                                    </div>
                                </div>
                            </button>

                            <!-- Botón ubicación más cercana -->
                            <button v-if="userLocation" @click="findAndShowNearest"
                                class="control-button nearest-btn group relative w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div class="control-tooltip">
                                    Ubicación más cercana
                                </div>
                                <div class="flex items-center justify-center">
                                    <svg class="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </div>
                            </button>

                            <!-- Botón ver todas -->
                            <button @click="centerAllLocations"
                                class="control-button center-btn group relative w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div class="control-tooltip">
                                    Ver todas las ubicaciones
                                </div>
                                <div class="flex items-center justify-center">
                                    <svg class="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4">
                                        </path>
                                    </svg>
                                </div>
                            </button>

                            <!-- Contador de ubicaciones compacto -->
                            <div
                                class="w-12 px-2 py-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg text-center">
                                <div class="text-sm font-bold text-emerald-600">{{ filteredLocations.length }}</div>
                                <div class="text-[10px] text-slate-500 leading-none">{{ filteredLocations.length === 1
                                    ? 'Loc.' : 'Locs.' }}</div>
                            </div>
                        </div>

                        <!-- Loading mejorado -->
                        <div v-if="loading" class="loading-overlay absolute inset-0 bg-white/95 backdrop-blur-sm 
                        flex flex-col items-center justify-center z-30 rounded-3xl">
                            <div class="loading-spinner relative">
                                <div
                                    class="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin">
                                </div>
                                <div
                                    class="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-teal-600 rounded-full animate-spin animate-reverse">
                                </div>
                            </div>
                            <p class="mt-6 text-slate-600 font-medium">Cargando mapa y ubicaciones...</p>
                            <p class="mt-2 text-sm text-slate-400">Esto puede tomar unos segundos</p>
                        </div>

                        <!-- Leyenda mejorada -->
                        <div :class="[
                            'legend-enhanced absolute bottom-6 left-6 z-20 transition-all duration-500 ease-out',
                            legendMinimized
                                ? 'w-14 h-14 rounded-2xl cursor-pointer hover:scale-105'
                                : 'rounded-3xl min-w-[200px]'
                        ]" @click="legendMinimized && expandLegend()">
                            <!-- Contenido completo de la leyenda -->
                            <div v-if="!legendMinimized" class="floating-element p-5">
                                <div class="flex items-center justify-between mb-4">
                                    <h4 class="font-bold text-slate-800 text-lg">Leyenda</h4>
                                    <button @click.stop="minimizeLegend" class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 
                          transition-all duration-200 p-2 rounded-xl group" title="Minimizar leyenda">
                                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M20 12H4"></path>
                                        </svg>
                                    </button>
                                </div>

                                <ul class="space-y-3">
                                    <li class="flex items-center space-x-3 group">
                                        <div class="legend-dot w-4 h-4 rounded-full shadow-sm"
                                            style="background-color: #ef4444;"></div>
                                        <span
                                            class="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Caliente (≥28°C)</span>
                                    </li>
                                    <li class="flex items-center space-x-3 group">
                                        <div class="legend-dot w-4 h-4 rounded-full shadow-sm"
                                            style="background-color: #f59e0b;"></div>
                                        <span
                                            class="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Templado (22-27°C)</span>
                                    </li>
                                    <li class="flex items-center space-x-3 group">
                                        <div class="legend-dot w-4 h-4 rounded-full shadow-sm"
                                            style="background-color: #10b981;"></div>
                                        <span
                                            class="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Agradable (18-21°C)</span>
                                    </li>
                                    <li class="flex items-center space-x-3 group">
                                        <div class="legend-dot w-4 h-4 rounded-full shadow-sm"
                                            style="background-color: #3b82f6;"></div>
                                        <span
                                            class="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Fresco (12-17°C)</span>
                                    </li>
                                    <li class="flex items-center space-x-3 group">
                                        <div class="legend-dot w-4 h-4 rounded-full shadow-sm"
                                            style="background-color: #8b5cf6;"></div>
                                        <span
                                            class="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Frío (<12°C)</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Vista minimizada mejorada -->
                            <div v-else class="floating-element w-14 h-14 flex items-center justify-center group"
                                title="Expandir leyenda">
                                <svg class="w-6 h-6 text-slate-600 group-hover:text-emerald-600 group-hover:scale-110 transition-all"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                                    </path>
                                </svg>
                            </div>
                        </div>

                        <!-- Indicador de filtros activos -->
                        <div v-if="searchQuery" class="filter-indicator absolute top-6 left-6 z-20">
                            <div class="floating-element px-4 py-2 rounded-2xl flex items-center gap-2">
                                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                                    </path>
                                </svg>
                                <span class="text-sm font-medium text-slate-700">Filtros activos</span>
                            </div>
                        </div>
                        <!-- Panel para mostrar la selección por click -->
                        <div v-if="selectedLocation" class="selected-location-panel absolute left-6 bottom-6 z-30">
                            <div class="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg max-w-md">
                                <div class="flex items-start justify-between gap-4">
                                    <div class="flex-1">
                                        <div class="text-sm text-slate-600 mb-1">Ubicación seleccionada</div>
                                        <div class="font-semibold text-slate-800 text-sm">
                                            {{ selectedLocation.displayName }}
                                        </div>
                                        <div v-if="selectedLocation.loading" class="text-xs text-slate-500 mt-1">Obteniendo datos...</div>
                                    </div>
                                    <div class="flex flex-col items-end gap-2">
                                        <button @click="clearSelection" class="px-3 py-1 text-sm bg-gray-100 rounded">Limpiar</button>
                                        <button @click="confirmSelection" class="px-3 py-1 text-sm bg-emerald-600 text-white rounded">Confirmar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal mejorado para ubicación más cercana -->
                <div v-if="nearestModalVisible"
                    class="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    @click="nearestModalVisible = false">
                    <div class="modal-content floating-element rounded-3xl max-w-md w-full p-6 animate-modal-in"
                        @click.stop>
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-xl font-bold text-slate-800">🎯 Ubicación más cercana</h3>
                            <button @click="nearestModalVisible = false" class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 
                            p-2 rounded-xl transition-all">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div v-if="nearestLocation" class="space-y-3">
                            <div>
                                <h4 class="font-semibold text-lg text-slate-800">{{ nearestLocation.nombre }}</h4>
                                <div class="flex items-center gap-2 mt-1">
                                    <span
                                        class="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                                        📍 {{ nearestLocation.distance < 1 ? (nearestLocation.distance *
                                            1000).toFixed(0) + ' metros' : nearestLocation.distance.toFixed(2) + ' km'
                                            }} 
                                    </span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="text-sm text-slate-600 bg-blue-50 p-3 rounded-2xl">
                                    <strong>🌡️ Temperatura:</strong> {{ nearestLocation.temperatura }}°C
                                </div>
                                <div class="text-sm text-slate-600 bg-cyan-50 p-3 rounded-2xl">
                                    <strong>💧 Humedad:</strong> {{ nearestLocation.humedad }}%
                                </div>
                                <div class="text-sm text-slate-600 bg-emerald-50 p-3 rounded-2xl">
                                    <strong>☁️ Condición:</strong> {{ nearestLocation.condicion }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-4">
                            <p class="text-slate-600">No se encontraron ubicaciones cercanas.</p>
                        </div>
                    </div>
                </div>
                <div class="section-divider" aria-hidden="true"></div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import { EnvironmentOutlined } from '@ant-design/icons-vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import weatherService from '@/services/weatherService'; // Descomentar cuando conectes con el backend
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import SplitText from "../SplitText.vue";
import RotatingText from "../RotatingText.vue";

const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

// Animaciones on scroll
const { elementRef: titleRef } = useScrollAnimation();
const { elementRef: searchRef } = useScrollAnimation();
const { elementRef: mapRef } = useScrollAnimation();

// Referencias reactivas (tipadas para TypeScript)
const mapContainer = ref<HTMLElement | null>(null);
const loading = ref<boolean>(true);
const locations = ref<Array<any>>([]); // Cambiado de sucursales a locations
const map = ref<any | null>(null);
const markersLayer = ref<any | null>(null);
const userLocationMarker = ref<any | null>(null);
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const showingUserLocation = ref<boolean>(false);
const selectedLocation = ref<any | null>(null);
const clickMarker = ref<any | null>(null);
const searchQuery = ref<string>('');
const nearestModalVisible = ref<boolean>(false);
const nearestLocation = ref<any | null>(null); // Cambiado de nearestSucursal a nearestLocation
const mapInitialized = ref<boolean>(false);
const isUpdatingMarkers = ref<boolean>(false);
const isSecureContext = ref<boolean>(window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1');
const legendMinimized = ref<boolean>(true);

// Configuración del mapa centrado en Huánuco (puedes cambiar las coordenadas)
const mapConfig = {
    center: [-9.9306, -76.2422], // Huánuco, Perú
    zoom: 13,
    maxZoom: 18,
    minZoom: 6,
};

// Datos de ejemplo de ubicaciones con clima (reemplaza esto con tu API)
const sampleLocations = [
    {
        id: 1,
        nombre: 'Centro de Huánuco',
        latitud: -9.9306,
        longitud: -76.2422,
        temperatura: 22,
        humedad: 65,
        condicion: 'Soleado',
        categoria: 'Ciudad',
        descripcion: 'Centro histórico de Huánuco'
    },
    {
        id: 2,
        nombre: 'Kotosh',
        latitud: -9.9450,
        longitud: -76.2700,
        temperatura: 20,
        humedad: 70,
        condicion: 'Nublado',
        categoria: 'Arqueológico',
        descripcion: 'Templo de las Manos Cruzadas'
    },
    {
        id: 3,
        nombre: 'Pillco Mozo',
        latitud: -9.8800,
        longitud: -76.2200,
        temperatura: 24,
        humedad: 60,
        condicion: 'Soleado',
        categoria: 'Distrito',
        descripcion: 'Zona residencial'
    },
    {
        id: 4,
        nombre: 'Amarilis',
        latitud: -9.9500,
        longitud: -76.2300,
        temperatura: 21,
        humedad: 68,
        condicion: 'Parcialmente Nublado',
        categoria: 'Distrito',
        descripcion: 'Distrito de Amarilis'
    },
    {
        id: 5,
        nombre: 'Cayhuayna',
        latitud: -9.9200,
        longitud: -76.2100,
        temperatura: 23,
        humedad: 62,
        condicion: 'Soleado',
        categoria: 'Zona',
        descripcion: 'Zona residencial y comercial'
    }
];

// Filtrar ubicaciones según el texto ingresado en el buscador
const filteredLocations = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return locations.value.filter(
        (location) =>
            location.nombre.toLowerCase().includes(query) ||
            (location.descripcion && location.descripcion.toLowerCase().includes(query)) ||
            (location.condicion && location.condicion.toLowerCase().includes(query))
    );
});

// Cargar ubicaciones (reemplaza esto con tu servicio de clima cuando esté listo)
const loadLocations = async () => {
    try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // TODO: Cuando conectes con el backend, reemplaza esto con:
        // const response = await weatherService.getWeatherLocations();
        // locations.value = response.data || sampleLocations;
        
        // Por ahora, usar datos de ejemplo
        locations.value = sampleLocations;
        
    } catch (error) {
        console.error('Error cargando ubicaciones:', error);
        locations.value = sampleLocations; // Usar datos de ejemplo si falla
    }
};

// Inicializar el mapa
const initMap = () => {
    if (!mapContainer.value) {
        return;
    }

    try {
        map.value = L.map(mapContainer.value, {
            center: mapConfig.center,
            zoom: mapConfig.zoom,
            zoomControl: true,
            attributionControl: true,
            zoomAnimation: true,
            fadeAnimation: true,
            markerZoomAnimation: true,
            zoomAnimationThreshold: 4
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: mapConfig.maxZoom,
            minZoom: mapConfig.minZoom,
        }).addTo(map.value);

        markersLayer.value = L.layerGroup().addTo(map.value);

        map.value!.whenReady(() => {
            mapInitialized.value = true;
            updateMarkers();
            // Agregar listener de click para seleccionar ubicación
            map.value!.on('click', onMapClick)
            loading.value = false;
        });

    } catch (error) {
        console.error('Error inicializando mapa:', error);
        loading.value = false;
    }
};

// Configurar íconos personalizados para diferentes condiciones del clima
const createCustomIcon = (condicion = 'Soleado', temperatura = 20) => {
    // Iconos según la condición del clima
    const weatherIcons = {
        'Soleado': '☀️',
        'Parcialmente Nublado': '⛅',
        'Nublado': '☁️',
        'Lluvia': '�️',
        'Tormenta': '⛈️',
        'Nieve': '❄️',
        'Niebla': '🌫️',
        'Viento': '💨',
    };

    // Colores según la temperatura
    const getColorByTemp = (temp: number) => {
        if (temp >= 28) return '#ef4444'; // Rojo - Caliente
        if (temp >= 22) return '#f59e0b'; // Naranja - Templado-Cálido
        if (temp >= 18) return '#10b981'; // Verde - Agradable
        if (temp >= 12) return '#3b82f6'; // Azul - Fresco
        return '#8b5cf6'; // Púrpura - Frío
    };

    const icon = (weatherIcons as any)[condicion] || '🌡️';
    const color = getColorByTemp(temperatura);

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div class="marker-pin-enhanced" style="background-color: ${color}">
        <i class="marker-icon">${icon}</i>
      </div>
    `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50],
    });
};

// Actualizar marcadores
const updateMarkers = () => {
    if (!map.value || !mapInitialized.value || !markersLayer.value || isUpdatingMarkers.value) {
        return;
    }

    try {
        isUpdatingMarkers.value = true;
    markersLayer.value?.clearLayers();

        const locationsToShow = searchQuery.value.trim() === ''
            ? locations.value
            : filteredLocations.value;

        locationsToShow.forEach((location) => {
            const lat = parseFloat(location.latitud);
            const lng = parseFloat(location.longitud);

            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                try {
                    const condicion = location.condicion || 'Soleado';
                    const temperatura = location.temperatura || 20;
                    const marker = L.marker([lat, lng], {
                        icon: createCustomIcon(condicion, temperatura)
                    }).bindPopup(createPopupContent(location));

                    marker.locationId = location.id;
                    markersLayer.value?.addLayer(marker);
                } catch (error) {
                    console.error('Error creando marcador:', error);
                }
            }
        });

    } catch (error) {
        console.error('Error actualizando marcadores:', error);
    } finally {
        isUpdatingMarkers.value = false;
    }
};

// Crear contenido del popup mejorado con información del clima
    const createPopupContent = (location: any) => {
    const descripcion = location.descripcion || 'Ubicación';
    const temperatura = location.temperatura || 'N/A';
    const humedad = location.humedad || 'N/A';
    const condicion = location.condicion || 'Sin datos';
    
    // Icono según la condición
    const condicionIconos = {
        'Soleado': '☀️',
        'Parcialmente Nublado': '⛅',
        'Nublado': '☁️',
        'Lluvia': '🌧️',
        'Tormenta': '⛈️',
        'Nieve': '❄️',
        'Niebla': '🌫️',
        'Viento': '💨',
    };
    
    const iconoCondicion = (condicionIconos as any)[condicion] || '🌡️';

    return `
    <div class="popup-content-enhanced">
      <div class="popup-header-enhanced">
        <div class="popup-weather-icon">${iconoCondicion}</div>
        <div class="popup-info">
          <h3 class="popup-title-enhanced">${location.nombre}</h3>
          <p class="popup-address-enhanced">${descripcion}</p>
        </div>
      </div>
      <div class="popup-details-enhanced">
        <div class="popup-contact">
          <span>🌡️</span> 
          <span><strong>Temperatura:</strong> ${temperatura}°C</span>
        </div>
        <div class="popup-contact">
          <span>�</span> 
          <span><strong>Humedad:</strong> ${humedad}%</span>
        </div>
        <div class="popup-contact">
          <span>${iconoCondicion}</span> 
          <span><strong>Condición:</strong> ${condicion}</span>
        </div>
      </div>
    </div>
  `;
};

// Enfocar en una ubicación específica
const focusOnLocation = (location: any) => {
    if (!map.value || !mapInitialized.value || !location.latitud || !location.longitud) {
        return;
    }

    try {
        const lat = parseFloat(location.latitud);
        const lng = parseFloat(location.longitud);

        if (!isNaN(lat) && !isNaN(lng)) {
            map.value.flyTo([lat, lng], 16, {
                duration: 1.0
            });

            setTimeout(() => {
                if (markersLayer.value?.eachLayer) {
                    markersLayer.value.eachLayer((layer: any) => {
                        if (layer.locationId === location.id) {
                            layer.openPopup();
                        }
                    });
                }
            }, 1100);
        }
    } catch (error) {
        console.error('Error enfocando ubicación:', error);
    }
};

const centerAllLocations = () => {
    if (!map.value || !mapInitialized.value || !markersLayer.value) {
        return;
    }

    try {
        const layers: any[] = [];
        markersLayer.value?.eachLayer((layer: any) => {
            layers.push(layer);
        });

        if (layers.length > 0) {
            const group = L.featureGroup(layers);
            const bounds = group.getBounds();

                if (bounds && bounds.isValid()) {
                map.value?.flyToBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: 14,
                    duration: 1.5
                });
            }
        } else {
            map.value?.flyTo(mapConfig.center, mapConfig.zoom, {
                duration: 1.5
            });
        }
    } catch (error) {
        console.error('Error centrando todas las ubicaciones:', error);
    map.value?.setView(mapConfig.center, mapConfig.zoom);
    }
};

const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    const isSecureContext = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    if (!navigator.geolocation) {
        return Promise.reject('Geolocalización no soportada por este navegador')
    }

    if (!isSecureContext) {
        return Promise.reject('La geolocalización requiere HTTPS en producción. Accede al sitio con https:// o configura un certificado SSL.')
    }

    return new Promise((resolve, reject) => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                resolve({ lat: latitude, lng: longitude } as { lat: number; lng: number })
            },
            (error) => {
                let errorMessage = 'Error obteniendo ubicación';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permisos de ubicación denegados. Habilita la ubicación en tu navegador.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Ubicación no disponible. Verifica que tienes GPS activado.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Tiempo agotado obteniendo ubicación. Inténtalo de nuevo.';
                        break;
                    default:
                        if (!isSecureContext) {
                            errorMessage = 'La geolocalización requiere HTTPS. Accede con https:// o configura SSL.';
                        }
                        break;
                }

                reject(new Error(errorMessage));
            },
            options
        )
    })
}

const showUserLocation = async () => {
    if (!map.value || !mapInitialized.value) return

    try {
        showingUserLocation.value = true
    const location = await getUserLocation()
    userLocation.value = location as { lat: number; lng: number }

        if (userLocationMarker.value && map.value?.hasLayer && map.value.hasLayer(userLocationMarker.value)) {
            map.value.removeLayer(userLocationMarker.value)
        }

        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
        <div class="user-marker-pin-enhanced">
          <div class="user-marker-pulse"></div>
          <div class="user-marker-center">📍</div>
        </div>
      `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        })

        userLocationMarker.value = L.marker([location.lat, location.lng], { icon: userIcon })
            .addTo(map.value!)
            .bindPopup('📍 Tu ubicación actual')

        map.value!.flyTo([location.lat, location.lng], 15, {
            duration: 1.5
        });

        // console.log('✅ Ubicación obtenida correctamente');

    } catch (error: any) {
        console.error('Error mostrando ubicación del usuario:', error.message)
        alert(`Error de ubicación: ${error.message}`);
    } finally {
        showingUserLocation.value = false
    }
}

// Manejo de click en el mapa: crear marcador y reverse-geocode
const onMapClick = async (e: any) => {
    try {
        const { lat, lng } = e.latlng

        // remover marcador anterior
        if (clickMarker.value && map.value && map.value.hasLayer(clickMarker.value)) {
            map.value.removeLayer(clickMarker.value)
            clickMarker.value = null
        }

        // crear nuevo marcador
        clickMarker.value = L.marker([lat, lng]).addTo(map.value)

        // mostrar estado provisional
        selectedLocation.value = {
            lat,
            lon: lng,
            displayName: 'Obteniendo dirección...',
            loading: true
        }

        // reverse geocoding con Nominatim
        const info = await reverseGeocode(lat, lng)

        selectedLocation.value = {
            lat,
            lon: lng,
            displayName: info.display_name || 'Dirección no disponible',
            address: info.address || null,
            loading: false
        }

        // abrir popup con la dirección
        if (clickMarker.value) {
            clickMarker.value.bindPopup(`<strong>Seleccionado</strong><br>${selectedLocation.value.displayName}`).openPopup()
        }

    } catch (error) {
        console.error('Error al procesar click en mapa:', error)
        selectedLocation.value = null
    }
}

const reverseGeocode = async (lat: number, lon: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'clima_frontend/1.0' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.warn('reverseGeocode failed:', error)
        return {}
    }
}

const clearSelection = () => {
    if (clickMarker.value && map.value && map.value.hasLayer(clickMarker.value)) {
        map.value.removeLayer(clickMarker.value)
    }
    clickMarker.value = null
    selectedLocation.value = null
}

const confirmSelection = () => {
    if (!selectedLocation.value) return
    // Por ahora solo mostrar en consola; más adelante emitir evento o integrar con backend
    console.log('Ubicación confirmada:', selectedLocation.value)
    // posible emit: emit('locationSelected', selectedLocation.value)
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const findNearestLocation = () => {
    if (!userLocation.value || locations.value.length === 0) return null

    let nearest = null
    let minDistance = Infinity

    locations.value.forEach((location: any) => {
        if (location.latitud && location.longitud) {
            const distance = calculateDistance(
                userLocation.value!.lat,
                userLocation.value!.lng,
                parseFloat(location.latitud),
                parseFloat(location.longitud)
            )

            if (distance < minDistance) {
                minDistance = distance
                nearest = { ...location, distance }
            }
        }
    })

    return nearest
}

const minimizeLegend = () => {
    legendMinimized.value = true;
};

const expandLegend = () => {
    legendMinimized.value = false;
};

const findAndShowNearest = () => {
    const nearest = findNearestLocation()

    if (nearest) {
        focusOnLocation(nearest)
        nearestLocation.value = nearest;
        nearestModalVisible.value = true;
    } else {
        nearestLocation.value = null;
        nearestModalVisible.value = true;
    }
}

// Watch para actualizar marcadores cuando cambia la búsqueda
let searchTimeout: number | null = null;
watch(searchQuery, () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
        if (mapInitialized.value && !isUpdatingMarkers.value) {
            updateMarkers();
        }
    }, 300);
});

// Limpiar recursos al desmontar el componente
onBeforeUnmount(() => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    if (map.value) {
        try {
            map.value.remove();
        } catch (error) {
            console.warn('Error al limpiar mapa:', error);
        }
    }
});

// Montar el componente
onMounted(async () => {
    await loadLocations();
    await nextTick();
    initMap();
});
</script>

<style scoped>
/* Gradiente de fondo mejorado */
.enhanced-gradient {
    /* removed decorative gradient so the section inherits the dark background */
    background: transparent;
}

/* Animaciones flotantes */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    33% {
        transform: translateY(-10px) rotate(1deg);
    }

    66% {
        transform: translateY(5px) rotate(-1deg);
    }
}

@keyframes float-reverse {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    33% {
        transform: translateY(8px) rotate(-1deg);
    }

    66% {
        transform: translateY(-12px) rotate(1deg);
    }
}

@keyframes float-slow {

    0%,
    100% {
        transform: translateY(0px) scale(1);
    }

    50% {
        transform: translateY(-15px) scale(1.05);
    }
}

@keyframes pulse-slow {

    0%,
    100% {
        opacity: 0.4;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(1.1);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-reverse {
    animation: float-reverse 8s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 10s ease-in-out infinite;
}

.animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
}

/* Efectos glassmorphism */
.floating-element {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Barra de búsqueda mejorada */
.search-enhanced {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(16, 185, 129, 0.1);
    box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(16, 185, 129, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-enhanced:hover {
    border-color: rgba(16, 185, 129, 0.2);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.12),
        0 4px 12px rgba(16, 185, 129, 0.15);
}

.search-enhanced:focus-within {
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.12),
        0 4px 12px rgba(16, 185, 129, 0.2),
        0 0 0 4px rgba(16, 185, 129, 0.1);
}

/* Wrapper y divisor entre secciones */
.section-hero-wrapper {
    position: relative;
    overflow: visible;
    /* inherit background from parent (LandingPage) */
    background: transparent;
}

.section-divider {
    position: absolute;
    left: 4%;
    right: 4%;
    height: 1px;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(148, 163, 184, 0.08), rgba(255, 255, 255, 0));
    opacity: 0.7;
    transform: translateY(50%);
}

/* Contenedor del mapa mejorado */
.map-container-enhanced {
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1));
}

.map-display {
    position: relative;
    overflow: hidden;
}

.map-display::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1.5rem;
    padding: 2px;
    background: transparent; /* Let parent background show through */
    pointer-events: none;
    z-index: 1;
}

/* Botones de control mejorados */
.control-button {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(16px);
    border: none;
    cursor: pointer;
}

.control-button:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.control-button:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.control-button:not(.location-btn) {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.control-button:not(.location-btn):hover {
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.15),
        0 4px 12px rgba(0, 0, 0, 0.1);
}

.location-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, #94a3b8, #64748b) !important;
}

/* Loading mejorado */
.loading-overlay {
    backdrop-filter: blur(10px);
}

.loading-spinner {
    filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2));
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes spin-reverse {
    to {
        transform: rotate(-360deg);
    }
}

.animate-reverse {
    animation-direction: reverse;
}

/* Leyenda mejorada */
.legend-enhanced {
    max-width: calc(100vw - 3rem);
}

.legend-dot {
    border: 2px solid rgba(255, 255, 255, 0.8);
    transition: all 0.2s ease;
}

.legend-enhanced li:hover .legend-dot {
    transform: scale(1.2);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* Modal mejorado */
.modal-overlay {
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s ease-out;
}

.modal-content {
    max-height: 90vh;
    overflow-y: auto;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes modal-in {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-modal-in {
    animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Marcadores mejorados */
:deep(.custom-marker) {
    background: transparent;
    border: none;
}

:deep(.marker-pin-enhanced) {
    width: 40px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.9);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.25),
        0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
}

:deep(.marker-pin-enhanced::before) {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
    border-radius: 50% 50% 50% 0;
    z-index: 0;
}

:deep(.marker-pin-enhanced:hover) {
    transform: rotate(-45deg) scale(1.15);
    box-shadow:
        0 8px 28px rgba(0, 0, 0, 0.3),
        0 4px 12px rgba(0, 0, 0, 0.2);
}

:deep(.marker-icon) {
    transform: rotate(45deg);
    font-size: 18px;
    z-index: 1;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* Marcador de usuario mejorado */
:deep(.user-location-marker) {
    background: transparent;
    border: none;
}

:deep(.user-marker-pin-enhanced) {
    width: 30px;
    height: 30px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.user-marker-pulse) {
    position: absolute;
    width: 50px;
    height: 50px;
    background: rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    animation: pulse-user 2s infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

:deep(.user-marker-center) {
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 1;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

@keyframes pulse-user {
    0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 1;
    }

    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}

/* Popup mejorado */
:deep(.popup-content-enhanced) {
    min-width: 280px;
    font-family: system-ui, -apple-system, sans-serif;
}

:deep(.popup-header-enhanced) {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.popup-logo-enhanced) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
}

:deep(.popup-weather-icon) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
    border: 2px solid rgba(16, 185, 129, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
}

:deep(.popup-info) {
    flex: 1;
    min-width: 0;
}

:deep(.popup-title-enhanced) {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px 0;
    line-height: 1.3;
}

:deep(.popup-address-enhanced) {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
}

:deep(.popup-details-enhanced) {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

:deep(.popup-contact) {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #374151;
    background: rgba(16, 185, 129, 0.05);
    padding: 6px 10px;
    border-radius: 8px;
    border-left: 3px solid #10b981;
}

:deep(.popup-contact span) {
    font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
    .controls-panel {
        top: 1rem;
        right: 1rem;
        gap: 0.5rem;
    }

    .control-button {
        width: 2.5rem;
        height: 2.5rem;
    }

    .legend-enhanced {
        bottom: 1rem;
        left: 1rem;
    }

    .search-enhanced {
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .modal-content {
        margin-left: 1rem;
        margin-right: 1rem;
    }
}
</style>