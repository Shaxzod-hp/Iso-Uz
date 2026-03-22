<template>
  <div class="lesson-view h-100 d-flex flex-column bg-white p-4">
    <!-- Header Section -->
    <div class="header-section d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center gap-3">
        <router-link to="/student/groups" class="back-btn shadow-sm">
          <i class="bi bi-chevron-left"></i>
        </router-link>
        <div>
          <h4 class="fw-bold mb-0 text-dark">Darslar va Vazifalar</h4>
          <p class="text-muted small mb-0">{{ groupName }} guruhi darslari</p>
        </div>
      </div>
      <div class="filter-wrapper d-flex gap-3 align-items-center">
        <div class="search-input-group shadow-sm">
          <i class="bi bi-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Mavzu qidirish..." class="form-control border-0" />
        </div>
        <select class="form-select filter-select shadow-sm" v-model="statusFilter">
          <option value="all">Barcha darslar</option>
          <option value="submitted">Topshirilgan</option>
          <option value="pending">Bajarilmagan</option>
          <option value="none">Berilmagan</option>
        </select>
      </div>
    </div>

    <!-- Cards Layout for Lessons (Grid) -->
    <div class="lessons-grid flex-grow-1 overflow-auto pe-2">
      <div class="row g-4">
        <div v-for="lesson in filteredLessons" :key="lesson.id" class="col-xl-4 col-md-6">
          <div class="lesson-glass-card shadow-sm h-100">
            <div class="card-top">
              <div class="video-preview-box">
                <img
                  :src="lesson.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80'"
                  alt="Thumbnail" />
                <div class="play-overlay">
                  <i class="bi bi-play-fill fs-1 text-white"></i>
                </div>
                <div class="video-badge">{{ lesson.duration || 'Video' }}</div>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="fw-bold text-dark lesson-title line-clamp-2 mb-0">{{ lesson.title }}</h5>
                <span :class="['status-dot', getStatusValue(lesson)]"></span>
              </div>
              <p class="text-muted small mb-4 line-clamp-2">{{ lesson.description || 'Ushbu darsning mazmuni va asosiy tushunchalari bilan tanishing.' }}</p>

              <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                <div class="d-flex flex-column">
                  <span class="text-muted extra-small mb-1">Dars sanasi</span>
                  <span class="fw-semibold small text-primary d-flex align-items-center">
                    <i class="bi bi-calendar3 me-2"></i> {{ lesson.date || 'Bugun' }}
                  </span>
                </div>
                <div class="d-flex flex-column text-end">
                  <span class="text-muted extra-small mb-1">Status</span>
                  <span :class="['badge rounded-pill', getStatusBadgeClass(lesson)]" style="font-size: 10px;">
                    {{ getStatusLabel(lesson) }}
                  </span>
                </div>
              </div>
              <div>
                <button class="btn btn-primary w-100 mt-5" @click="openLesson(lesson)">Videoni ko'rish</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredLessons.length === 0" class="empty-state py-5 text-center">
        <div class="empty-illu mb-3">
          <i class="bi bi-camera-video-off fs-1 opacity-25"></i>
        </div>
        <h5 class="fw-bold text-muted">Darslar topilmadi</h5>
        <p class="text-muted small">Qidiruv yoki filtrni o'zgartirib ko'ring</p>
      </div>
    </div>

    <!-- Enhanced Video Modal -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="premium-modal-overlay" @click.self="closeModal">
        <div class="premium-modal-card">
          <div class="modal-left-panel">
            <div class="modal-header-glass">
              <h5 class="fw-bold mb-0 text-white text-truncate">{{ currentLesson?.title }}</h5>
              <button class="modal-close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="video-wrapper">
              <iframe :src="currentLesson?.url" class="video-iframe" allowfullscreen></iframe>
            </div>
            <div class="video-details p-4">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="teacher-info d-flex align-items-center gap-2">
                  <div
                    class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style="width: 32px; height: 32px">T</div>
                  <span class="fw-semibold small">{{ currentLesson?.teacher || 'Mentor' }}</span>
                </div>
                <span class="text-muted small border-start ps-3"><i class="bi bi-clock me-1"></i> {{
                  currentLesson?.duration || '15:00' }}</span>
                <span class="text-muted small border-start ps-3"><i class="bi bi-eye me-1"></i> 124 ko'rilgan</span>
              </div>
              <p class="text-muted">{{ currentLesson?.description || 'Darsning to\'liq tavsifi va foydali materiallar.'
              }}</p>
            </div>
          </div>

          <div class="modal-right-panel bg-light">
            <div class="panel-header p-4 border-bottom d-flex align-items-center gap-2">
              <i class="bi bi-journal-check fs-4 text-primary"></i>
              <h6 class="fw-bold mb-0">Vazifa Topsherish</h6>
            </div>

            <div class="panel-body p-4">
              <!-- If already submitted -->
              <div v-if="getSubmission(currentLesson?.id)" class="submitted-box mb-4">
                <div
                  class="d-flex align-items-center gap-3 p-3 bg-success bg-opacity-10 rounded-4 border border-success border-opacity-25">
                  <div
                    class="icon-success bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 40px">
                    <i class="bi bi-check2-all fs-4"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold text-success mb-1">Muvaffaqiyatli topshirilgan</h6>
                    <span class="extra-small text-muted">{{ formatDate(getSubmission(currentLesson?.id)?.createdAt)
                    }}</span>
                  </div>
                </div>
                <div class="mt-3 p-3 bg-white rounded-4 border">
                  <p class="small text-muted mb-2">Vazifa kodi/fayli:</p>
                  <a :href="getSubmission(currentLesson?.id)?.url" target="_blank"
                    class="btn btn-sm btn-link p-0 text-decoration-none fw-bold">
                    <i class="bi bi-link-45deg"></i> Faylni ko'rish
                  </a>
                  <p class="small mt-2 mb-0"><strong>Izoh:</strong> {{ getSubmission(currentLesson?.id)?.comment ||
                    'Yo\'q' }}</p>
                </div>
              </div>

              <!-- Content Form -->
              <div v-else class="homework-form">
                <p class="text-muted small mb-3">Uy vazifasini fayl yoki havola (GitHub/Drive) ko'rinishida yuboring.
                </p>

                <div class="upload-area mb-3" :class="{ 'has-file': homeworkFile }" @click="openFile">
                  <input ref="fileInput" type="file" class="d-none" @change="handleFileUpload" />
                  <div v-if="!homeworkFile" class="text-center p-4">
                    <i class="bi bi-cloud-arrow-up fs-1 text-primary mb-2 d-inline-block"></i>
                    <h6 class="fw-bold mb-1">Fayl tanlang</h6>
                    <p class="extra-small text-muted mb-0">PDF, ZIP, JPG yoki GitHub havolasi</p>
                  </div>
                  <div v-else class="file-info-active d-flex align-items-center gap-3 p-4 w-100">
                    <i class="bi bi-file-earmark-code fs-1 text-primary"></i>
                    <div class="flex-grow-1 text-start overflow-hidden">
                      <h6 class="fw-bold mb-1 d-block text-truncate">{{ homeworkFile.name }}</h6>
                      <span class="extra-small text-muted">{{ formatSize(homeworkFile.size) }}</span>
                    </div>
                    <button class="btn-remove" @click.stop="removeFile"><i class="bi bi-x"></i></button>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label extra-small fw-bold text-muted">IZOH (IXTIYORIY)</label>
                  <textarea v-model="homeworkComment" class="form-control rounded-4 bg-white" rows="3"
                    placeholder="Mentorga xabaringiz..."></textarea>
                </div>

                <button class="btn btn-primary premium-submit w-100 py-3 rounded-4 shadow-sm" :disabled="!homeworkFile"
                  @click="submitHomework">
                  Yuborish <i class="bi bi-arrow-right-short ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
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
const fileInput = ref(null);

