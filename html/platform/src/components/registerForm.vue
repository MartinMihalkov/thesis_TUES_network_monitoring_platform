<template>
  <div class="register-container">
    <h2>Регистрация на потребител</h2>
    
    <form @submit.prevent="handleRegister" class="register-form">
      <!-- Потребителско име -->
      <div class="form-group">
        <label for="username">Потребителско име:</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username" 
          placeholder="Въведете потребителско име"
          :disabled="loading"
          required
        />
      </div>

      <!-- Парола -->
      <div class="form-group">
        <label for="password">Парола:</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          placeholder="Въведете парола"
          :disabled="loading"
          required
        />
      </div>

      <!-- Бутон за изпращане -->
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Регистриране...' : 'Създай профил' }}
      </button>
    </form>

    <!-- Съобщения за обратна връзка -->
    <div v-if="message" class="alert success">{{ message }}</div>
    <div v-if="error" class="alert error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// URL адрес на вашия нов PHP скрипт
const API_URL = 'http://192.168.200.3/register.php'; 

// Реактивни променливи
const form = reactive({
  username: '',
  password: ''
});

const loading = ref(false);
const message = ref(null);
const error = ref(null);

// Функция за обработка на формата
const handleRegister = async () => {
  // Нулиране на съобщенията
  message.value = null;
  error.value = null;
  loading.value = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Преобразуваме данните в JSON стринг
      body: JSON.stringify({
        username: form.username,
        password: form.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Ако сървърът върне грешка (напр. 400, 409, 500)
      throw new Error(data.error || `Грешка при регистрация (Статус: ${response.status})`);
    }

    // При успешна регистрация (201 Created)
    message.value = data.message;
    
    // Изчистване на формата
    form.username = '';
    form.password = '';

  } catch (err) {
    error.value = err.message || 'Възникна неочаквана грешка при връзка със сървъра.';
    console.error('Registration Error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4caf50;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-btn {
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.alert {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}
</style>
