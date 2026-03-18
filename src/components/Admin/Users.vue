<template>
    <div class="users-view">
        <!-- STATS CARDS -->
        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon all">
                    <i class="bi bi-people"></i>
                </div>
                <div class="stat-info">
                    <span class="stat-label">Jami foydalanuvchilar</span>
                    <h3 class="stat-value">{{ authStore.users.length }}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon teacher">
                    <i class="bi bi-person-workspace"></i>
                </div>
                <div class="stat-info">
                    <span class="stat-label">O'qituvchilar</span>
                    <h3 class="stat-value">{{ teachersCount }}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon student">
                    <i class="bi bi-mortarboard"></i>
                </div>
                <div class="stat-info">
                    <span class="stat-label">Talabalar</span>
                    <h3 class="stat-value">{{ studentsCount }}</h3>
                </div>
            </div>
        </div>

        <div class="view-header">
            <div class="filters-box">
                <div class="search-box">
                    <i class="bi bi-search"></i>
                    <input type="text" v-model="searchQuery" placeholder="Ism yoki email bo'yicha qidirish..." />
                </div>
                <div class="role-tabs">
                    <button :class="{ active: activeRole === 'all' }" @click="activeRole = 'all'">Barchasi</button>
                    <button :class="{ active: activeRole === 'teacher' }"
                        @click="activeRole = 'teacher'">O'qituvchilar</button>
                    <button :class="{ active: activeRole === 'student' }"
                        @click="activeRole = 'student'">Talabalar</button>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline-primary me-2" @click="openModal('student')">
                    <i class="bi bi-mortarboard me-2"></i> Talaba qo'shish
                </button>
                <button class="btn btn-primary" @click="openModal('teacher')">
                    <i class="bi bi-person-workspace me-2"></i> O'qituvchi qo'shish
                </button>
            </div>
        </div>

        <div class="table-card mt-4">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Foydalanuvchi</th>
                            <th>Login</th>
                            <th>Rol</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th class="text-end">Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in filteredUsers" :key="user.id">
                            <td>
                                <div class="user-cell">
                                    <div class="user-avatar" :style="{ background: user.color }">{{ user.avatar }}</div>
                                    <div class="user-meta">
                                        <span class="user-name">{{ user.fullName || user.name }}</span>
                                        <span class="user-subtext">{{ user.role === 'teacher' ? user.specialty :
                                            user.group }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="text-muted">@{{ user.username || user.login }}</td>
                            <td>
                                <span :class="['role-badge', user.role]">
                                    {{ user.role === 'student' ? 'Talaba' : 'O\'qituvchi' }}
                                </span>
                            </td>
                            <td>{{ user.email || 'Email yo\'q' }}</td>
                            <td>
                                <span class="status-badge active">Faol</span>
                            </td>
                            <td class="text-end">
                                <button class="action-btn edit" @click="editUser(user)"><i
                                        class="bi bi-pencil"></i></button>
                                <button class="action-btn delete" @click="deleteUser(user.id)"><i
                                        class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-if="filteredUsers.length === 0">
                            <td colspan="6" class="text-center py-5 text-muted">Hech qanday foydalanuvchi topilmadi</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL -->
        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ editingUser ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi qo\'shish' }}</h3>
                    <button class="close-btn" @click="closeModal">&times;</button>
                </div>

                <form @submit.prevent="saveUser" class="modal-form">
                    <div class="input-grid">
                        <div class="input-block">
                            <label>Familya va Ism</label>
                            <input v-model="form.fullName" type="text" placeholder="Masalan: Sardor Alimov" required />
                        </div>
                        <div class="input-block">
                            <label>Login (Username)</label>
                            <input v-model="form.username" type="text" placeholder="Masalan: sardor301" required />
                        </div>
                        <div class="input-block">
                            <label>Email</label>
                            <input v-model="form.email" type="email" placeholder="example@isouz.uz" required />
                        </div>
                        <div class="input-block">
                            <label>Rol</label>
                            <select v-model="form.role">
                                <option value="student">Talaba</option>
                                <option value="teacher">O'qituvchi</option>
                            </select>
                        </div>
                        <div class="input-block" v-if="form.role === 'student'">
                            <label>Guruh</label>
                            <input v-model="form.group" type="text" placeholder="Masalan: Frontend 301" required />
                        </div>
                        <div class="input-block" v-if="form.role === 'teacher'">
                            <label>Mutaxassislik</label>
                            <input v-model="form.specialty" type="text" placeholder="Masalan: Vue.js Developer"
                                required />
                        </div>
                        <div class="input-block">
                            <label>Parol</label>
                            <input v-model="form.password" type="text" :required="!editingUser"
                                :placeholder="editingUser ? '(O\'zgartirish uchun yozing)' : 'Bir martalik parol'" />
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-outline" @click="closeModal">Bekor qilish</button>
                        <button type="submit" class="btn btn-primary">Saqlash</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMainStore } from '@/stores'

