import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// МОДЕРНИЗИРАН ГАРД: Премахваме третия аргумент "next"
router.beforeEach((to, from) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Вместо next('/login') -> директно връщаме стринга с адреса
    return '/login';
  } 
  
  if (to.meta.requiresGuest && isAuthenticated) {
    // Вместо next('/dashboard') -> директно връщаме /dashboard
    return '/dashboard';
  }

  // Вместо next() за успешно преминаване -> не връщаме нищо или просто прекратяваме изпълнението
});

export default router;
