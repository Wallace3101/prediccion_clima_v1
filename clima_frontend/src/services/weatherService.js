import api from './api';

const weatherService = {
  // Obtener predicción del clima
  async getWeatherPrediction(location, days = 7) {
    const response = await api.get('/weather/prediction/', {
      params: {
        location,
        days,
      },
    });
    return response.data;
  },

  // Obtener clima actual
  async getCurrentWeather(location) {
    const response = await api.get('/weather/current/', {
      params: { location },
    });
    return response.data;
  },

  // Obtener histórico del clima
  async getWeatherHistory(location, startDate, endDate) {
    const response = await api.get('/weather/history/', {
      params: {
        location,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  // Obtener alertas meteorológicas
  async getWeatherAlerts(location) {
    const response = await api.get('/weather/alerts/', {
      params: { location },
    });
    return response.data;
  },

  // Guardar ubicación favorita
  async saveFavoriteLocation(location) {
    const response = await api.post('/weather/favorites/', { location });
    return response.data;
  },

  // Obtener ubicaciones favoritas
  async getFavoriteLocations() {
    const response = await api.get('/weather/favorites/');
    return response.data;
  },

  // Eliminar ubicación favorita
  async deleteFavoriteLocation(locationId) {
    const response = await api.delete(`/weather/favorites/${locationId}/`);
    return response.data;
  },
};

export default weatherService;
