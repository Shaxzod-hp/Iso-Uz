<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside :class="['admin-sidebar', { collapsed: isCollapsed }]">
      <div class="sidebar-header">
        <div class="logo-box">
          <img src="/logotip.png" alt="Logo" width="40" />
          <span v-if="!isCollapsed" class="logo-text">IsoUz <span class="text-danger">Admin</span></span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="toggle-btn" @click="isCollapsed = !isCollapsed">
            <i :class="['bi', isCollapsed ? 'bi-list' : 'bi-chevron-left']"></i>
          </button>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          <i class="bi bi-speedometer2"></i>
          <span v-if="!isCollapsed">Dashboard</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item">
          <i class="bi bi-people"></i>
          <span v-if="!isCollapsed">Foydalanuvchilar</span>
        </router-link>
        <router-link to="/admin/analytics" class="nav-item">
          <i class="bi bi-graph-up"></i>
          <span v-if="!isCollapsed">Analitika</span>
        </router-link>
        <router-link to="/admin/finance" class="nav-item">
          <i class="bi bi-wallet2"></i>
          <span v-if="!isCollapsed">Moliya</span>
        </router-link>
        <router-link to="/admin/courses" class="nav-item">
          <i class="bi bi-journal-text"></i>
          <span v-if="!isCollapsed">Kurslar</span>
        </router-link>
        <router-link to="/admin/settings" class="nav-item">
          <i class="bi bi-gear"></i>
          <span v-if="!isCollapsed">Sozlamalar</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <i class="bi bi-box-arrow-left"></i>
          <span v-if="!isCollapsed">Chiqish</span>
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="admin-main">
      <header class="admin-header">
        <div class="header-left">
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>
        <div class="header-right">
          <button class="theme-toggle-btn me-3" @click="mainStore.toggleDarkMode">
            <i :class="['bi', mainStore.isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill']"></i>
          </button>
          <div class="admin-profile">
            <div class="admin-avatar">A</div>
            <div class="admin-info">
              <span class="admin-name">Administrator</span>
              <span class="admin-role">Asosiy admin</span>
            </div>
          </div>
        </div>
      </header>

      <div class="content-scroll">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMainStore } from "@/stores";

const mainStore = useMainStore();

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isCollapsed = ref(false);

const pageTitle = computed(() => {
  if (route.path.includes("dashboard")) return "Dashboard";
  if (route.path.includes("users")) return "Foydalanuvchilar";
  if (route.path.includes("groups")) return "Guruhlar";
  if (route.path.includes("analytics")) return "Analitika";
  if (route.path.includes("finance")) return "Moliya";
  if (route.path.includes("courses")) return "Kurslar";
  if (route.path.includes("settings")) return "Sozlamalar";
  return "Admin Panel";
});

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

/* SIDEBAR */
.admin-sidebar {
  width: 260px;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.admin-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.logo-text {
  font-weight: 700;
  font-size: 1.2rem;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle-btn {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.theme-toggle-btn:hover {
  background: #e2e8f0;
  color: #3b82f6;
}

.toggle-btn:hover {
  color: white;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item i {
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}

/* MAIN */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-header {
  height: 70px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  flex-shrink: 0;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.admin-info {
  display: flex;
  flex-direction: column;
}

.admin-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.admin-role {
  font-size: 0.75rem;
  color: #64748b;
}

.content-scroll {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    z-index: 100;
    height: 100%;
  }

  .admin-sidebar.collapsed {
    width: 0;
    padding: 0;
    overflow: hidden;
  }
}
</style>
