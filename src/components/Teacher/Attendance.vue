<template>
  <div class="attendance-page p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">Davomat va Journal</h2>
        <p class="text-muted small mb-0">{{ selectedGroup ? selectedGroup + ' guruhi uchun davomat' : 'Guruhni tanlang' }}</p>
      </div>
      <div class="d-flex gap-2">
        <select v-model="selectedGroup" class="form-select shadow-sm" style="width: 200px">
          <option value="" disabled>Guruhni tanlang...</option>
          <option v-for="g in store.teacherGroups" :key="g.name" :value="g.name">{{ g.name }}</option>
        </select>
        <input type="date" v-model="currentDate" class="form-control shadow-sm" style="width: 160px">
      </div>
    </div>

    <div v-if="selectedGroup" class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-light bg-opacity-50">
        <h6 class="fw-bold mb-0">Talabalar ro'yxati</h6>
        <div class="d-flex gap-3">
          <button class="btn btn-sm btn-outline-success rounded-pill px-3" @click="markAll(true)">Barchasi keldi</button>
          <button class="btn btn-sm btn-outline-danger rounded-pill px-3" @click="markAll(false)">Barchasi kelmadi</button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4 border-0 small text-muted text-uppercase fw-bold">Talaba</th>
              <th class="border-0 small text-muted text-center text-uppercase fw-bold">Davomat</th>
              <th class="border-0 small text-muted text-uppercase fw-bold">Izoh / Sabab</th>
              <th class="pe-4 border-0 text-end text-uppercase fw-bold">Holat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in filteredStudents" :key="s.id">
              <td class="ps-4">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-sm rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" 
                       :style="{ background: s.color || '#6366f1' }" style="width: 38px; height: 38px">
                    {{ s.name[0] }}
                  </div>
                  <div>
                    <h6 class="mb-0 small fw-bold">{{ s.name }}</h6>
                    <span class="text-muted extra-small">ID: #{{ s.id }}</span>
                  </div>
                </div>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2">
                  <button 
                    class="btn btn-att" 
                    :class="attendanceState[s.id] === true ? 'btn-success' : 'btn-outline-success'"
                    @click="attendanceState[s.id] = true"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button 
                    class="btn btn-att" 
                    :class="attendanceState[s.id] === false ? 'btn-danger' : 'btn-outline-danger'"
                    @click="attendanceState[s.id] = false"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </td>
              <td>
                <input type="text" class="form-control form-control-sm border-0 bg-light rounded-2 px-3" placeholder="Izoh..." style="max-width: 250px">
              </td>
              <td class="pe-4 text-end">
                <span v-if="attendanceState[s.id] === true" class="badge bg-success-subtle text-success border border-success-subtle">KELDI</span>
                <span v-else-if="attendanceState[s.id] === false" class="badge bg-danger-subtle text-danger border border-danger-subtle">KELMADI</span>
                <span v-else class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">?</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 bg-light border-top d-flex justify-content-between align-items-center">
        <div class="small text-muted">Jami: {{ filteredStudents.length }} talaba</div>
        <button class="btn btn-primary px-5 py-2 rounded-3 shadow-sm fw-bold" @click="saveAttendance" :disabled="!isAnyMarked">
          Saqlash va Tasdiqlash
        </button>
      </div>
    </div>

    <div v-else class="empty-state text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
      <div class="mb-4">
        <div class="icon-box mx-auto bg-primary bg-opacity-10 text-primary">
          <i class="bi bi-mortarboard fs-1"></i>
        </div>
      </div>
      <h4 class="fw-bold">Davomat boshlanmagan</h4>
      <p class="text-muted mx-auto" style="max-width: 300px">Davomatni boshlash uchun yuqoridagi ro'yxatdan guruhni tanlang.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMainStore } from "@/stores";

const store = useMainStore();
const route = useRoute();
const selectedGroup = ref("");
const currentDate = ref(new Date().toISOString().split('T')[0]);
const attendanceState = ref({});

onMounted(() => {
  if (route.query.group) {
    selectedGroup.value = route.query.group;
  }
});

const filteredStudents = computed(() => {
  if (!selectedGroup.value) return [];
  return store.students.filter(s => s.groups?.some(g => g.name === selectedGroup.value));
});

watch(selectedGroup, () => {
  attendanceState.value = {};
});

const isAnyMarked = computed(() => Object.keys(attendanceState.value).length > 0);

function markAll(status) {
  filteredStudents.value.forEach(s => {
    attendanceState.value[s.id] = status;
  });
}

function saveAttendance() {
  store.markAttendance(selectedGroup.value, currentDate.value, attendanceState.value);
  alert("Davomat muvaffaqiyatli saqlandi!");
}
</script>

<style scoped>
.extra-small { font-size: 11px; }
.btn-att { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 14px; transition: .2s; }
.icon-box { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
.badge { font-weight: 700; letter-spacing: 0.5px; padding: 6px 10px; }
.table th { font-size: 11px; letter-spacing: 1px; }
</style>
