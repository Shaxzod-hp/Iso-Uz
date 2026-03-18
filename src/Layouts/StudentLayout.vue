<template>
  <div class="d-flex h-100 bg-white overflow-hidden position-relative w-100">
    <!-- Mobile overlay -->
    <div v-if="!isCollapsed && isMobile" class="mobile-overlay" @click="isCollapsed = true"></div>

    <!-- SIDEBAR -->
    <StudentSidebar :is-collapsed="isCollapsed" @toggle="isCollapsed = !isCollapsed"
      :class="{ 'mobile-sidebar': isMobile, 'mobile-open': !isCollapsed && isMobile }" />

    <!-- MAIN CONTENT -->
    <main class="student-main d-flex flex-column">
      <header
        class="student-header bg-white border-bottom d-flex align-items-center justify-content-between flex-shrink-0 py-0 px-3 px-md-4">
        <div class="header-left d-flex align-items-center gap-3">
          <!-- Mobile menu toggle -->
          <button v-if="isMobile" class="btn btn-light border-0 px-2 d-md-none" @click="isCollapsed = false">
            <i class="bi bi-list fs-4"></i>
          </button>
        </div>

        <div class="header-right">
          <div class="d-flex align-items-center gap-2 gap-md-4">
            <!-- Notifications -->
            <div class="dropdown">
              <button
                class="btn btn-light rounded-circle position-relative notification-btn border-0 shadow-sm d-flex align-items-center justify-content-center"
                type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width: 45px; height: 45px;">
                <i class="bi bi-bell fs-5 text-secondary"></i>
                <span v-if="store.unreadNotificationsCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style="font-size: 0.65rem;">
                  {{ store.unreadNotificationsCount }}
                </span>
              </button>

              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4 p-0 notification-dropdown">
                <li class="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-4">
                  <h6 class="mb-0 fw-bold">Xabarnomalar</h6>
                  <button v-if="store.unreadNotificationsCount > 0" class="btn btn-link btn-sm text-decoration-none p-0"
                    @click.stop="store.markAllNotificationsRead">
                    Barchasini o'qish
                  </button>
                </li>
                <div class="notification-list custom-scrollbar">
                  <li v-for="notif in store.notifications" :key="notif.id">
                    <div
                      class="dropdown-item p-3 border-bottom d-flex gap-3 align-items-start text-wrap notification-item"
                      :class="{ 'bg-primary-subtle': !notif.read }" @click="store.markNotificationRead(notif.id)">
                      <div
                        class="notification-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        :class="`bg-${notif.type}-subtle text-${notif.type}`">
                        <i :class="notif.icon"></i>
                      </div>
                      <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <h6 class="mb-0 fw-semibold text-dark fs-6">{{ notif.title }}</h6>
                          <span class="text-muted" style="font-size: 11px">{{ notif.date.split(' ')[1] }}</span>
                        </div>
                        <p class="mb-0 text-secondary small lh-sm">{{ notif.message }}</p>
                      </div>
                    </div>
                  </li>
                  <li v-if="store.notifications.length === 0" class="p-4 text-center text-muted">
                    Hozircha xabarlar yo'q
                  </li>
                </div>
                <li class="p-2 text-center border-top">
                  <router-link to="/student/notifications" class="text-decoration-none small fw-semibold">Barcha
                    xabarlarni ko'rish</router-link>
                </li>
              </ul>
            </div>

            <button class="theme-toggle-btn border-0" @click="store.toggleDarkMode">
              <i :class="['bi', store.isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill']"></i>
            </button>
            <!-- User Profile -->
            <div class="d-flex align-items-center gap-2 gap-md-3">
              <div v-if="!store.currentStudent?.avatarImg"
                class="student-avatar text-white d-flex align-items-center justify-content-center fw-bold rounded-circle shadow-sm"
                :style="{ background: store.currentStudent?.color || '#3b82f6' }">
                {{ store.currentStudent?.avatar || "S" }}
              </div>
              <img v-else :src="store.currentStudent.avatarImg"
                class="student-avatar rounded-circle object-fit-cover shadow-sm" />
              <div class="d-none d-sm-flex flex-column">
                <span class="student-name text-dark fw-bold" style="font-size: 15px">{{
                  store.currentStudent?.name || "Talaba"
                }}</span>
                <span class="student-role fw-semibold text-primary">Student</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="content-scroll container-fluid pb-5 custom-scrollbar">
        <router-view class="page-transition" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useMainStore } from "@/stores";
import StudentSidebar from "@/Layouts/StudentSidebar.vue";

const store = useMainStore();

const isCollapsed = ref(false);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    isCollapsed.value = true;
  } else {
    isCollapsed.value = false;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.student-main {
  flex: 1;
  min-width: 0;
  background-color: #f8fafc;
  height: 100vh;
}

.student-header {
  height: 75px;
  z-index: 10;
}

.student-avatar {
  width: 45px;
  height: 45px;
  font-size: 18px;
  border: 2px solid white;
}

.student-role {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.content-scroll {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.notification-dropdown {
  width: 320px;
  max-width: 90vw;
}

.notification-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-icon {
  width: 40px;
  height: 40px;
  font-size: 18px;
}

.notification-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8fafc;
}

.bg-primary-subtle {
  background-color: #e0e7ff !important;
}

.bg-warning-subtle {
  background-color: #fef3c7 !important;
  color: #d97706 !important;
}

.bg-success-subtle {
  background-color: #dcfce7 !important;
  color: #16a34a !important;
}

.bg-info-subtle {
  background-color: #ccfbf1 !important;
  color: #0d9488 !important;
}

.bg-danger-subtle {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Page Transition */
.page-transition {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Sidebar Logic */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1040;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1050;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-sidebar.mobile-open {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .content-scroll {
    padding: 16px 12px;
  }
}
</style>
