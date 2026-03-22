<template>
  <div class="container-fluid h-100 d-flex flex-column bg-white p-3">
    <!-- HEADER -->
    <div
      class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3"
    >
      <div class="d-flex align-items-center gap-3">
        <router-link
          to="/student/groups"
          class="btn btn-light shadow-sm rounded-3"
        >
          <i class="bi bi-chevron-left"></i>
        </router-link>

        <div>
          <h5 class="fw-bold mb-0">Darslar va Vazifalar</h5>
          <small class="text-muted">{{ groupName }} guruhi</small>
        </div>
      </div>

      <div class="d-flex gap-2 flex-wrap">
        <!-- SEARCH -->
        <div class="input-group shadow-sm" style="max-width: 250px">
          <span class="input-group-text bg-light border-0">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control bg-light border-0"
            placeholder="Qidirish..."
          />
        </div>

        <!-- FILTER -->
        <select class="form-select shadow-sm w-auto" v-model="statusFilter">
          <option value="all">Barchasi</option>
          <option value="submitted">Topshirilgan</option>
          <option value="pending">Bajarilmagan</option>
          <option value="none">Berilmagan</option>
        </select>
      </div>
    </div>

    <!-- LESSONS -->
    <div class="row g-3 flex-grow-1 overflow-auto">
      <div
        v-for="lesson in filteredLessons"
        :key="lesson.id"
        class="col-lg-4 col-md-6"
      >
        <div class="card h-100 shadow-sm border-0 hover-card">
          <!-- IMAGE -->
          <div class="position-relative">
            <img
              :src="
                lesson.thumbnail ||
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'
              "
              class="card-img-top"
            />

            <div class="position-absolute top-50 start-50 translate-middle">
              <i class="bi bi-play-fill fs-1 text-white"></i>
            </div>

            <span class="badge bg-dark position-absolute bottom-0 end-0 m-2">
              {{ lesson.duration || "Video" }}
            </span>
          </div>

          <!-- BODY -->
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start">
              <h6 class="fw-bold mb-1">{{ lesson.title }}</h6>

              <span
                class="badge rounded-pill"
                :class="{
                  'bg-success': getStatusValue(lesson) == 'submitted',
                  'bg-danger': getStatusValue(lesson) == 'pending',
                  'bg-secondary': getStatusValue(lesson) == 'none',
                }"
              ></span>
            </div>

            <p class="text-muted small flex-grow-1">
              {{ lesson.description || "Dars haqida qisqacha ma’lumot" }}
            </p>

            <div
              class="d-flex justify-content-between small border-top pt-2 mt-2"
            >
              <span
                ><i class="bi bi-calendar"></i>
                {{ lesson.date || "Bugun" }}</span
              >
              <span class="fw-bold">{{ getStatusLabel(lesson) }}</span>
            </div>

            <button
              class="btn btn-primary w-100 mt-3"
              @click="openLesson(lesson)"
            >
              Ko‘rish
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY -->
      <div v-if="filteredLessons.length === 0" class="text-center py-5">
        <i class="bi bi-camera-video-off fs-1 text-muted"></i>
        <p class="text-muted">Dars topilmadi</p>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal fade show d-block">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ currentLesson?.title }}</h5>
            <button class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <iframe
              :src="currentLesson?.url"
              class="w-100 mb-3"
              style="height: 400px"
            ></iframe>

            <!-- HOMEWORK -->
            <div v-if="getSubmission(currentLesson?.id)">
              <div class="alert alert-success">Topshirilgan ✅</div>
            </div>

            <div v-else>
              <input
                type="file"
                class="form-control mb-2"
                @change="handleFileUpload"
              />

              <textarea
                v-model="homeworkComment"
                class="form-control mb-2"
                placeholder="Izoh"
              ></textarea>

              <button
                class="btn btn-primary w-100"
                :disabled="!homeworkFile"
                @click="submitHomework"
              >
                Yuborish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useMainStore } from "@/stores";

const store = useMainStore();
const route = useRoute();
const groupName = route.params.name;

const statusFilter = ref("all");
const searchQuery = ref("");
const showModal = ref(false);
const currentLesson = ref(null);

const homeworkFile = ref(null);
const homeworkComment = ref("");

const groupLessons = computed(() => {
  return store.videos.filter((v) => v.group === groupName);
});

const filteredLessons = computed(() => {
  let list = groupLessons.value;

  if (searchQuery.value) {
    list = list.filter((l) =>
      l.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (statusFilter.value === "all") return list;

  return list.filter((l) => getStatusValue(l) === statusFilter.value);
});

function getSubmission(id) {
  return store.homeworkSubmissions.find(
    (h) => h.lessonId === id && h.studentId === store.currentStudent?.id
  );
}

function getStatusValue(lesson) {
  if (getSubmission(lesson.id)) return "submitted";

  const hasAssignment = store.assignments.some((a) => a.group === groupName);

  return hasAssignment ? "pending" : "none";
}

function getStatusLabel(lesson) {
  const s = getStatusValue(lesson);
  if (s === "submitted") return "Topshirilgan";
  if (s === "pending") return "Bajarilmagan";
  return "Berilmagan";
}

function openLesson(lesson) {
  currentLesson.value = lesson;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function handleFileUpload(e) {
  homeworkFile.value = e.target.files[0];
}

function submitHomework() {
  const url = URL.createObjectURL(homeworkFile.value);

  store.submitHomework(currentLesson.value.id, {
    url,
    comment: homeworkComment.value,
  });

  closeModal();
}
</script>

<style scoped>
.hover-card:hover {
  transform: translateY(-5px);
  transition: 0.3s;
}
</style>
