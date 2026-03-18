<template>
  <div class="groups-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Guruhlar</h2>
        <p class="text-muted">Barcha guruhlarni boshqarish.</p>
      </div>
      <button class="btn-add" @click="showGroupModal = true">
        <i class="bi bi-plus-lg me-1"></i> Yangi guruh
      </button>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 col-md-6" v-for="g in store.teacherGroups" :key="g.name">
        <div class="g-card">
          <div class="g-header" :style="{ background: g.gradient }">
            <h5 class="fw-bold text-white mb-1">{{ g.name }}</h5>
            <small class="text-white-50">{{ g.direction }}</small>
          </div>
          <div class="g-body">
            <!-- Analytics & Actions -->
            <div class="row g-2 mb-4">
              <div class="col-6">
                <div class="p-2 bg-light rounded-3 text-center border">
                  <p class="text-muted extra-small mb-1">O'rtacha o'zlashtirish</p>
                  <h6 class="fw-bold mb-0 text-primary">{{ g.avg }}%</h6>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 bg-light rounded-3 text-center border">
                  <p class="text-muted extra-small mb-1">Talabalar</p>
                  <h6 class="fw-bold mb-0 text-dark">{{ g.students }} ta</h6>
                </div>
              </div>
            </div>

            <!-- Advanced Actions -->
            <div class="action-grid mb-3">
              <button class="action-btn video-btn" @click="openActionPanel(g, 'video')">
                <i class="bi bi-play-circle-fill"></i>
                <span>Dars videosi</span>
              </button>
              <button class="action-btn task-btn" @click="openActionPanel(g, 'homework')">
                <i class="bi bi-journal-text"></i>
                <span>Uyga vazifa</span>
              </button>
              <button class="action-btn attendance-btn" @click="goToAttendance(g)">
                <i class="bi bi-calendar-check-fill"></i>
                <span>Davomat</span>
              </button>
              <button class="action-btn coin-btn" @click="openCoinModal(g)">
                <i class="bi bi-gem"></i>
                <span>Coin berish</span>
              </button>
            </div>

            <div class="g-stat">
              <div><i class="bi bi-people me-1"></i> {{ g.students }} talaba</div>
              <div><i class="bi bi-journal me-1"></i> {{ g.totalCoin }} ochko</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <!-- New Group Modal -->
    <div v-if="showGroupModal" class="modal-backdrop">
      <div class="modal-container p-4">
        <h5 class="fw-bold mb-4">Yangi guruh ochish</h5>
        <div class="mb-3">
          <label class="form-label small fw-bold">Guruh nomi</label>
          <input type="text" class="form-control" v-model="newGroup.name" placeholder="Masalan: Frontend 301">
        </div>
        <div class="mb-4">
          <label class="form-label small fw-bold">Yo'nalish</label>
          <select class="form-select" v-model="newGroup.direction">
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="UI/UX Design">UI/UX Design</option>
          </select>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-light flex-grow-1" @click="showGroupModal = false">Bekor qilish</button>
          <button class="btn btn-primary flex-grow-1" @click="handleCreateGroup">Yaratish</button>
        </div>
      </div>
    </div>

    <!-- Action Sidebar / Advanced Panel -->
    <div v-if="activePanel" class="action-panel-overlay" @click.self="activePanel = null">
      <div class="action-panel">
        <div class="panel-header d-flex justify-content-between align-items-center">
          <div>
            <span class="badge bg-primary-subtle text-primary mb-1">{{ selectedGroup?.name }}</span>
            <h4 class="fw-bold mb-0">{{ activePanel === 'video' ? 'Video dars yaratish' : 'Uyga vazifa berish' }}</h4>
          </div>
          <button class="btn-close-panel" @click="activePanel = null">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="panel-body">
          <template v-if="activePanel === 'video'">
            <div class="form-section">
              <label class="form-label-advanced">Dars nomi</label>
              <div class="input-wrapper">
                <i class="bi bi-type"></i>
                <input type="text" v-model="videoData.title" placeholder="Masalan: JavaScript Arrays">
              </div>
            </div>
            <div class="form-section mt-4">
              <label class="form-label-advanced">Video havola (YouTube)</label>
              <div class="input-wrapper">
                <i class="bi bi-link-45deg"></i>
                <input type="text" v-model="videoData.url" placeholder="https://youtube.com/...]">
              </div>
            </div>
            <div class="info-box mt-4">
              <i class="bi bi-info-circle text-primary"></i>
              <p class="small text-muted mb-0">Video yuklangandan so'ng barcha talabalar uchun ochiq bo'ladi.</p>
            </div>
          </template>

          <template v-else-if="activePanel === 'homework'">
            <div class="form-section">
              <label class="form-label-advanced">Vazifa sarlavhasi</label>
              <div class="input-wrapper">
                <i class="bi bi-bookmark-star"></i>
                <input type="text" v-model="homeworkData.title" placeholder="Masalan: 4-dars topshirig'i">
              </div>
            </div>
            <div class="form-section mt-4">
              <label class="form-label-advanced">Vazifa tavsifi</label>
              <textarea class="form-textarea-advanced" v-model="homeworkData.description" rows="4"
                placeholder="Vazifa haqida batafsil..."></textarea>
            </div>
            <div class="form-section mt-4">
              <label class="form-label-advanced">Muddat (Deadline)</label>
              <div class="input-wrapper">
                <i class="bi bi-clock"></i>
                <input type="date" v-model="homeworkData.deadline">
              </div>
            </div>
          </template>
        </div>

        <div class="panel-footer">
          <button class="btn-panel-cancel" @click="activePanel = null">Bekor qilish</button>
          <button class="btn-panel-submit" :class="activePanel === 'video' ? 'bg-danger' : 'bg-primary'"
            @click="handleSubmit">
            <i class="bi bi-cloud-upload me-2"></i>
            {{ activePanel === 'video' ? 'Videoni yuklash' : 'Vazifani yuborish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Coin Modal -->
    <div v-if="showCoinModal" class="modal-backdrop">
      <div class="modal-container p-4">
        <h5 class="fw-bold mb-4">Coin Berish</h5>
        <div class="mb-3">
          <label class="form-label small fw-bold">Talabani tanlang</label>
          <select class="form-select" v-model="coinData.studentId">
            <option v-for="s in currentGroupStudents" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold">Coin miqdori</label>
          <input type="number" class="form-control" v-model="coinData.amount">
        </div>
        <div class="mb-4">
          <label class="form-label small fw-bold">Sabab</label>
          <input type="text" class="form-control" v-model="coinData.reason"
            placeholder="Darsda faol qatnashganlik uchun">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-light flex-grow-1" @click="showCoinModal = false">Yopish</button>
          <button class="btn btn-warning text-white flex-grow-1" @click="handleGiveCoin">Coin Berish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores'

const store = useMainStore()
const router = useRouter()

// UI States
const showGroupModal = ref(false)
const showCoinModal = ref(false)
const selectedGroup = ref(null)
const activePanel = ref(null) // 'video' or 'homework'

// Forms
const newGroup = ref({ name: '', direction: 'Frontend' })
const videoData = ref({ title: '', url: '' })
const coinData = ref({ studentId: '', amount: 10, reason: '' })
const homeworkData = ref({ title: '', description: '', deadline: '' })

const currentGroupStudents = computed(() => {
  if (!selectedGroup.value) return []
  return store.students.filter(s => s.groups?.some(g => g.name === selectedGroup.value.name))
})

function handleCreateGroup() {
  if (!newGroup.value.name) return
  store.createGroup(newGroup.value)
  showGroupModal.value = false
  newGroup.value = { name: '', direction: 'Frontend' }
}

function openActionPanel(group, type) {
  selectedGroup.value = group
  activePanel.value = type
}

function handleSubmit() {
  if (activePanel.value === 'video') {
    if (!videoData.value.title) return
    store.uploadVideo(selectedGroup.value.name, videoData.value)
    videoData.value = { title: '', url: '' }
  } else {
    if (!homeworkData.value.title) return
    store.addTeacherHomework({
      ...homeworkData.value,
      group: selectedGroup.value.name
    })
    homeworkData.value = { title: '', description: '', deadline: '' }
  }
  activePanel.value = null
}

function openCoinModal(group) {
  selectedGroup.value = group
  showCoinModal.value = true
}

function handleGiveCoin() {
  if (!coinData.value.studentId || !coinData.value.amount) return
  store.addCoinToStudent(coinData.value.studentId, coinData.value.amount, coinData.value.reason)
  showCoinModal.value = false
  coinData.value = { studentId: '', amount: 10, reason: '' }
}

function goToAttendance(group) {
  router.push({ path: '/teacher/attendance', query: { group: group.name } })
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

.g-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  transition: .3s
}

.g-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .08)
}

