<template>
  <div class="courses-page p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">Kurslar va Yo'nalishlar</h4>
        <p class="text-muted small mb-0">O'quv dasturlarini boshqarish bo'limi</p>
      </div>
      <button class="btn btn-primary d-flex align-items-center gap-2 rounded-3 shadow-sm px-4" @click="openModal">
        <i class="bi bi-journal-plus"></i>
        Yangi kurs
      </button>
    </div>

    <!-- Course Grid -->
    <div class="row g-4">
      <div class="col-lg-4 col-md-6" v-for="course in store.courses" :key="course.id">
        <div class="card border-0 shadow-sm rounded-4 h-100 course-card overflow-hidden">
          <div class="p-4" :style="{ borderTop: '5px solid ' + course.color }">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="icon-box rounded-4 d-flex align-items-center justify-content-center shadow-sm"
                :style="{ background: course.color + '15', color: course.color }" style="width: 50px; height: 50px">
                <i :class="'bi ' + course.icon" class="fs-3"></i>
              </div>
              <div class="dropdown">
                <button class="btn btn-light btn-sm rounded-circle border-0 shadow-sm" type="button">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
              </div>
            </div>

            <h5 class="fw-bold mb-2 text-dark">{{ course.name }}</h5>
            <p class="text-muted small mb-4 line-clamp-2">Ushbu yo'nalishda talabalar zamonaviy texnologiyalarni noldan
              professional darajagacha o'rganishadi.</p>

            <div class="d-flex flex-wrap gap-2 mb-4">
              <span class="badge bg-light text-dark border rounded-pill px-3 py-1 font-monospace">{{ course.students ||
                0 }}
                talaba</span>
              <span class="badge bg-light text-dark border rounded-pill px-3 py-1 font-monospace">6 oy</span>
            </div>

            <div class="d-flex align-items-center justify-content-between pt-3 border-top">
              <div class="d-flex align-items-center gap-2">
                <div class="d-flex -space-x-2">
                  <div
                    class="avatar-xs rounded-circle border border-2 border-white bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style="width:24px; height:24px; font-size:10px">T</div>
                  <div
                    class="avatar-xs rounded-circle border border-2 border-white bg-info text-white d-flex align-items-center justify-content-center fw-bold"
                    style="width:24px; height:24px; font-size:10px">M</div>
                </div>
                <span class="text-muted extra-small">2 o'qituvchi</span>
              </div>
              <button class="btn btn-link btn-sm text-primary fw-bold text-decoration-none p-0"
                @click="viewGroups(course)">
                Guruhlarni ko'rish <i class="bi bi-arrow-right small ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Placeholder -->
      <div class="col-lg-4 col-md-6" @click="openModal">
        <div
          class="card border-0 shadow-sm rounded-4 h-100 border-2 border-dashed d-flex align-items-center justify-content-center p-5 text-muted pointer hover-bg-light"
          style="cursor: pointer; background: transparent; border-style: dashed !important">
          <div class="text-center">
            <i class="bi bi-plus-circle fs-1 opacity-25 d-block mb-3"></i>
            <h6 class="fw-bold mb-0">Yangi yo'nalish qo'shish</h6>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header border-bottom p-4">
          <h5 class="fw-bold mb-0">Yangi kurs qo'shish</h5>
          <button class="btn-close" @click="showModal = false"></button>
        </div>
        <form @submit.prevent="saveCourse" class="p-4">
          <div class="mb-3">
            <label class="form-label small fw-bold">Kurs nomi</label>
            <input v-model="form.name" type="text" class="form-control" placeholder="Masalan: JavaScript Backend"
              required />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold d-block mb-2">Ikonka tanlang</label>
            <div class="d-flex flex-wrap gap-2">
              <button v-for="icon in icons" :key="icon" type="button" class="btn icon-select-btn"
                :class="{ active: form.icon === icon }" @click="form.icon = icon">
                <i :class="'bi ' + icon"></i>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold d-block mb-2">Rangni tanlang</label>
            <div class="d-flex flex-wrap gap-2">
              <button v-for="color in colors" :key="color" type="button" class="color-select-btn"
                :style="{ background: color }" :class="{ active: form.color === color }" @click="form.color = color">
              </button>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light" @click="showModal = false">Bekor qilish</button>
            <button type="submit" class="btn btn-primary px-4">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
    <!-- GROUPS MODAL -->
    <div v-if="showGroupsModal" class="modal-backdrop" @click.self="showGroupsModal = false">
      <div class="modal-content">
        <div class="modal-header border-bottom p-4">
          <h5 class="fw-bold mb-0">{{ selectedCourse?.name }} - Guruhlar</h5>
          <button class="btn-close" @click="showGroupsModal = false"></button>
        </div>
        <div class="p-4">
          <div v-if="courseGroups.length > 0" class="list-group">
            <div v-for="group in courseGroups" :key="group.name"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0 rounded-3 mb-2 shadow-sm">
              <div>
                <h6 class="fw-bold mb-1">{{ group.name }}</h6>
                <span class="small text-muted"><i class="bi bi-person-badge me-1"></i> {{ group.teacher }}</span>
              </div>
              <span class="badge bg-primary rounded-pill">{{ group.studentsCount }} o'quvchi</span>
            </div>
          </div>
          <div v-else class="text-center py-5 text-muted">
            <i class="bi bi-info-circle fs-1 d-block mb-3 opacity-25"></i>
            Hozircha bu yo'nalishda guruhlar mavjud emas
          </div>
        </div>
        <div class="p-4 border-top text-end">
          <button class="btn btn-outline-secondary" @click="showGroupsModal = false">Yopish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";

const store = useMainStore();
const showModal = ref(false);

const form = ref({
  name: "",
  icon: "bi-journal-text",
  color: "#6366f1"
});

const icons = [
  "bi-code-slash", "bi-terminal", "bi-palette", "bi-phone",
  "bi-database", "bi-cloud-arrow-up", "bi-shield-lock", "bi-graph-up"
];

const colors = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"
];

const showGroupsModal = ref(false);
const selectedCourse = ref(null);

const courseGroups = computed(() => {
  if (!selectedCourse.value || !store.allGroups) return [];

  const dir = selectedCourse.value.direction?.toLowerCase() || selectedCourse.value.name.split(' ')[0].toLowerCase();
  return store.allGroups.filter(g => g.direction?.toLowerCase().includes(dir));
});


function openModal() {
  form.value = {
    name: "",
    icon: "bi-journal-text",
    color: "#6366f1"
  };
  showModal.value = true;
}

function saveCourse() {
  const courseData = {
    ...form.value,
    direction: form.value.name.split(' ')[0]
  };
  store.addCourse(courseData);
  showModal.value = false;
}

function viewGroups(course) {
  selectedCourse.value = course;
  showGroupsModal.value = true;
}
</script>

<style scoped>
.course-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.extra-small {
  font-size: 0.75rem;
}

.hover-bg-light:hover {
  background-color: #f8fafc !important;
}

.-space-x-2>*+* {
  margin-left: -8px;
}

/* MODAL STYLES */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.icon-select-btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 1.25rem;
  color: #64748b;
  transition: all 0.2s;
}

.icon-select-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.color-select-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 4px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-select-btn.active {
  border-color: white;
  box-shadow: 0 0 0 2px #3b82f6;
}
</style>