// Get lessons from mainStore
const groupLessons = computed(() => {
  return store.videos.filter((v) => v.group === groupName);
});

const filteredLessons = computed(() => {
  let list = groupLessons.value;

  if (searchQuery.value) {
    list = list.filter(l => l.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }

  if (statusFilter.value === "all") return list;

  return list.filter(
    (lesson) => getStatusValue(lesson) === statusFilter.value
  );
});

// Helper for status matching
function getSubmission(lessonId) {
  if (!lessonId) return null;
  return store.homeworkSubmissions.find(
    (h) => h.lessonId === lessonId && h.studentId === store.currentStudent?.id
  );
}

function getStatusValue(lesson) {
  if (getSubmission(lesson.id)) return "submitted";
  const hasAssignment = store.assignments.some(
    (a) => a.group === groupName && (a.title.includes(lesson.title.split(' ')[0]) || lesson.title.includes(a.title))
  );
  return hasAssignment ? "pending" : "none";
}

function getStatusLabel(lesson) {
  const status = getStatusValue(lesson);
  if (status === "submitted") return "Topshirilgan";
  if (status === "pending") return "Bajarilmagan";
  return "Berilmagan";
}

function getStatusBadgeClass(lesson) {
  const status = getStatusValue(lesson);
  if (status === "submitted") return "bg-success bg-opacity-10 text-success border border-success border-opacity-25";
  if (status === "pending") return "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25";
  return "bg-secondary bg-opacity-10 text-muted border border-secondary border-opacity-25";
}

// Handlers
function openLesson(lesson) {
  currentLesson.value = lesson;
  showModal.value = true;
  const sub = getSubmission(lesson.id);
  homeworkComment.value = sub?.comment || "";
  homeworkFile.value = null;
}

function closeModal() {
  showModal.value = false;
  currentLesson.value = null;
}

function openFile() {
  fileInput.value.click();
}

function handleFileUpload(event) {
  homeworkFile.value = event.target.files[0];
}

function removeFile() {
  homeworkFile.value = null;
}

function formatSize(size) {
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
  return (size / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function submitHomework() {
  if (!currentLesson.value || !homeworkFile.value) return;
  const fileURL = URL.createObjectURL(homeworkFile.value);
  store.submitHomework(currentLesson.value.id, {
    url: fileURL,
    comment: homeworkComment.value,
  });
  closeModal();
}
</script>

<style scoped>
.back-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
  text-decoration: none;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  transform: scale(1.05);
}

.search-input-group {
  position: relative;
  background: #f8fafc;
  border-radius: 12px;
  padding-left: 15px;
  display: flex;
  align-items: center;
  width: 280px;
}

.search-input-group i {
  color: #94a3b8;
}

.search-input-group input {
  background: transparent;
  padding: 10px 15px;
  font-size: 14px;
}

.filter-select {
  border: none;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 180px;
}

.lesson-glass-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.lesson-glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.video-preview-box {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.video-preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.lesson-glass-card:hover .video-preview-box img {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.lesson-glass-card:hover .play-overlay {
  opacity: 1;
}

.video-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.submitted {
  background: #10b981;
}

.status-dot.pending {
  background: #ef4444;
}

.status-dot.none {
  background: #cbd5e1;
}

.extra-small {
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 700;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* MODAL STYLES */
.premium-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.premium-modal-card {
  background: white;
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
}

.modal-left-panel {
  flex: 1.8;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-header-glass {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 30px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  transition: 0.2s;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.video-wrapper {
  background: #000;
  height: 480px;
  width: 100%;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.modal-right-panel {
  width: 380px;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-area.has-file {
  border-style: solid;
  border-color: #10b981;
  background: #f0fdf4;
}

.btn-remove {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.premium-submit {
  font-weight: 700;
  transition: all 0.3s;
}

.premium-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.3);
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .premium-modal-card {
    flex-direction: column;
    height: 95vh;
    overflow-y: auto;
  }

  .modal-right-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }

  .video-wrapper {
    height: 300px;
  }
}
</style>
