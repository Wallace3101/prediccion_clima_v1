import api from './api';

const authService = {
  // Login
  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  // Registro
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  // Logout
  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await api.post('/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  // Verificar email
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email/', { token });
    return response.data;
  },

  // Solicitar reset de contraseña
  async requestPasswordReset(email) {
    const response = await api.post('/auth/password-reset/', { email });
    return response.data;
  },

  // Confirmar reset de contraseña
  async confirmPasswordReset(uidb64, token, newPassword) {
    const response = await api.post('/auth/password-reset-confirm/', {
      uidb64,
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  // Verificar si hay token válido
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
