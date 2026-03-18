<template>
  <router-view></router-view>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { useMainStore } from '@/stores';

const store = useMainStore();

watch(() => store.isDarkMode, (val) => {
  if (val) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
}, { immediate: true });

onMounted(() => {
  if (store.isDarkMode) {
    document.documentElement.classList.add('dark-mode');
  }
});
</script>

<style></style>