<template>
  <aside :class="['student-sidebar', { collapsed: isCollapsed }]">
    <!-- HEADER -->
    <div class="sidebar-header">
      <div class="logo-box">
        <img src="/logotip.png" alt="Logo" width="35" />
        <span class="logo-text">Iso<span class="text-danger">Uz</span></span>
      </div>

      <button class="toggle-btn" @click="emit('toggle')">
        <i :class="['bi', isCollapsed ? 'bi-list' : 'bi-chevron-left']"></i>
      </button>
    </div>

    <!-- MENU -->
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">
        <i class="bi bi-box-arrow-left"></i>
        <span>Chiqish</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  isCollapsed: Boolean,
});
const emit = defineEmits(["toggle"]);

const authStore = useAuthStore();
const router = useRouter();

const menuItems = [
  {
    path: "/student/dashboard",
    label: "Bosh sahifa",
    icon: "bi bi-house-door",
  },
  { path: "/student/payments", label: "To'lovlar", icon: "bi bi-credit-card" },
  { path: "/student/groups", label: "Guruhlarim", icon: "bi bi-people" },
  { path: "/student/reyting", label: "Reyting", icon: "bi bi-bar-chart" },
  { path: "/student/project", label: "Loyihalar", icon: "bi bi-kanban" },
  { path: "/student/market", label: "Do'kon", icon: "bi bi-cart3" },
  {
    path: "/student/extralessen",
    label: "Qo'shimcha darslar",
    icon: "bi bi-journals",
  },
  { path: "/student/profile", label: "Profil", icon: "bi bi-person" },
];

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.student-sidebar {
  width: 260px;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
}

.student-sidebar.collapsed {
  width: 80px;
}

/* HEADER */
.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  min-width: 0;
}
.logo-box img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 700;
  font-size: 1.2rem;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.student-sidebar.collapsed .logo-text {
  opacity: 0;
}

/* TOGGLE */
.toggle-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.2s;
}

.toggle-btn:hover {
  color: white;
}

/* NAV */
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
  transition: all 0.25s ease;
  justify-content: flex-start;
}

/* ICON FIX */
.nav-item i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

/* TEXT */
.nav-item span {
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.student-sidebar.collapsed .nav-item span {
  opacity: 0;
  pointer-events: none;
}

/* ACTIVE + HOVER */
.nav-item:hover,
.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* FOOTER */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* LOGOUT */
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
  justify-content: flex-start;
}

.logout-btn i {
  width: 24px;
  text-align: center;
}

.logout-btn span {
  transition: opacity 0.2s ease;
}

.student-sidebar.collapsed .logout-btn span {
  opacity: 0;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}
</style>
