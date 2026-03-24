<template>
    <div class="notifications-page py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">Bildirishnomalar</h4>
            <button @click="markAllAsRead" class="btn btn-sm btn-outline-primary rounded-pill px-3"
                v-if="unreadCount > 0">
                Hammasini o'qilgan deb belgilash
            </button>
        </div>

        <div v-if="notifications.length === 0" class="text-center py-5">
            <div class="mb-3 text-muted">
                <i class="bi bi-bell-slash display-1 opacity-25"></i>
            </div>
            <h5>Hozircha bildirishnomalar yo'q</h5>
            <p class="text-muted small">Yangi xabarlar kelganda shu yerda ko'rinadi</p>
        </div>

        <div v-else class="row g-3">
            <div v-for="n in sortedNotifications" :key="n.id" class="col-12">
                <div class="card border-0 shadow-sm rounded-4 p-3 notification-card" :class="{ 'unread': !n.read }">
                    <div class="d-flex gap-3">
                        <div class="icon-box rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            :style="{ backgroundColor: n.bgColor || '#eff6ff', color: n.iconColor || '#3b82f6' }">
                            <i :class="n.icon || 'bi bi-info-circle'"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <h6 class="fw-bold mb-1">{{ n.title }}</h6>
                                <small class="text-muted">{{ formatTime(n.time) }}</small>
                            </div>
                            <p class="mb-0 text-muted small">{{ n.message }}</p>
                        </div>
                        <div v-if="!n.read" class="unread-dot"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/stores';

const store = useMainStore();

const notifications = computed(() => store.notifications || []);
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

const sortedNotifications = computed(() => {
    return [...notifications.value].sort((a, b) => new Date(b.time) - new Date(a.time));
});

function markAllAsRead() {
    notifications.value.forEach(n => n.read = true);
    store.saveAll();
}

function formatTime(time) {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.notification-card {
    transition: all 0.2s ease;
    border-left: 4px solid transparent !important;
}

.notification-card.unread {
    background-color: #f8fafc;
    border-left-color: #3b82f6 !important;
}

.notification-card:hover {
    transform: translateX(5px);
    background-color: #f1f5f9;
}

.icon-box {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
}

.unread-dot {
    width: 8px;
    height: 8px;
    background-color: #3b82f6;
    border-radius: 50%;
    margin-top: 6px;
}
</style>
