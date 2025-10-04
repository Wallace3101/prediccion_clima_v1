import { defineStore } from 'pinia';
import weatherService from '@/services/weatherService';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentWeather: null,
    weatherPrediction: null,
    weatherHistory: [],
    alerts: [],
    favoriteLocations: [],
    selectedLocation: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasAlerts: (state) => state.alerts.length > 0,
    hasFavorites: (state) => state.favoriteLocations.length > 0,
  },

  actions: {
    // Obtener clima actual
    async fetchCurrentWeather(location) {
      try {
        this.loading = true;
        this.error = null;
        this.currentWeather = await weatherService.getCurrentWeather(location);
        this.selectedLocation = location;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener clima actual';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Obtener predicción del clima
    async fetchWeatherPrediction(location, days = 7) {
      try {
        this.loading = true;
        this.error = null;
        this.weatherPrediction = await weatherService.getWeatherPrediction(location, days);
        this.selectedLocation = location;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener predicción';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Obtener histórico del clima
    async fetchWeatherHistory(location, startDate, endDate) {
      try {
        this.loading = true;
        this.error = null;
        this.weatherHistory = await weatherService.getWeatherHistory(location, startDate, endDate);
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener histórico';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Obtener alertas
    async fetchWeatherAlerts(location) {
      try {
        this.alerts = await weatherService.getWeatherAlerts(location);
      } catch (error) {
        console.error('Error al obtener alertas:', error);
      }
    },

    // Obtener ubicaciones favoritas
    async fetchFavoriteLocations() {
      try {
        this.favoriteLocations = await weatherService.getFavoriteLocations();
      } catch (error) {
        console.error('Error al obtener favoritos:', error);
      }
    },

    // Guardar ubicación favorita
    async saveFavoriteLocation(location) {
      try {
        const newFavorite = await weatherService.saveFavoriteLocation(location);
        this.favoriteLocations.push(newFavorite);
        return newFavorite;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al guardar favorito';
        throw error;
      }
    },

    // Eliminar ubicación favorita
    async deleteFavoriteLocation(locationId) {
      try {
        await weatherService.deleteFavoriteLocation(locationId);
        this.favoriteLocations = this.favoriteLocations.filter(
          (loc) => loc.id !== locationId
        );
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar favorito';
        throw error;
      }
    },

    // Limpiar error
    clearError() {
      this.error = null;
    },
  },
});
