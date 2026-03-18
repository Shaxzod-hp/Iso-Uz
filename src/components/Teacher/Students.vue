<template>
  <div class="students-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Talabalar</h2>
        <p class="text-muted">Barcha talabalar ro'yxati.</p>
      </div>
      <button class="btn-add" @click="showAddModal = true"><i class="bi bi-person-plus me-1"></i> Talaba
        qo'shish</button>
    </div>

    <div class="d-card">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>

              <th>Guruh</th>
              <th>Telefon</th>
              <th>O'zlashtirish</th>
              <th>Ball</th>
              <th>Holat</th>
              <th class="text-end">Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in store.teacherStudents" :key="s.id">
              <td>{{ i + 1 }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div v-if="s.avatarImg" class="t-ava-img flex-shrink-0">
                    <img :src="s.avatarImg" alt="Avatar" />
                  </div>
                  <div v-else class="t-ava" :style="{ background: s.color || '#6366f1' }">{{ s.name[0] }}</div>
                  <div>
                    <p class="fw-semibold mb-0">{{ s.name }}</p>
                    <small class="text-muted">
                      {{ s.email ?? "Email yo'q" }}
                    </small>
                  </div>
                </div>
              </td>
              <td>{{ s.groups?.[0]?.name || 'Guruhsiz' }}</td>
              <td class="text-muted">{{ s.phone }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="prog-bg">
                    <div class="prog-fill"
                      :style="{ width: (s.coin / 10) + '%', background: s.coin >= 500 ? '#10b981' : '#f59e0b' }">
                    </div>
                  </div>
                  <small>{{ Math.min(100, Math.round(s.coin / 10)) }}%</small>
                </div>
              </td>
              <td><span class="fw-bold">{{ s.coin }}</span></td>
              <td><span class="badge-s b-ok">Faol</span></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary" @click="editStudent(s)">
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div v-if="showAddModal" class="modal-backdrop">
      <div class="modal-container p-4">
        <h5 class="fw-bold mb-4">Yangi talaba qo'shish</h5>
        <div class="mb-3">
          <label class="form-label small fw-bold">Ism Familiya</label>
          <input type="text" class="form-control" v-model="newStudent.name" placeholder="Masalan: Ali Valiyev">
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold">Guruh</label>
          <select class="form-select" v-model="newStudent.group">
            <option v-for="g in store.teacherGroups" :key="g.name" :value="g.name">{{ g.name }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold">Telefon</label>
          <input type="text" class="form-control" v-model="newStudent.phone" placeholder="+998 90 123 45 67">
        </div>
        <div class="mb-4">
          <label class="form-label small fw-bold">Login</label>
          <input type="text" class="form-control" v-model="newStudent.login" placeholder="ali_v">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-light flex-grow-1" @click="showAddModal = false">Bekor qilish</button>
          <button class="btn btn-primary flex-grow-1" @click="handleAddStudent">Qo'shish</button>
        </div>
      </div>
    </div>

    <!-- Edit Student Modal -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-container p-4">
        <h5 class="fw-bold mb-4">Talabani tahrirlash</h5>
        <div class="mb-3">
          <label class="form-label small fw-bold">Ism Familiya</label>
          <input type="text" class="form-control" v-model="editingStudent.name">
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold">Telefon</label>
          <input type="text" class="form-control" v-model="editingStudent.phone">
        </div>
        <div class="mb-4">
          <label class="form-label small fw-bold">Ball (Coin)</label>
          <input type="number" class="form-control" v-model="editingStudent.coin">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-light flex-grow-1" @click="showEditModal = false">Bekor qilish</button>
          <button class="btn btn-primary flex-grow-1" @click="handleUpdateStudent">Saqlash</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '@/stores'
const store = useMainStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const newStudent = ref({ name: '', group: '', phone: '', login: '' })
const editingStudent = ref(null)

function handleAddStudent() {
  if (!newStudent.value.name || !newStudent.value.group) return
  store.addStudent(newStudent.value)
  showAddModal.value = false
  newStudent.value = { name: '', group: '', phone: '', login: '' }
}

function editStudent(student) {
  editingStudent.value = { ...student }
  showEditModal.value = true
}

function handleUpdateStudent() {
  if (!editingStudent.value.name) return
  store.updateStudent(editingStudent.value.id, editingStudent.value)
  showEditModal.value = false
  editingStudent.value = null
}
</script>

<style scoped>
.btn-add {
  background: linear-gradient(135deg, #6366f1, #818cf8);
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  transition: .3s;
  cursor: pointer
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, .3)
}

.d-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f1f5f9
}

.t-ava {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0
}

.t-ava-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.t-ava-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.table th {
  font-size: 12px;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  border-bottom: 2px solid #f1f5f9
}

.table td {
  font-size: 14px;
  color: #334155;
  border-bottom: 1px solid #f8fafc;
  padding: 14px 12px
}

.prog-bg {
  width: 70px;
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden
}

.prog-fill {
  height: 100%;
  border-radius: 10px
}

.badge-s {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600
}

.b-ok {
  background: #d1fae5;
  color: #059669
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 400px;
  max-width: 90%;
}
</style>
