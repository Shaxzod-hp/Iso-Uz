const fs = require('fs');
const path = 'c:/Users/Hp/Desktop/Iso_Uz/Iso-Uz/src/components/Teacher/Dashboard.vue';
let content = fs.readFileSync(path, 'utf8');

// Replace the FAOLIYAT VA TEZKOR row
const faoliyatStart = content.indexOf('<!-- FAOLIYAT VA TEZKOR -->');
const templateEnd = content.indexOf('</template>');

const newFaoliyat = `<!-- FAOLIYAT VA TEZKOR -->
    <div class="row g-4">
      <!-- Faoliyat -->
      <div class="col-lg-4">
        <div class="d-card h-100">
          <h5 class="fw-semibold mb-3">So'nggi faoliyat</h5>
          <div class="act-item" v-for="a in store.activity" :key="a.id">
            <div class="act-icon" :style="{ background: a.bgColor, color: a.iconColor }">
              <i :class="a.icon"></i>
            </div>
            <div>
              <p class="mb-0">{{ a.text }}</p>
              <small class="text-muted">{{ a.time }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Top O'quvchilar -->
      <div class="col-lg-4">
        <div class="d-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-semibold mb-0">Top Talabalar</h5>
            <small class="text-muted">Guruhlaringiz bo'yicha</small>
          </div>
          <div class="act-item" v-for="(s, idx) in store.teacherTopStudents" :key="s.id">
            <div class="act-icon border fw-bold" :class="idx < 3 ? 'text-primary' : 'text-muted'">
              {{ idx + 1 }}
            </div>
            <div class="flex-grow-1">
              <p class="fw-semibold mb-0">{{ s.name }}</p>
              <small class="text-muted">{{ s.group }}</small>
            </div>
            <div class="text-end">
              <span class="fw-bold text-warning"><i class="bi bi-coin"></i> {{ s.coin }}</span>
            </div>
          </div>
          <div v-if="!store.teacherTopStudents.length" class="text-muted text-center py-4">
            Hozircha o'quvchilar yo'q.
          </div>
        </div>
      </div>

      <!-- Tezkor harakatlar -->
      <div class="col-lg-4">
        <div class="d-card h-100">
          <h5 class="fw-semibold mb-3">Tezkor harakatlar</h5>
          <div class="row g-3">
            <div class="col-6">
              <div class="q-card" style="--clr: #6366f1" @click="showTaskModal = true">
                <i class="bi bi-plus-lg q-icon"></i>
                <p class="fw-semibold mb-0">Vazifa yaratish</p>
              </div>
            </div>
            <div class="col-6">
              <div class="q-card" style="--clr: #10b981" @click="router.push('/teacher/students')">
                <i class="bi bi-person-plus q-icon"></i>
                <p class="fw-semibold mb-0">Talaba qo'shish</p>
              </div>
            </div>
            <div class="col-6">
              <div class="q-card" style="--clr: #f59e0b" @click="router.push('/teacher/groups')">
                <i class="bi bi-calendar-check q-icon"></i>
                <p class="fw-semibold mb-0">Davomat olish</p>
              </div>
            </div>
            <div class="col-6">
              <div class="q-card" style="--clr: #ef4444" @click="showMsgModal = true">
                <i class="bi bi-chat-dots q-icon"></i>
                <p class="fw-semibold mb-0">Xabar yuborish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vazifa Modal -->
    <div v-if="showTaskModal" class="modal-backdrop" @click.self="showTaskModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="fw-bold mb-0">Vazifa yaratish</h5>
          <button class="btn-close" @click="showTaskModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label text-muted">Guruhni tanlang</label>
            <select class="form-select" v-model="taskForm.group">
              <option disabled value="">Tanlang...</option>
              <option v-for="g in store.teacherGroups" :key="g.id" :value="g.name">{{ g.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label text-muted">Vazifa mavzusi</label>
            <input type="text" class="form-control" v-model="taskForm.title" placeholder="Masalan: Uyga vazifa 5-mavzu" />
          </div>
          <div class="mb-3">
            <label class="form-label text-muted">Topshirish muddati</label>
            <input type="date" class="form-control" v-model="taskForm.deadline" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary w-100 py-2 rounded-3 text-white fw-semibold" @click="createTask" :disabled="!taskForm.group || !taskForm.title">Vazifani yuborish</button>
        </div>
      </div>
    </div>

    <!-- Xabar Modal -->
    <div v-if="showMsgModal" class="modal-backdrop" @click.self="showMsgModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="fw-bold mb-0">Xabar yuborish</h5>
          <button class="btn-close" @click="showMsgModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label text-muted">Guruhni tanlang</label>
            <select class="form-select" v-model="msgForm.group">
              <option disabled value="">Tanlang...</option>
              <option v-for="g in store.teacherGroups" :key="g.id" :value="g.name">{{ g.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label text-muted">Xabar matni</label>
            <textarea class="form-control" rows="4" v-model="msgForm.text" placeholder="Guruhga e'lon yoki xabarni yozing..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary w-100 py-2 rounded-3 text-white fw-semibold" @click="sendMsg" :disabled="!msgForm.group || !msgForm.text">Xabarni yuborish</button>
        </div>
      </div>
    </div>
  </div>
`;

content = content.substring(0, faoliyatStart) + newFaoliyat + "\n</template>";

// Replace script setup
const scriptStart = content.indexOf('<script setup>');
const scriptEnd = content.indexOf('</style>');

const newScript = `<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";

const store = useMainStore();
const router = useRouter();

const showTaskModal = ref(false);
const taskForm = ref({ group: "", title: "", deadline: "" });

const showMsgModal = ref(false);
const msgForm = ref({ group: "", text: "" });

function createTask() {
  if (taskForm.value.group && taskForm.value.title) {
    store.addTeacherTask({ ...taskForm.value });
    showTaskModal.value = false;
    taskForm.value = { group: "", title: "", deadline: "" };
  }
}

function sendMsg() {
  if (msgForm.value.group && msgForm.value.text) {
    store.sendGroupMessage({ ...msgForm.value });
    showMsgModal.value = false;
    msgForm.value = { group: "", text: "" };
  }
}
</script>

`;

content = content.substring(0, scriptStart) + newScript + content.substring(scriptEnd);

// Append to style
const styleBlock = `
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: none;
  overflow: hidden;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #f1f5f9;
}
</style>
`;

content = content.replace("</style>", styleBlock);
fs.writeFileSync(path, content, 'utf8');
console.log('Teacher dashboard updated');
