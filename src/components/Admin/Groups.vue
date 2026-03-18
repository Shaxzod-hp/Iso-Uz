<template>
  <div class="groups-view">
    <div class="view-header">
      <div class="header-left">
        <h2 class="view-title">Guruhlar boshqaruvi</h2>
        <p class="text-muted">Platformadagi barcha o'quv guruhlari</p>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-lg me-2"></i> Yangi guruh
      </button>
    </div>

    <!-- Group Cards -->
    <div class="groups-grid mt-4">
      <div v-for="group in groups" :key="group.id" class="group-card">
        <div class="group-header">
          <div class="group-icon">
            <i class="bi bi-collection"></i>
          </div>
          <div class="group-actions">
            <button class="btn-icon" @click="openModal(group)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon delete" @click="deleteGroup(group.id)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <h3 class="group-name">{{ group.name }}</h3>
        <p class="group-direction">{{ group.direction }}</p>

        <div class="group-stats">
          <div class="stat-item">
            <i class="bi bi-people"></i>
            <span>{{ group.studentCount }} ta'laba</span>
          </div>
          <div class="stat-item">
            <i class="bi bi-person-workspace"></i>
            <span>{{ group.teacher }}</span>
          </div>
        </div>

        <div class="group-footer">
          <span :class="['status-badge', group.status]">{{
            group.status === "active" ? "Faol" : "Yakunlangan"
          }}</span>
          <span class="days-left">{{ group.schedule }}</span>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            {{ editingGroup ? "Guruhni tahrirlash" : "Yangi guruh yaratish" }}
          </h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <form @submit.prevent="saveGroup" class="modal-form">
          <div class="input-grid">
            <div class="input-block">
              <label>Guruh nomi</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Masalan: Frontend 301"
                required
              />
            </div>
            <div class="input-block">
              <label>Yo'nalish</label>
              <select v-model="form.direction">
                <option value="Frontend dasturlash">Frontend dasturlash</option>
                <option value="Backend dasturlash">Backend dasturlash</option>
                <option value="Grafik dizayn">Grafik dizayn</option>
                <option value="SMM va Marketing">SMM va Marketing</option>
              </select>
            </div>
            <div class="input-block">
              <label>O'qituvchi</label>
              <select v-model="form.teacher">
                <option v-for="t in teachers" :key="t.id" :value="t.fullName">
                  {{ t.fullName }}
                </option>
              </select>
            </div>
            <div class="input-block">
              <label>Dars vaqti</label>
              <input
                v-model="form.schedule"
                type="text"
                placeholder="Du-Chorsh-Ju 14:00"
                required
              />
            </div>
            <div class="input-block">
              <label>Holat</label>
              <select v-model="form.status">
                <option value="active">Faol</option>
                <option value="completed">Yakunlangan</option>
              </select>
            </div>
          </div>

          <div class="modal-actions mt-4">
            <button type="button" class="btn btn-outline" @click="closeModal">
              Bekor qilish
            </button>
            <button type="submit" class="btn btn-primary">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Mock groups data
const groups = ref(JSON.parse(localStorage.getItem("iso_groups") || "[]"));

if (groups.value.length === 0) {
  groups.value = [
    {
      id: 1,
      name: "Frontend 301",
      direction: "Frontend dasturlash",
      teacher: "Asadbek Olimov",
      studentCount: 18,
      status: "active",
      schedule: "Du-Ch-Ju 14:00",
    },
    {
      id: 2,
      name: "Design 102",
      direction: "Grafik dizayn",
      teacher: "Malika Ergasheva",
      studentCount: 12,
      status: "active",
      schedule: "Se-Pay-Sha 09:00",
    },
    {
      id: 3,
      name: "Backend 204",
      direction: "Backend dasturlash",
      teacher: "Javohir Toshpulotov",
      studentCount: 15,
      status: "active",
      schedule: "Du-Ch-Ju 18:00",
    },
  ];
  localStorage.setItem("iso_groups", JSON.stringify(groups.value));
}

const teachers = computed(() =>
  authStore.users.filter((u) => u.role === "teacher")
);

const showModal = ref(false);
const editingGroup = ref(null);
const form = ref({
  name: "",
  direction: "Frontend dasturlash",
  teacher: "",
  schedule: "",
  status: "active",
});

function openModal(group = null) {
  if (group) {
    editingGroup.value = group.id;
    form.value = { ...group };
  } else {
    editingGroup.value = null;
    form.value = {
      name: "",
      direction: "Frontend dasturlash",
      teacher: teachers.value[0]?.fullName || "",
      schedule: "",
      status: "active",
    };
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function saveGroup() {
  if (editingGroup.value) {
    const idx = groups.value.findIndex((g) => g.id === editingGroup.value);
    if (idx !== -1) {
      groups.value[idx] = { ...groups.value[idx], ...form.value };
    }
  } else {
    groups.value.push({
      id: Date.now(),
      ...form.value,
      studentCount: 0,
    });
  }
  localStorage.setItem("iso_groups", JSON.stringify(groups.value));
  closeModal();
}

function deleteGroup(id) {
  if (confirm("Guruhni o'chirishga ishonchingiz komilmi?")) {
    groups.value = groups.value.filter((g) => g.id !== id);
    localStorage.setItem("iso_groups", JSON.stringify(groups.value));
  }
}
</script>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.group-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: transform 0.2s, box-shadow 0.2s;
}

.group-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.group-icon {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  font-size: 1.25rem;
}

.btn-icon {
  background: none;
  border: none;
  color: #94a3b8;
  padding: 5px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.btn-icon.delete:hover {
  color: #ef4444;
}

.group-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.group-direction {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 20px;
}

.group-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #1e293b;
}

.stat-item i {
  color: #94a3b8;
}

.group-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.completed {
  background: #fee2e2;
  color: #ef4444;
}

.days-left {
  font-size: 0.75rem;
  color: #64748b;
}

/* MODAL STYLES (Copied from Users.vue for consistency) */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 550px;
  overflow: hidden;
}

.modal-header {
  padding: 20px 30px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  grid-template-columns: 1fr;
  gap: 15px;
}

.input-block label {
  display: block;
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 6px;
}

.input-block input,
.input-block select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
