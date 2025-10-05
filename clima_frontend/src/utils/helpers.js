// Formatear fecha
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Formatear hora
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Formatear temperatura
export const formatTemperature = (temp) => {
  return `${Math.round(temp)}°C`;
};

// Obtener descripción del clima
export const getWeatherDescription = (weatherCode) => {
  const descriptions = {
    clear: 'Despejado',
    clouds: 'Nublado',
    rain: 'Lluvia',
    snow: 'Nieve',
    thunderstorm: 'Tormenta',
    drizzle: 'Llovizna',
    mist: 'Neblina'
  };
  return descriptions[weatherCode] || 'Desconocido';
};

// Manejar errores de API
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.detail;
    
    switch (status) {
      case 400:
        return message || 'Solicitud inválida';
      case 401:
        return 'No autorizado. Por favor, inicie sesión nuevamente';
      case 403:
        return 'No tiene permisos para realizar esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 500:
        return 'Error del servidor. Por favor, intente más tarde';
      default:
        return message || 'Error al procesar la solicitud';
    }
  } else if (error.request) {
    // La solicitud se realizó pero no se recibió respuesta
    return 'No se pudo conectar con el servidor. Verifique su conexión a internet';
  } else {
    // Algo sucedió al configurar la solicitud
    return error.message || 'Error inesperado';
  }
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña (mínimo 8 caracteres, una mayúscula, una minúscula, un número)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
