<template>
  <div class="auth-wrapper">
    <!-- Остава само Формата за вход. Dashboard изгледът отива в отделен компонент/страница -->
    <div class="auth-container">
      <h2>Вход в системата</h2>
      
      <form @submit.prevent="handleLogin" class="auth-form">
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

        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Проверка...' : 'Влез' }}
        </button>
      </form>

      <div v-if="error" class="alert error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; // 1. Импортираме рутера

// URL към вашия PHP скрипт за вход
const API_URL = 'http://192.168.200.3/login.php'; 

const router = useRouter(); // 2. Инициализираме рутера

// Реактивни състояния
const form = reactive({
  username: '',
  password: ''
});

const loading = ref(false);
const error = ref(null);

// Функция за изпращане на данните и проверка
const handleLogin = async () => {
  error.value = null;
  loading.value = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Неуспешен опит за вход.');
    }

    // 3. Запазваме сесията локално в браузъра (за да знае рутерът, че сме логнати)
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loggedUser', data.username);
    
    // 4. Истинско пренасочване към новия URL адрес в браузъра!
    router.push('/dashboard'); 

  } catch (err) {
    error.value = err.message || 'Грешка при комуникация със сървъра.';
    console.error('Login Error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-wrapper {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: 1px solid #eaeaea;
}

h2 {
  margin-bottom: 25px;
  color: #2c3e50;
  text-align: center;
}

.auth-form {
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
  font-weight: 600;
  color: #4a5568;
}

input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.submit-btn {
  margin-top: 10px;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.alert {
  margin-top: 15px;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.error {
  color: #991b1b;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
}
</style>
