/**
 * OpenWeatherMap API Service
 * Documentación: https://openweathermap.org/api
 * 
 * API Key: b557f60a8b08a6ad0e81560892e92aad
 * 
 * Recomendaciones:
 * - No hacer más de 1 llamada cada 10 minutos por ubicación
 * - Usar coordenadas geográficas para mayor precisión
 * - El endpoint gratuito es: api.openweathermap.org
 */

const API_KEY = 'b557f60a8b08a6ad0e81560892e92aad';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const openWeatherService = {
  /**
   * Obtener clima actual por coordenadas
   * @param {number} lat - Latitud
   * @param {number} lon - Longitud
   * @param {string} units - Unidades de medida: 'metric' (Celsius), 'imperial' (Fahrenheit), 'standard' (Kelvin)
   * @param {string} lang - Idioma de la respuesta (es para español)
   * @returns {Promise<Object>} Datos del clima actual
   */
  async getCurrentWeather(lat, lon, units = 'metric', lang = 'es') {
    try {
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Límite de llamadas excedido. Intenta nuevamente en 10 minutos.');
        }
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo clima actual:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Obtener pronóstico de 5 días (cada 3 horas)
   * @param {number} lat - Latitud
   * @param {number} lon - Longitud
   * @param {string} units - Unidades de medida
   * @param {string} lang - Idioma de la respuesta
   * @returns {Promise<Object>} Pronóstico del clima
   */
  async getForecast(lat, lon, units = 'metric', lang = 'es') {
    try {
      const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Límite de llamadas excedido. Intenta nuevamente en 10 minutos.');
        }
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo pronóstico:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Obtener datos completos del clima (actual + pronóstico)
   * @param {number} lat - Latitud
   * @param {number} lon - Longitud
   * @returns {Promise<Object>} Clima actual y pronóstico
   */
  async getCompleteWeatherData(lat, lon) {
    try {
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getForecast(lat, lon)
      ]);

      return {
        success: currentWeather.success && forecast.success,
        current: currentWeather.data,
        forecast: forecast.data,
        coordinates: { lat, lon },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo datos completos del clima:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Formatear datos del clima actual para visualización
   * @param {Object} weatherData - Datos crudos de la API
   * @returns {Object} Datos formateados
   */
  formatCurrentWeather(weatherData) {
    if (!weatherData) return null;

    return {
      temperature: Math.round(weatherData.main?.temp || 0),
      feelsLike: Math.round(weatherData.main?.feels_like || 0),
      tempMin: Math.round(weatherData.main?.temp_min || 0),
      tempMax: Math.round(weatherData.main?.temp_max || 0),
      humidity: weatherData.main?.humidity || 0,
      pressure: weatherData.main?.pressure || 0,
      windSpeed: Math.round((weatherData.wind?.speed || 0) * 3.6), // m/s a km/h
      windDirection: weatherData.wind?.deg || 0,
      cloudiness: weatherData.clouds?.all || 0,
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 0, // metros a km
      description: weatherData.weather?.[0]?.description || 'N/A',
      icon: weatherData.weather?.[0]?.icon || '01d',
      weatherMain: weatherData.weather?.[0]?.main || 'Clear',
      sunrise: weatherData.sys?.sunrise ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      sunset: weatherData.sys?.sunset ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      location: weatherData.name || 'Ubicación',
      country: weatherData.sys?.country || '',
      coordinates: {
        lat: weatherData.coord?.lat || 0,
        lon: weatherData.coord?.lon || 0
      }
    };
  },

  /**
   * Formatear pronóstico semanal (agrupa por día)
   * @param {Object} forecastData - Datos del pronóstico
   * @returns {Array} Array de pronósticos diarios
   */
  formatForecast(forecastData) {
    if (!forecastData?.list) return [];

    // Agrupar por día
    const dailyData = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('es-PE', { weekday: 'short' });
      const dateKey = date.toISOString().split('T')[0];

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          day: day.charAt(0).toUpperCase() + day.slice(1),
          temps: [],
          descriptions: [],
          icons: [],
          humidity: [],
          wind: []
        };
      }

      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].descriptions.push(item.weather[0].description);
      dailyData[dateKey].icons.push(item.weather[0].icon);
      dailyData[dateKey].humidity.push(item.main.humidity);
      dailyData[dateKey].wind.push(item.wind.speed);
    });

    // Calcular promedios y seleccionar datos representativos
    return Object.values(dailyData).map(day => ({
      day: day.day,
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      tempAvg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
      description: day.descriptions[Math.floor(day.descriptions.length / 2)],
      icon: day.icons[Math.floor(day.icons.length / 2)],
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round((day.wind.reduce((a, b) => a + b, 0) / day.wind.length) * 3.6) // m/s a km/h
    }));
  },

  /**
   * Obtener icono de emoji según el código de OpenWeatherMap
   * @param {string} iconCode - Código del icono (ej: '01d', '10n')
   * @returns {string} Emoji correspondiente
   */
  getWeatherEmoji(iconCode) {
    const emojiMap = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '🌤️', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌧️', // shower rain
      '09n': '🌧️',
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '❄️', // snow
      '13n': '❄️',
      '50d': '🌫️', // mist
      '50n': '🌫️'
    };
    
    return emojiMap[iconCode] || '🌤️';
  }
};

export default openWeatherService;
