<template>
  <div class="icon-showcase">
    <h2 class="text-2xl font-bold mb-6">Lucide Icons - Ejemplos</h2>

    <div class="icons-grid">
      <!-- Iconos del clima -->
      <div class="icon-item">
        <Cloud :size="32" />
        <span>Cloud</span>
      </div>

      <div class="icon-item">
        <CloudRain :size="32" />
        <span>CloudRain</span>
      </div>

      <div class="icon-item">
        <CloudSnow :size="32" />
        <span>CloudSnow</span>
      </div>

      <div class="icon-item">
        <Sun :size="32" />
        <span>Sun</span>
      </div>

      <div class="icon-item">
        <Moon :size="32" />
        <span>Moon</span>
      </div>

      <div class="icon-item">
        <Wind :size="32" />
        <span>Wind</span>
      </div>

      <div class="icon-item">
        <Droplets :size="32" />
        <span>Droplets</span>
      </div>

      <div class="icon-item">
        <Thermometer :size="32" />
        <span>Thermometer</span>
      </div>

      <!-- Iconos de navegación -->
      <div class="icon-item">
        <Home :size="32" />
        <span>Home</span>
      </div>

      <div class="icon-item">
        <MapPin :size="32" />
        <span>MapPin</span>
      </div>

      <div class="icon-item">
        <Settings :size="32" />
        <span>Settings</span>
      </div>

      <div class="icon-item">
        <User :size="32" />
        <span>User</span>
      </div>

      <div class="icon-item">
        <Search :size="32" />
        <span>Search</span>
      </div>

      <div class="icon-item">
        <Menu :size="32" />
        <span>Menu</span>
      </div>

      <div class="icon-item">
        <X :size="32" />
        <span>X</span>
      </div>

      <div class="icon-item">
        <ChevronRight :size="32" />
        <span>ChevronRight</span>
      </div>

      <!-- Más iconos útiles -->
      <div class="icon-item">
        <Calendar :size="32" />
        <span>Calendar</span>
      </div>

      <div class="icon-item">
        <Clock :size="32" />
        <span>Clock</span>
      </div>

      <div class="icon-item">
        <AlertTriangle :size="32" />
        <span>AlertTriangle</span>
      </div>

      <div class="icon-item">
        <Info :size="32" />
        <span>Info</span>
      </div>

      <div class="icon-item">
        <Bell :size="32" />
        <span>Bell</span>
      </div>

      <div class="icon-item">
        <Heart :size="32" />
        <span>Heart</span>
      </div>

      <div class="icon-item">
        <Star :size="32" />
        <span>Star</span>
      </div>

      <div class="icon-item">
        <TreePine :size="32" />
        <span>TreePine</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Moon,
  Wind,
  Droplets,
  Thermometer,
  Home,
  MapPin,
  Settings,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  Bell,
  Heart,
  Star,
  TreePine
} from 'lucide-vue-next';
</script>

<style scoped>
.icon-showcase {
  @apply p-6;
}

.icons-grid {
  @apply grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4;
}

.icon-item {
  @apply flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer;
}

.icon-item span {
  @apply mt-2 text-xs text-gray-600 text-center;
}
</style>
