<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon students"><i class="bi bi-mortarboard"></i></div>
        <div class="stat-info">
          <h3>Talabalar</h3>
          <p class="stat-value">{{ studentCount }}</p>
          <span class="stat-trend positive">+12% o'sish</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teachers">
          <i class="bi bi-person-workspace"></i>
        </div>
        <div class="stat-info">
          <h3>O'qituvchilar</h3>
          <p class="stat-value">{{ teacherCount }}</p>
          <span class="stat-trend positive">+5% o'sish</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon groups"><i class="bi bi-collection"></i></div>
        <div class="stat-info">
          <h3>Guruhlar</h3>
          <p class="stat-value">{{ groupCount }}</p>
          <span class="stat-trend">Hozirda faol</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">
          <i class="bi bi-currency-dollar"></i>
        </div>
        <div class="stat-info">
          <h3>Tushumlar</h3>
          <p class="stat-value">{{ mainStore.financeStats.totalBalance.toLocaleString() }} UZS</p>
          <span class="stat-trend positive">+8% o'sish</span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid mt-4">
      <div class="chart-box">
        <div class="box-header">
          <h3>Ro'yxatdan o'tish dinamikasi</h3>
          <select class="form-select-sm">
            <option>Oxirgi 7 kun</option>
            <option>Oxirgi 30 kun</option>
          </select>
        </div>
        <div class="chart-placeholder">
          <div class="dummy-bar" style="height: 40%"></div>
          <div class="dummy-bar" style="height: 60%"></div>
          <div class="dummy-bar" style="height: 80%"></div>
          <div class="dummy-bar" style="height: 50%"></div>
          <div class="dummy-bar" style="height: 90%"></div>
          <div class="dummy-bar" style="height: 70%"></div>
          <div class="dummy-bar" style="height: 85%"></div>
        </div>
      </div>

      <div class="recent-users">
        <div class="box-header">
          <h3>Oxirgi ro'yxatdan o'tganlar</h3>
          <router-link to="/admin/users" class="btn-link">Hammasi</router-link>
        </div>
        <div class="user-list">
          <div v-for="user in recentUsers" :key="user.id" class="user-item">
            <div class="user-avatar" :style="{ background: user.color || '#3b82f6' }">
              {{ (user.name || user.fullName || '?')[0] }}
            </div>
            <div class="user-meta">
              <span class="user-name">{{ user.name || user.fullName }}</span>
              <span class="user-role">{{
                user.role === "teacher" ? "O'qituvchi" : "Talaba"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMainStore } from "@/stores";

const authStore = useAuthStore();
const mainStore = useMainStore();

const studentCount = computed(() => mainStore.students.length);
const teacherCount = computed(() => mainStore.teachers.length);

const groupCount = computed(() => mainStore.allGroups.length);

const recentUsers = computed(() => {
  const all = [
    ...mainStore.students.map(s => ({ ...s, role: 'student' })),
    ...mainStore.teachers.map(t => ({ ...t, role: 'teacher' }))
  ];
  return all.slice(-5).reverse();
});

function formatDate(dateStr) {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  if (isNaN(d)) return "-";

  return d.toLocaleDateString();
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.students {
  background: #e0e7ff;
  color: #4f46e5;
}

.stat-icon.teachers {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon.groups {
  background: #dcfce7;
  color: #16a34a;
}

.stat-icon.revenue {
  background: #fae8ff;
  color: #c026d3;
}

.stat-info h3 {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 0.75rem;
  color: #94a3b8;
}

.stat-trend.positive {
  color: #10b981;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.chart-box,
.recent-users {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.box-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.dummy-bar {
  width: 30px;
  background: #3b82f6;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
}

.user-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.btn-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
