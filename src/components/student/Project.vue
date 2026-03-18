<template>
  <div class="project-page border-0 px-2">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h5 class="fw-semibold mb-0 text-dark">Mening loyihalarim</h5>
      <button class="btn btn-primary d-flex align-items-center gap-2 rounded-3 shadow-sm px-4"
        @click="showModal = true">
        <i class="bi bi-plus-lg"></i>
        Yangi loyiha
      </button>
    </div>

    <!-- Cards -->
    <div class="row g-4 mb-5">
      <div class="col-lg-4 col-md-6" v-for="p in myProjects" :key="p.id">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 project-card bg-white">
          <div class="card-top d-flex align-items-center justify-content-center"
            :style="{ background: p.gradient || 'linear-gradient(135deg, #6366f1, #818cf8)', height: '110px' }">
            <i :class="p.icon || 'bi bi-code-slash'" class="fs-1 text-white opacity-75"></i>
          </div>
          <div class="p-4 d-flex flex-column" style="flex: 1">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="fw-bold text-dark mb-0 pe-2">{{ p.name }}</h6>
              <button v-if="p.createdBy === store.currentStudent?.id" @click.stop="confirmDelete(p.id)"
                class="btn btn-sm btn-light text-danger rounded-circle p-1 d-flex align-items-center justify-content-center border-0 flex-shrink-0 shadow-sm"
                style="width:28px; height:28px; background: rgba(239, 68, 68, 0.05);" title="O'chirish">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <p class="small text-muted mb-4">{{ p.desc }}</p>

            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="fw-semibold text-muted">Progress</small>
                <small class="fw-bold text-primary">{{ p.progress }}%</small>
              </div>
              <div class="progress mb-4" style="height: 6px; background-color: #f1f5f9;">
                <div class="progress-bar rounded-pill"
                  :style="{ width: p.progress + '%', background: p.color || '#6366f1' }"></div>
              </div>

              <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                <div class="small text-muted d-flex align-items-center gap-1">
                  <i class="bi bi-people me-1"></i> {{ p.members?.length || 0 }} a'zo
                </div>
                <div class="small text-muted d-flex align-items-center gap-1">
                  <i class="bi bi-calendar-event me-1 text-danger"></i> {{ p.deadline || 'Belgilanmagan' }}
                </div>
              </div>

              <div class="mt-3 d-flex justify-content-between align-items-center">
                <div class="d-flex -space-x-2 align-items-center">
                  <!-- Team avatars -->
                  <div v-for="(member, idx) in (p.members || []).slice(0, 3)" :key="idx" class="team-avatar"
                    :style="{ zIndex: 10 - idx, background: getAvatarColor(idx) }">
                    {{ member[0] }}
                  </div>
                  <div v-if="p.members && p.members.length > 3"
                    class="team-avatar bg-light text-secondary border border-2 border-white" style="z-index: 1">
                    +{{ p.members.length - 3 }}
                  </div>
                  <!-- Add member button -->
                  <button v-if="p.createdBy === store.currentStudent?.id" @click.stop="openAddMemberModal(p)"
                    class="btn btn-sm btn-light border rounded-circle ms-2 d-flex align-items-center justify-content-center text-primary shadow-sm"
                    style="width: 32px; height: 32px; z-index: 11" title="A'zo qo'shish">
                    <i class="bi bi-person-plus-fill"></i>
                  </button>
                </div>

                <span class="badge rounded-pill px-3 py-2 fw-semibold" :class="p.status === 'Bajarildi'
                    ? 'bg-success-subtle text-success'
                    : p.status === 'Kutilmoqda'
                      ? 'bg-warning-subtle text-warning'
                      : 'bg-primary-subtle text-primary'
                  ">
                  {{ p.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty status -->
      <div v-if="myProjects.length === 0" class="col-12 text-center py-5">
        <div class="empty-icon-box mx-auto mb-4">
          <i class="bi bi-folder-x fs-1 opacity-25"></i>
        </div>
        <h5 class="text-dark fw-bold">Sizda hali loyihalar mavjud emas</h5>
        <p class="text-muted small">"Yangi loyiha" tugmasi orqali jamoa yig'ishingiz mumkin.</p>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0">Yangi Loyiha Yaratish</h5>
          <button class="btn-close shadow-none" @click="showModal = false"></button>
        </div>

        <form @submit.prevent="createProject" class="p-4">
          <div class="mb-3">
            <label class="form-label text-muted small fw-semibold">Loyiha nomi</label>
            <input v-model="form.name" type="text" class="form-control bg-light border-0 py-2"
              placeholder="Masalan: IsoUz Platformasi" required />
          </div>

          <div class="mb-3">
            <label class="form-label text-muted small fw-semibold">Loyiha haqida</label>
            <textarea v-model="form.desc" class="form-control bg-light border-0" rows="3"
              placeholder="Loyiha maqsadi..." required></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label text-muted small fw-semibold">Guruhni tanlang</label>
            <select v-model="selectedGroup" class="form-select bg-light border-0 shadow-none"
              @change="fetchGroupStudents">
              <option value="" disabled>Guruhni tanlang...</option>
              <option v-for="g in store.currentStudent?.groups" :key="g.id" :value="g.name">{{ g.name }}</option>
            </select>
          </div>

          <div class="mb-3" v-if="selectedGroup">
            <label class="form-label text-muted small fw-semibold">Guruhdoshlarni taklif qilish (Ixtiyoriy)</label>
            <div class="border rounded-3 p-3 team-selector bg-light border-0"
              style="max-height: 180px; overflow-y: auto;">
              <div v-for="student in availableStudents" :key="student.id" class="form-check mb-3">
                <input class="form-check-input shadow-none" type="checkbox" :value="student.name"
                  :id="'std-' + student.id" v-model="form.members">
                <label class="form-check-label d-flex align-items-center gap-2 cursor-pointer" :for="'std-' + student.id">
                  <div class="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                    style="width:28px; height:28px; font-size:12px;" :style="{ background: student.color || '#6366f1' }">
                    {{ student.name[0] }}
                  </div>
                  <span class="text-dark fw-medium">{{ student.name }}</span>
                </label>
              </div>
              <div v-if="availableStudents.length === 0" class="text-muted small text-center py-2">
                Bu guruhda boshqa talabalar topilmadi.
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label text-muted small fw-semibold">Tugash muddati</label>
            <input v-model="form.deadline" type="date" class="form-control bg-light border-0 py-2" required />
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-light px-4" @click="showModal = false">Bekor qilish</button>
            <button type="submit" class="btn btn-primary px-4 shadow-sm fw-bold">Yaratish</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddMemberModal" class="modal-overlay" @click.self="showAddMemberModal = false">
      <div class="modal-card">
        <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0">Jamoaga a'zo qo'shish</h5>
          <button class="btn-close shadow-none" @click="showAddMemberModal = false"></button>
        </div>

        <form @submit.prevent="addMembers" class="p-4">
          <div class="mb-3">
            <label class="form-label text-muted small fw-semibold">Guruhni tanlang</label>
            <select v-model="selectedGroupForAdd" class="form-select bg-light border-0"
              @change="fetchGroupStudentsForAdd">
              <option value="" disabled>Guruhni tanlang...</option>
              <option v-for="g in store.currentStudent?.groups" :key="g.id" :value="g.name">{{ g.name }}</option>
            </select>
          </div>

          <div class="mb-3" v-if="selectedGroupForAdd">
            <label class="form-label text-muted small fw-semibold">Guruhdoshlarni tanlang</label>
            <div class="border rounded-3 p-3 team-selector bg-light border-0"
              style="max-height: 180px; overflow-y: auto;">
              <div v-for="student in availableStudentsForAdd" :key="student.id" class="form-check mb-3">
                <input class="form-check-input shadow-none" type="checkbox" :value="student.name"
                  :id="'add-std-' + student.id" v-model="newMembersForm">
                <label class="form-check-label d-flex align-items-center gap-2 cursor-pointer"
                  :for="'add-std-' + student.id">
                  <div class="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                    style="width:28px; height:28px; font-size:12px;" :style="{ background: student.color || '#6366f1' }">
                    {{ student.name[0] }}
                  </div>
                  <span class="text-dark fw-medium">{{ student.name }}</span>
                </label>
              </div>
              <div v-if="availableStudentsForAdd.length === 0" class="text-muted small text-center py-2">
                Barcha guruhdoshlar loyihada mavjud.
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 justify-content-end mt-4">
            <button type="button" class="btn btn-light px-4" @click="showAddMemberModal = false">Bekor qilish</button>
            <button type="submit" class="btn btn-primary px-4 fw-bold shadow-sm"
              :disabled="newMembersForm.length === 0">Qo'shish</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";
const store = useMainStore();

const showModal = ref(false);
const selectedGroup = ref("");
const availableStudents = ref([]);

// For adding members
const showAddMemberModal = ref(false);
const activeProjectForAdd = ref(null);
const selectedGroupForAdd = ref("");
const availableStudentsForAdd = ref([]);
const newMembersForm = ref([]);

const myProjects = computed(() => {
  if (!store.currentStudent) return [];
  // Filter projects where current user is the creator or a member
  return (store.projects || []).filter(p =>
    p.createdBy === store.currentStudent.id ||
    (Array.isArray(p.members) && p.members.includes(store.currentStudent.name))
  );
});

const form = ref({
  name: "",
  desc: "",
  members: [],
  groups: [],
  deadline: ""
});

function fetchGroupStudents() {
  if (!selectedGroup.value || !store.students || !store.currentStudent) return;

  // Find students who are in the selected group (excluding current user)
  availableStudents.value = store.students.filter(s =>
    s.id !== store.currentStudent.id &&
    s.groups &&
    s.groups.some(g => g.name === selectedGroup.value)
  );
}

function createProject() {
  if (!store.currentStudent || !form.value.name || !form.value.deadline) {
    alert("Xatolik: Ma'lumotlar to'liq emas.");
    return;
  }
  // Add myself + selected members
  const team = [...new Set([store.currentStudent.name, ...form.value.members])];

  const newProj = {
    name: form.value.name,
    desc: form.value.desc,
    members: team,
    groups: [selectedGroup.value],
    deadline: form.value.deadline,
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    icon: "bi bi-rocket-takeoff",
    color: "#10b981",
    progress: 0,
    status: "Yangi"
  };

  store.addProject(newProj);

  // Reset form and close
  showModal.value = false;
  form.value = { name: "", desc: "", members: [], groups: [], deadline: "" };
  selectedGroup.value = "";
  availableStudents.value = [];
}

function confirmDelete(id) {
  if (confirm("Haqiqatan ham bu loyihani o'chirmoqchimisiz?")) {
    store.deleteProject(id);
  }
}

function openAddMemberModal(project) {
  activeProjectForAdd.value = project;
  selectedGroupForAdd.value = "";
  availableStudentsForAdd.value = [];
  newMembersForm.value = [];
  showAddMemberModal.value = true;
}

function fetchGroupStudentsForAdd() {
  if (!selectedGroupForAdd.value || !activeProjectForAdd.value || !store.students) return;

  const currentMembers = activeProjectForAdd.value.members || [];

  availableStudentsForAdd.value = store.students.filter(s =>
    s.id !== store.currentStudent.id &&
    !currentMembers.includes(s.name) &&
    s.groups &&
    s.groups.some(g => g.name === selectedGroupForAdd.value)
  );
}

function addMembers() {
  if (activeProjectForAdd.value && newMembersForm.value.length > 0) {
    store.addMembersToProject(activeProjectForAdd.value.id, newMembersForm.value);
  }
  showAddMemberModal.value = false;
}

const colors = ["#6366f1", "#f59e0b", "#ec4899", "#10b981", "#8b5cf6"];
function getAvatarColor(index) {
  return colors[index % colors.length];
}
</script>

<style scoped>
.project-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.team-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  border: 2px solid white;
  margin-right: -10px;
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-success-subtle {
  background-color: #d1fae5;
}

.bg-warning-subtle {
  background-color: #fef3c7;
}

.bg-primary-subtle {
  background-color: #dbeafe;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
}

.modal-card {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
