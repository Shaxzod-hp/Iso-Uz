<template>
    <aside :class="['teacher-sidebar', { collapsed: isCollapsed }]">
        <div
            class="sidebar-header d-flex align-items-center justify-content-between py-0 px-3 border-secondary border-bottom">
            <div class="logo-box d-flex align-items-center gap-2 overflow-hidden flex-shrink-0">
                <img src="/logotip.png" alt="Logo" width="40" style="flex-shrink: 0;">
                <span v-if="!isCollapsed" class="logo-text">Iso<span class="text-danger">Uz</span></span>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="toggle-btn" @click="emit('toggle')">
                    <i :class="['bi', isCollapsed ? 'bi-list' : 'bi-chevron-left']"></i>
                </button>
            </div>
        </div>

        <nav class="sidebar-nav">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item">
                <i :class="item.icon"></i>
                <span v-if="!isCollapsed">{{ item.label }}</span>
            </router-link>
        </nav>

        <div class="sidebar-footer">
            <button class="logout-btn" @click="handleLogout">
                <i class="bi bi-box-arrow-left"></i>
                <span v-if="!isCollapsed">Chiqish</span>
            </button>
        </div>
    </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMainStore } from '@/stores'

const store = useMainStore()

const props = defineProps({
    isCollapsed: Boolean
})
const emit = defineEmits(['toggle'])

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { path: '/teacher/groups', label: 'Guruhlar', icon: 'bi bi-collection' },
    { path: '/teacher/students', label: 'Talabalar', icon: 'bi bi-people' },
    { path: '/teacher/assignments', label: 'Vazifalar', icon: 'bi bi-journal-check' },
    { path: '/teacher/attendance', label: 'Davomat', icon: 'bi bi-calendar-check' },
    { path: '/teacher/profile', label: 'Profil', icon: 'bi bi-person' },
]

function handleLogout() {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.teacher-sidebar {
    width: 260px;
    background: #1e293b;
    color: white;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    height: 100vh;
    flex-shrink: 0;
}

.teacher-sidebar.collapsed {
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

.toggle-btn,
.theme-toggle-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.theme-toggle-btn:hover {
    color: #f59e0b;
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
</style>