.g-header {
  padding: 20px 24px
}

.g-body {
  padding: 20px 24px
}

.g-stat {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.action-btn:hover {
  background: white;
  border-color: #6366f1;
  color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.action-btn i {
  font-size: 1.5rem;
}

.video-btn:hover i {
  color: #ef4444;
}

.task-btn:hover i {
  color: #6366f1;
}

.attendance-btn:hover i {
  color: #0ea5e9;
}

.coin-btn:hover i {
  color: #f59e0b;
}

/* Action Panel Styles */
.action-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
  animation: fadeIn 0.3s;
}

.action-panel {
  width: 450px;
  max-width: 100%;
  background: white;
  height: 100%;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.panel-header {
  padding: 30px;
  border-bottom: 1px solid #f1f5f9;
}

.btn-close-panel {
  background: #f1f5f9;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
}

.panel-body {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
}

.form-label-advanced {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 15px;
  color: #94a3b8;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-textarea-advanced {
  width: 100%;
  padding: 15px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  resize: none;
}

.form-textarea-advanced:focus {
  border-color: #6366f1;
}

.info-box {
  padding: 15px;
  background: #f0f9ff;
  border-radius: 12px;
  display: flex;
  gap: 12px;
}

.panel-footer {
  padding: 30px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 15px;
}

.btn-panel-cancel {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: white;
  font-weight: 600;
  color: #64748b;
}

.btn-panel-submit {
  flex: 2;
  padding: 14px;
  border-radius: 12px;
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-panel-submit:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
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

.extra-small {
  font-size: 11px;
}
</style>