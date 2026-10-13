<template>
  <div class="api-container">
    <h2>Списък с данни от API</h2>

    <!-- Статус на зареждане -->
    <div v-if="loading" class="loading">Зареждане на данните...</div>

    <!-- Съобщение за грешка -->
    <div v-else-if="error" class="error-message">
      Грешка: {{ error }}
    </div>

    <!-- Показване на данните, ако съществуват -->
    <div v-else-if="records.length > 0" class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Име</th>
            <th>Имейл</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.pass_hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ако няма намерени записи -->
    <div v-else class="no-data">Няма намерени записи.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Дефиниране на реактивни променливи
const records = ref([]);
const loading = ref(true);
const error = ref(null);

// Вмъкнете URL адреса на вашия PHP скрипт тук
const API_URL = 'http://192.168.200.3/dbConnect.php'; 

// Функция за извличане на данните
const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP грешка! Статус: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("hihi");
    records.value = data;
  } catch (err) {
    error.value = err.message || 'Възникна проблем при комуникацията с базовия сървър.';
    console.error('API Error:', err);
  } finally {
    loading.value = false;
  }
};

// Извикване на функцията при монтиране на компонента
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.api-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.loading {
  font-style: italic;
  color: #666;
}

.error-message {
  color: #d9534f;
  background-color: #f2dede;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ebccd1;
}

.no-data {
  color: #777;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 2px 3px rgba(0,0,0,0.1);
}

.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #4caf50;
  color: white;
}

.data-table tr:hover {
  background-color: #f5f5f5;
}
</style>
