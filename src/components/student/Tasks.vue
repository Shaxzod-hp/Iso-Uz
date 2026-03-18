<template>
  <div class="student-tasks">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Mening vazifalarim</h2>
        <p class="text-muted">O'qituvchilar tomonidan berilgan topshiriqlar.</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4" v-for="t in studentTasks" :key="t.id">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-box bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
                <i :class="t.icon || 'bi-journal-text'"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-1">{{ t.title }}</h5>
                <span class="badge bg-light text-primary border border-primary-subtle">{{ t.group }}</span>
              </div>
            </div>
            <span class="badge rounded-pill px-3 py-2" :class="t.submitted ? 'bg-success' : 'bg-warning text-dark'">
              {{ t.submitted ? 'Topshirildi' : 'Muddat: ' + t.date }}
            </span>
          </div>
          
          <p class="text-muted small mb-4">Ushbu vazifani bajaring va pastdagi tugma orqali yuboring. O'qituvchi tekshirgandan so'ng sizga coinlar taqdim etiladi.</p>

          <div class="d-flex justify-content-between align-items-center pt-3 border-top">
            <div class="small text-muted"><i class="bi bi-clock me-1"></i> {{ t.date }} gacha</div>
            <button v-if="!t.submitted" class="btn btn-primary px-4 rounded-3" @click="openUploadModal(t)">
              Vazifani yuborish
            </button>
            <span v-else class="text-success fw-bold"><i class="bi bi-check2-all me-1"></i> Qabul qilindi</span>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
          <div class="icon-box mx-auto bg-warning bg-opacity-10 text-warning rounded-circle mb-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
            <i class="bi bi-star-fill fs-4"></i>
          </div>
          <h5 class="fw-bold">Vazifa ballari</h5>
          <p class="text-muted small">Vazifalarni vaqtida topshiring va qo'shimcha coinlar yutib oling!</p>
          <div class="mt-3 p-3 bg-light rounded-3">
            <h6 class="mb-1 fw-bold">Jami ballaringiz</h6>
            <h3 class="fw-bold text-primary mb-0">{{ store.currentStudent.coin }} <small class="fs-6">coin</small></h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-container p-4">
        <h5 class="fw-bold mb-4">Vazifani yuborish</h5>
        <h6 class="text-muted mb-3">{{ selectedTask?.title }}</h6>
        <div class="mb-4">
          <label class="form-label small fw-bold">Loyiha linki (GitHub/Vercel) yoki Fayl</label>
          <input type="text" class="form-control" v-model="uploadLink" placeholder="https://github.com/...">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-light flex-grow-1" @click="showModal = false">Bekor qilish</button>
          <button class="btn btn-success flex-grow-1" @click="handleUpload">Yuborish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from '@/stores'

const store = useMainStore()
const showModal = ref(false)
const selectedTask = ref(null)
const uploadLink = ref('')

const studentTasks = computed(() => {
  const sGroups = store.currentStudent.groups?.map(g => g.name) || []
  return store.assignments.filter(a => sGroups.includes(a.group))
})

function openUploadModal(task) {
  selectedTask.value = task
  showModal.value = true
}

function handleUpload() {
  if (!uploadLink.value) return
  // Simulate upload
  const task = store.assignments.find(a => a.id === selectedTask.value.id)
  if (task) {
    task.submitted += 1 // In real app, we'd track per-student
  }
  showModal.value = false
  uploadLink.value = ''
  alert("Vazifa muvaffaqiyatli yuborildi!")
}
</script>

<style scoped>
.icon-box { width: 44px; height: 44px; flex-shrink: 0; font-size: 20px; }
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-container { background: white; border-radius: 20px; width: 400px; max-width: 90%; }
</style>
