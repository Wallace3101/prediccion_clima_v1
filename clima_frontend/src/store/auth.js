import { defineStore } from 'pinia';
import authService from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    pendingRedirect: null,
  }),

  getters: {
    userRole: (state) => state.user?.role || null,
    userName: (state) => state.user?.name || state.user?.username || '',
    userEmail: (state) => state.user?.email || '',
  },

  actions: {
    // Inicializar autenticación
    async initAuth() {
      if (authService.isAuthenticated()) {
        try {
          this.loading = true;
          const userData = await authService.getCurrentUser();
          this.user = userData;
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Error al inicializar autenticación:', error);
          this.logout();
        } finally {
          this.loading = false;
        }
      }
    },

    // Login
    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;
        const response = await authService.login(credentials);
        this.user = response.user;
        this.isAuthenticated = true;
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Registro
    async register(userData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await authService.register(userData);
        
        // Si el backend devuelve tokens al registrar
        if (response.access) {
          this.user = response.user;
          this.isAuthenticated = true;
        }
        
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al registrarse';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Logout
    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        this.error = null;
      }
    },

    // Obtener token
    getToken() {
      return localStorage.getItem('access_token');
    },

    // Establecer redirección pendiente
    setPendingRedirect(path) {
      this.pendingRedirect = path;
    },

    // Obtener redirección post-login
    getPostLoginRedirect() {
      const redirect = this.pendingRedirect;
      this.pendingRedirect = null;
      
      // Si hay un redirect guardado, usarlo
      if (redirect && redirect !== '/login' && redirect !== '/register') {
        return redirect;
      }
      
      // Redirigir según el rol del usuario
      if (this.user?.role === 'admin') {
        return '/admin/dashboard';
      }
      
      return '/dashboard';
    },
  },
});
