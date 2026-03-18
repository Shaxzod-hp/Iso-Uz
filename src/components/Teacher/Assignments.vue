<template>
    <div class="assignments-page">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold">Vazifalar</h2>
                <p class="text-muted">Barcha berilgan vazifalar ro'yxati.</p>
            </div>
            <button class="btn-add" @click="showModal = true"><i class="bi bi-plus-lg me-1"></i> Yangi vazifa</button>
        </div>

        <div class="row g-4" v-if="store.assignments?.length">
            <div class="col-lg-4 col-md-6" v-for="a in store.assignments" :key="a.id">
                <div class="a-card">
                    <div class="a-top d-flex justify-content-between align-items-start">
                        <div class="a-icon" :style="{ background: a.bgColor, color: a.color }"><i :class="a.icon"></i>
                        </div>
                        <span class="badge-s"
                            :class="a.status === 'Bajarildi' ? 'b-ok' : a.status === 'Kutilmoqda' ? 'b-warn' : 'b-info'">{{
                            a.status }}</span>
                    </div>
                    <h6 class="fw-bold mt-3 mb-1">{{ a.title }}</h6>
                    <div class="text-primary small fw-semibold mb-3">{{ a.group }}</div>
                    
                    <div class="a-meta mb-3">
                        <div><i class="bi bi-calendar3 me-1"></i> {{ a.date }}</div>
                        <div><i class="bi bi-people me-1"></i> {{ a.submitted }}/{{ a.total }} talaba</div>
                    </div>
                    
                    <div class="prog-label d-flex justify-content-between small mb-1">
                        <span>Topshirildi</span>
                        <span>{{ Math.round(a.submitted / a.total * 100) }}%</span>
                    </div>
                    <div class="prog-bg">
                        <div class="prog-fill"
                            :style="{ width: Math.round(a.submitted / a.total * 100) + '%', background: a.color }">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
          <i class="bi bi-journal-x fs-1 text-muted opacity-25"></i>
          <h5 class="mt-3 text-muted">Hozircha vazifalar yo'q</h5>
        </div>

        <!-- Add Task Modal -->
        <div v-if="showModal" class="modal-backdrop">
          <div class="modal-container p-4">
            <h5 class="fw-bold mb-4">Yangi vazifa berish</h5>
            <div class="mb-3">
              <label class="form-label small fw-bold">Mavzu nomi</label>
              <input type="text" class="form-control" v-model="newTask.title" placeholder="Masalan: Vue Router asoslari">
            </div>
            <div class="mb-4">
              <label class="form-label small fw-bold">Guruhni tanlang</label>
              <select class="form-select" v-model="newTask.group">
                <option v-for="g in store.teacherGroups" :key="g.name" :value="g.name">{{ g.name }}</option>
              </select>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-light flex-grow-1" @click="showModal = false">Bekor qilish</button>
              <button class="btn btn-primary flex-grow-1" @click="handleAddTask">Vazifa yuborish</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '@/stores'
const store = useMainStore()

const showModal = ref(false)
const newTask = ref({ title: '', group: '' })

function handleAddTask() {
  if (!newTask.value.title || !newTask.value.group) return
  store.addTeacherTask(newTask.value)
  showModal.value = false
  newTask.value = { title: '', group: '' }
}
</script>

<style scoped>
.btn-add { background: linear-gradient(135deg, #6366f1, #818cf8); border: none; color: #fff; padding: 10px 20px; border-radius: 12px; font-weight: 600; transition: .3s; cursor: pointer }
.btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, .3) }
.a-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; transition: .3s }
.a-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0, 0, 0, .08) }
.a-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px }
.a-meta { display: flex; justify-content: space-between; font-size: 13px; color: #64748b }
.prog-bg { height: 8px; background: #f1f5f9; border-radius: 10px; overflow: hidden }
.prog-fill { height: 100%; border-radius: 10px; transition: .5s; }
.badge-s { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.b-ok { background: #d1fae5; color: #059669 }
.b-warn { background: #fef3c7; color: #d97706 }
.b-info { background: #dbeafe; color: #2563eb }

.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-container { background: white; border-radius: 20px; width: 400px; max-width: 90%; }
</style>
