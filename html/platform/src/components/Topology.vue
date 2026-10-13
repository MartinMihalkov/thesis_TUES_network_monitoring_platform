<template>
  <div class="diagram-wrapper">
    <!-- Основният контейнер на Vue Flow -->
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view-on-init="true"
      class="custom-flow"
    >
      <!-- Добавяне на фонова мрежа за по-лесно ориентиране -->
      <Background pattern-color="#aaa" :gap="16" />
    </VueFlow>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Импортиране на основните компоненти от Vue Flow
import { VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';

// 1. Дефиниране на възлите (елементите в диаграмата)
const nodes = ref([
  {
    id: '1',
    type: 'input', // Начален елемент (има изход само отдолу/отстрани)
    label: 'Начало: Потребителски Вход',
    position: { x: 250, y: 50 },
    class: 'node-start',
  },
  {
    id: '2',
    label: 'Проверка в Базата Данни (PHP API)',
    position: { x: 100, y: 180 },
    class: 'node-process',
  },
  {
    id: '3',
    type: 'output', // Краен елемент (има само вход отгоре)
    label: 'Успешен Dashboard!',
    position: { x: 400, y: 180 },
    class: 'node-success',
  },
]);

// 2. Дефиниране на връзките (стрелките между елементите)
const edges = ref([
  {
    id: 'e1-2',
    source: '1', // От кой възел тръгва
    target: '2', // Към кой възел отива
    label: 'Изпращане на данни',
    animated: true, // Прави линията анимирана (на точки, които се движат)
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    label: 'При съществуваща сесия',
    style: { stroke: '#10b981' }, // Зелена линия
  },
]);
</script>

<!-- Важно: Зареждане на задължителните стилове на Vue Flow -->
<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.diagram-wrapper {
  width: 100%;
  height: 500px; /* Задължително трябва да има дефинирана височина */
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #f8fafc;
  overflow: hidden;
}

.custom-flow {
  width: 100%;
  height: 100%;
}

/* Персонализирано стилизиране на възлите */
.vue-flow__node {
  padding: 12px;
  border-radius: 6px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.node-start {
  background-color: #3b82f6;
  color: white;
  border: 1px solid #1d4ed8;
}

.node-process {
  background-color: #f59e0b;
  color: white;
  border: 1px solid #d97706;
}

.node-success {
  background-color: #10b981;
  color: white;
  border: 1px solid #047857;
}
</style>
