<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-container">
      
      <!-- Изписване на съобщението с динамичното име -->
      <h1>Welcome to dashboard, <span class="username-text">{{ loggedUser }}</span></h1>
      
      <div class="dashboard-content">
        <p>You have successfully logged in and accessed your secure area.</p>
      </div>

      <!-- Вмъкваме бутона за изход, който създадохме в предната стъпка -->
      <ExitButton />
      <Topology />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ExitButton from '../components/ExitButton.vue';
import Topology from '../components/Topology.vue'

// Създаваме реактивна променлива, в която ще пазим името
const loggedUser = ref('');

onMounted(() => {
  // Взимаме името, което PHP записа в браузъра при успешния Login
  // Ако няма нищо (за застраховка), ще изпише "Guest"
  loggedUser.value = localStorage.getItem('loggedUser') || 'Guest';
});
</script>

<style scoped>
.dashboard-wrapper {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f8fafc;
}

.dashboard-container {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  text-align: center;
}

h1 {
  color: #1e293b;
  font-size: 24px;
  margin-bottom: 15px;
}

.username-text {
  color: #3b82f6; /* Оцветява името в приятно синьо */
  font-weight: bold;
}

.dashboard-content {
  margin: 20px 0 30px 0;
  padding: 15px;
  background-color: #f1f5f9;
  border-radius: 6px;
  color: #475569;
  font-size: 15px;
}
</style>
