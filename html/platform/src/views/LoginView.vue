<template>
  <div class="page-layout">
    <!-- Вмъкваме нашия капсулиран компонент за вход -->
    <AuthManager />
  </div>
</template>

<script setup>
import AuthManager from '../components/authManager.vue';
</script>

<style scoped>
.page-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f8fafc; /* Приятен лек бекграунд за цялата страница */
}
</style>