const authStore = useAuthStore()
const mainStore = useMainStore()
const searchQuery = ref('')
const activeRole = ref('all')
const showModal = ref(false)
const editingUser = ref(null)

const form = ref({
    fullName: '',
    username: '',
    email: '',
    role: 'student',
    group: '',
    specialty: '',
    password: ''
})

const teachersCount = computed(() => authStore.users.filter(u => u.role === 'teacher').length)
const studentsCount = computed(() => authStore.users.filter(u => u.role === 'student').length)

const filteredUsers = computed(() => {
    return authStore.users.filter(u => {
        const matchesSearch = (u.fullName || u.name)?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (u.username || u.login)?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesRole = activeRole.value === 'all' || u.role === activeRole.value

        return matchesSearch && matchesRole
    })
})

function openModal(defaultRole = 'student') {
    resetForm()
    form.value.role = defaultRole
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    editingUser.value = null
    resetForm()
}

function resetForm() {
    form.value = {
        fullName: '',
        username: '',
        email: '',
        role: 'student',
        group: '',
        specialty: '',
        password: ''
    }
}

function editUser(user) {
    editingUser.value = user.id
    form.value = {
        fullName: user.fullName || user.name,
        username: user.username || user.login,
        email: user.email,
        role: user.role,
        group: user.group || '',
        specialty: user.specialty || '',
        password: ''
    }
    showModal.value = true
}

function saveUser() {
    const userData = {
        ...form.value,
        name: form.value.fullName, // for mainStore compatibility
        login: form.value.username // for mainStore compatibility
    }

    if (editingUser.value) {
        // Find in mainStore
        let found = false
        const sIdx = mainStore.students.findIndex(s => s.id === editingUser.value)
        if (sIdx !== -1) {
            mainStore.students[sIdx] = { ...mainStore.students[sIdx], ...userData }
            found = true
        } else {
            const tIdx = mainStore.teachers.findIndex(t => t.id === editingUser.value)
            if (tIdx !== -1) {
                mainStore.teachers[tIdx] = { ...mainStore.teachers[tIdx], ...userData }
                found = true
            }
        }

        if (found) {
            mainStore.saveAll()
        }
    } else {
        authStore.register(userData)
    }

    closeModal()
}

function deleteUser(id) {
    if (confirm('Ushbu foydalanuvchini o\'chirishga ishonchingiz komilmi?')) {
        authStore.deleteUser(id)
    }
}
</script>

<style scoped>
.users-view {
    padding-bottom: 30px;
}

/* STATS CARDS */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.stat-card {
    background: white;
    padding: 20px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.stat-icon.all {
    background: #eff6ff;
    color: #3b82f6;
}

.stat-icon.teacher {
    background: #fffbeb;
    color: #d97706;
}

.stat-icon.student {
    background: #eef2ff;
    color: #6366f1;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 2px;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.filters-box {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
}

.search-box {
    flex: 1;
    max-width: 300px;
    position: relative;
}

.search-box i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
}

.search-box input {
    width: 100%;
    padding: 10px 15px 10px 45px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    outline: none;
    transition: all 0.2s;
}

.search-box input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.role-tabs {
    display: flex;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 10px;
    gap: 4px;
}

.role-tabs button {
    border: none;
    background: none;
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
}

.role-tabs button.active {
    background: white;
    color: #3b82f6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.table {
    margin: 0;
}

.table th {
    padding: 15px 25px;
    background: #f8fafc;
    color: #64748b;
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
}

.table td {
    padding: 15px 25px;
    vertical-align: middle;
    border-bottom: 1px solid #f1f5f9;
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
}

.user-meta {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
}

.user-subtext {
    font-size: 0.75rem;
    color: #94a3b8;
}

.role-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.role-badge.student {
    background: #e0e7ff;
    color: #4338ca;
}

.role-badge.teacher {
    background: #fef3c7;
    color: #b45309;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
}

.status-badge.active {
    background: #dcfce7;
    color: #15803d;
}

.action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: none;
    cursor: pointer;
    margin-left: 5px;
    transition: all 0.2s;
}

.action-btn.edit {
    color: #3b82f6;
}

.action-btn.edit:hover {
    background: #eff6ff;
}

.action-btn.delete {
    color: #ef4444;
}

.action-btn.delete:hover {
    background: #fef2f2;
}

/* MODAL */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 0;
    border-radius: 20px;
    width: 100%;
    max-width: 600px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
    padding: 20px 30px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #94a3b8;
    cursor: pointer;
}

.modal-form {
    padding: 30px;
}

.input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.input-block label {
    display: block;
    font-weight: 500;
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 8px;
}

.input-block input,
.input-block select {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    outline: none;
    transition: 0.2s;
}

.input-block input:focus {
    border-color: #3b82f6;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 30px;
}

@media (max-width: 992px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .view-header {
        flex-direction: column;
        align-items: stretch;
    }

    .filters-box {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        max-width: none;
    }

    .input-grid {
        grid-template-columns: 1fr;
    }
}
</style>
