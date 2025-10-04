import { createRouter, createWebHistory } from "vue-router";
// import { useAuthStore } from "@/store/auth";
// import roles from "@/services/roles";

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: () => import("@/views/LandingPage/LandingPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/example",
    name: "Example",
    component: () => import("@/views/ExamplePage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/tailwind-test",
    name: "TailwindTest",
    component: () => import("@/views/TailwindTest.vue"),
    meta: { requiresAuth: false },
  },
  
  // Rutas de autenticación - Crear estos archivos cuando los necesites
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import("@/views/auth/LoginView.vue"),
  //   meta: {
  //     requiresAuth: false,
  //   },
  // },
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: () => import("@/views/auth/RegisterView.vue"),
  //   meta: {
  //     requiresAuth: false,
  //   },
  // },
  
  // Ruta para manejar cualquier otra URL no definida
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
    meta: { requiresAuth: false },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Asegurar que al navegar entre rutas la página se posicione arriba
  scrollBehavior(to, from, savedPosition) {
    // Si el navegador tiene una posición guardada (back/forward), respetarla
    if (savedPosition) {
      return savedPosition;
    }
    // Si la ruta tiene hash, dejar que el comportamiento por defecto intente hacer scroll al id
    if (to.hash) {
      return { el: to.hash };
    }
    // Por defecto, posicionar arriba
    return { top: 0 };
  }
});

// Guard de navegación - Comentado temporalmente hasta crear las vistas de autenticación
// Descomentar cuando tengas las vistas de auth creadas
/*
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore();

    // Inicializar autenticación si no está inicializada
    if (!authStore.isAuthenticated && !authStore.user) {
      await authStore.initAuth();
    }

    // Verificar si la ruta requiere autenticación
    if (to.meta?.requiresAuth === true) {
      const token = authStore.getToken();
      const isAuthenticated = authStore.isAuthenticated;

      if (!token || !isAuthenticated) {
        next({
          name: "Login",
          query: { redirect: to.fullPath },
        });
        return;
      }

      // Verificar roles si la ruta lo requiere
      if (to.meta?.roles && Array.isArray(to.meta.roles)) {
        const userRole = authStore.userRole;
        if (!to.meta.roles.includes(userRole)) {
          next({ path: "/" });
          return;
        }
      }
    }

    next();
  } catch (error) {
    console.error("Error en router guard:", error);
    next();
  }
});
*/

export default router;
