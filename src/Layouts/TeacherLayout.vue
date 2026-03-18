<template>
  <div class="teacher-layout">
    <!-- SIDEBAR -->
    <TeacherSidebar :is-collapsed="isCollapsed" @toggle="isCollapsed = !isCollapsed" />

    <!-- MAIN CONTENT -->
    <main class="teacher-main">
      <header class="teacher-header">
        <div class="header-left">
          <!-- Page title removed as requested -->
        </div>
        <div class="header-right">
          <div class="teacher-profile">
            <button class="theme-toggle-btn" @click="store.toggleDarkMode">
              <i :class="['bi', store.isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill']"></i>
            </button>
            <div class="teacher-avatar" :style="{ background: authStore.currentUser?.color || '#3b82f6' }">
              <img v-if="authStore.currentUser?.avatarImg" :src="authStore.currentUser.avatarImg" alt="User Avatar"
                class="avatar-img" />
              <span v-else>{{ authStore.currentUser?.avatar || 'O\'' }}</span>
            </div>
            <div class="teacher-info">
              <span class="teacher-name">{{ authStore.currentUser?.fullName || authStore.currentUser?.name ||
                'O\'qituvchi' }}</span>
              <span class="teacher-role">O'qituvchi</span>
            </div>
          </div>
        </div>
      </header>

      <div class="content-scroll">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMainStore } from '@/stores'
import TeacherSidebar from "@/Layouts/TeacherSidebar.vue"

const authStore = useAuthStore()
const store = useMainStore()
const isCollapsed = ref(false)

</script>

<style scoped>
.teacher-layout {
  display: flex;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

.teacher-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.teacher-header {
  height: 70px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  flex-shrink: 0;
}

.teacher-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-avatar {
  width: 40px;
  height: 40px;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.teacher-info {
  display: flex;
  flex-direction: column;
}

.teacher-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.teacher-role {
  font-size: 0.75rem;
  color: #64748b;
}

.content-scroll {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .teacher-header {
    padding: 0 15px;
  }
}
</style>
