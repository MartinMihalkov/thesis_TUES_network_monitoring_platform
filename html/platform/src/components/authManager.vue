<template>
  <div class="auth-container">
    <h2>Вход в системата</h2>
    
    <form @submit.prevent="handleLogin" class="auth-form">
      <!-- Потребителско име -->
      <div class="form-group">
        <label for="username">Потребителско име:</label>
        <input 
          id="username"
          v-model="username" 
          type="text" 
          placeholder="Въведете потребителско име" 
          required 
        />
      </div>

      <!-- Парола -->
      <div class="form-group">
        <label for="password">Парола:</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          placeholder="Въведете парола" 
          required 
        />
      </div>

      <!-- Бутон за изпращане -->
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Зареждане...' : 'Влез' }}
      </button>
    </form>

    <!-- Съобщения за грешка или успех -->
    <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="message success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 1. Импортираме рутера

// Реактивни променливи за формата
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const router = useRouter(); // 2. Инициализираме рутера

// Функция за обработка на формата при изпращане
const handleLogin = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const response = await fetch('http://192.168.200.3/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Възникна грешка при вход.');
    }

    // При успешен вход (код 200)
    successMessage.value = data.message;
    console.log('Успешен отговор от сървъра:', data);
    
    // (По избор) Запазете токена/сесията тук преди пренасочването
    // localStorage.setItem('token', data.token);

    // Изчистваме полетата

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loggedUser', username.value); 

    username.value = '';
    password.value = '';
    // 3. Пренасочваме потребителя към /dashboard
    router.push('/dashboard');

  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 24px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
}

input:focus {
  border-color: #42b883; /* Vue зелено */
}

button {
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #42b883;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #35495e;
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.error {
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.success {
  background-color: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}
</style>
