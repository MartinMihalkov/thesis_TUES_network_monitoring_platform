<template>
  <button @click="handleLogout" class="exit-btn" title="Изход от профила">
    <!-- Икона за изход (SVG) -->
    <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="exit-icon">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
    <span>Изход</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  // 1. Изчистване на сесията от браузъра
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('loggedUser');
  
  // 2. Пренасочване към страницата за вход
  router.push('/login');
};
</script>

<style scoped>
.exit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.exit-btn:hover {
  background-color: #dc2626;
}

.exit-btn:active {
  transform: scale(0.98);
}

.exit-icon {
  width: 18px;
  height: 18px;
}
</style>
