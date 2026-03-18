<!-- script -->
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores";
const store = useMainStore();
const router = useRouter();

const activeTab = ref("active");

const groupColors = [
  "linear-gradient(135deg,#6366f1,#818cf8)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
  "linear-gradient(135deg,#10b981,#34d399)",
  "linear-gradient(135deg,#ef4444,#f87171)",
  "linear-gradient(135deg,#8b5cf6,#a78bfa)",
  "linear-gradient(135deg,#0ea5e9,#38bdf8)",
];

const myGroups = computed(() => store.currentStudent?.groups || []);

const activeGroups = computed(() =>
  myGroups.value.filter((g) => g.status === "active")
);

const finishedGroups = computed(() =>
  myGroups.value.filter((g) => g.status !== "active")
);

const displayedGroups = computed(() =>
  activeTab.value === "active" ? activeGroups.value : finishedGroups.value
);

function goToGroup(group) {
  router.push({ path: `/student/group/${group.name}` });
}
</script>

<!-- html -->
<template>
  <div class="container-fluid py-1">
    <!-- Tabs -->
    <div class="mb-4 pb-2 d-flex gap-4">
      <button class="btn fs-5 fw-semibold border-0 px-0 tab-btn"
        :class="activeTab === 'active' ? 'text-dark tab-active' : 'text-secondary'" @click="activeTab = 'active'">
        Faol
        <span class="badge ms-1 rounded-pill" :class="activeTab === 'active' ? 'bg-primary' : 'bg-secondary'">
          {{ activeGroups.length }}
        </span>
      </button>

      <button class="btn fs-5 fw-semibold border-0 px-0 tab-btn"
        :class="activeTab === 'finished' ? 'text-dark tab-active' : 'text-secondary'" @click="activeTab = 'finished'">
        Tugagan
        <span class="badge ms-1 rounded-pill" :class="activeTab === 'finished' ? 'bg-primary' : 'bg-secondary'">
          {{ finishedGroups.length }}
        </span>
      </button>
    </div>

    <!-- Group Cards -->
    <div class="row g-4" v-if="displayedGroups.length">
      <div class="col-lg-6 col-xl-4 cursor-pointer" v-for="(group, index) in displayedGroups" :key="group.id ?? index"
        @click="goToGroup(group)">
        <div class="card border-0 shadow-sm rounded-4 h-100 group-card">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="group-icon rounded-3 d-flex align-items-center justify-content-center"
                :style="{ background: groupColors[index % groupColors.length] }">
                <i class="bi bi-people-fill text-white fs-5"></i>
              </div>
              <span class="badge rounded-pill px-3 py-2"
                :class="group.status === 'active' ? 'status-active' : 'status-finished'">
                {{ group.status === "active" ? "Faol" : "Tugagan" }}
              </span>
            </div>

            <h5 class="fw-bold mb-1">{{ group.name }}</h5>
            <p class="text-muted small mb-3">{{ group.direction }}</p>

            <div class="info-items">
              <div class="info-item d-flex align-items-center gap-2">
                <i class="bi bi-person-badge text-primary"></i>
                <span class="text-muted small">O'qituvchi:</span>
                <span class="fw-semibold small">{{ group.teacher }}</span>
              </div>
              <div class="info-item d-flex align-items-center gap-2">
                <i class="bi bi-calendar-check text-success"></i>
                <span class="text-muted small">Boshlangan:</span>
                <span class="fw-semibold small">{{ group.start }}</span>
              </div>
            </div>
          </div>
          <div class="card-footer bg-light border-0 p-3 text-center">
            <button class="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold">Darslarni ko'rish</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-5">
      <i class="bi bi-people fs-1 text-muted d-block mb-3"></i>
      <h5 class="text-muted">
        {{ activeTab === "active" ? "Faol guruhlar yo'q" : "Tugagan guruhlar yo'q" }}
      </h5>
    </div>
  </div>
</template>

<!-- style -->
<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.tab-btn {
  position: relative;
  transition: color 0.2s;
}

.tab-active::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #6366f1;
  border-radius: 2px;
}

.group-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.group-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.group-icon {
  width: 48px;
  height: 48px;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.status-active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-finished {
  background-color: #f1f5f9;
  color: #64748b;
}
</style>
