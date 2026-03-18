<!-- script -->
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";

const store = useMainStore();
const authStore = useAuthStore();
const router = useRouter();

const showEdit = ref(false);
const editForm = ref({});
const fileInput = ref(null);

const userData = computed(() => {
  return store.currentStudent || {};
});

function openEdit() {
  editForm.value = {
    name: userData.value.name || "",
    email: userData.value.email || "",
    phone: userData.value.phone || "",
    birthday: userData.value.birthday || "",
    address: userData.value.address || "",
    password: userData.value.password || "",
  };
  showEdit.value = true;
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Check file size (max 2MB to ensure localStorage safety)
  if (file.size > 2 * 1024 * 1024) {
    alert("Rasm hajmi juda katta (maksimal 2MB)! Iltimos, kichikroq rasm tanlang.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    store.updateStudentAvatar(e.target.result);
  };
  reader.readAsDataURL(file);
}

function triggerFileInput() {
  fileInput.value.click();
}

function saveProfile() {
  if (authStore.currentUser) {
    authStore.currentUser.fullName = editForm.value.name;
    authStore.currentUser.email = editForm.value.email;
    // simple update for authStore
    authStore.updateProfile(authStore.currentUser);
  }
  // Update main store
  store.currentStudent.name = editForm.value.name;
  store.currentStudent.email = editForm.value.email;
  store.currentStudent.phone = editForm.value.phone;
  store.currentStudent.birthday = editForm.value.birthday;
  store.currentStudent.address = editForm.value.address;
  if (editForm.value.password) {
    store.currentStudent.password = editForm.value.password;
  }

  store.saveAll();
  showEdit.value = false;
}
</script>

<!-- html -->
<template>
  <div class="profile-page h-100 overflow-hidden d-flex flex-column container py-2">
    <!-- PROFIL KARTA -->
    <div class="card p-4 mb-4 rounded-4 border-0 shadow-sm flex-shrink-0">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div class="d-flex align-items-center gap-4">
          <!-- Avatar section -->
          <div class="position-relative">
            <div v-if="!userData.avatarImg" class="profile-avatar shadow-sm"
              :style="{ background: userData.color || '#6366f1' }">
              {{ userData.avatar || userData.name?.[0] || 'S' }}
            </div>
            <img v-else :src="userData.avatarImg" class="profile-avatar shadow-sm object-fit-cover" alt="Profile URL" />
            <button
              class="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle shadow photo-upload-btn d-flex align-items-center justify-content-center"
              @click="triggerFileInput" title="Rasm yuklash">
              <i class="bi bi-camera-fill"></i>
            </button>
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="d-none" />
          </div>

          <div>
            <h3 class="fw-bold mb-1 d-flex align-items-center gap-2">
              {{ userData.name }}
              <i class="bi bi-patch-check-fill text-primary mt-1 fs-5"></i>
            </h3>
            <p class="text-muted mb-2">{{ userData.email }}</p>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge bg-light text-secondary border border-secondary-subtle px-3 py-2 rounded-pill"
                v-for="g in userData.groups" :key="g.id">
                {{ g.name }}
              </span>
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary rounded-3 px-4 d-flex gap-2 align-items-center shadow-sm"
            @click="openEdit">
            <i class="bi bi-pencil-square"></i> Tahrirlash
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4 flex-grow-1 min-h-0 pb-4">
      <div class="col-lg-7">
        <div class="card p-4 h-100 border-0 shadow-sm rounded-4">
          <h5 class="fw-bold mb-4 d-flex align-items-center border-bottom pb-3">
            <i class="bi bi-person-vcard text-primary me-2 fs-4"></i>Shaxsiy ma'lumotlar
          </h5>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-person me-2"></i>Ism</span>
            <span class="fw-medium text-dark">{{ userData.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-envelope me-2"></i>Email</span>
            <span class="fw-medium text-dark">{{ userData.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-telephone me-2"></i>Telefon</span>
            <span class="fw-medium text-dark">{{ userData.phone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-calendar-event me-2"></i>Tug'ilgan sana</span>
            <span class="fw-medium text-dark">{{ userData.birthday || "2000-01-01" }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-geo-alt me-2"></i>Manzil</span>
            <span class="fw-medium text-dark">{{ userData.address || "Toshkent shahri" }}</span>
          </div>
          <div class="info-row border-0 pb-0">
            <span class="info-label"><i class="bi bi-lock me-2"></i>Parol</span>
            <span class="fw-medium text-dark">••••••••</span>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div
          class="card p-4 h-100 border-0 shadow-sm rounded-4 bg-primary text-white position-relative overflow-hidden">
          <!-- Background pattern -->
          <div class="position-absolute top-0 end-0 opacity-10 p-4">
            <i class="bi bi-award-fill" style="font-size: 150px"></i>
          </div>

          <div class="position-relative z-index-1 d-flex flex-column h-100">
            <h5 class="fw-bold mb-4 opacity-75">Sizning natijalaringiz</h5>

            <div class="d-flex align-items-center mb-4 pb-4 border-bottom border-light border-opacity-25">
              <div
                class="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3 shadow"
                style="width: 60px; height: 60px;">
                <i class="bi bi-coin text-warning fs-2"></i>
              </div>
              <div>
                <h2 class="fw-bold mb-0 lh-1">{{ userData.coin }}</h2>
                <span class="opacity-75 small text-uppercase fw-semibold">Guruh coinlar</span>
              </div>
            </div>

            <div class="d-flex align-items-center mb-4">
              <div
                class="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3 shadow"
                style="width: 60px; height: 60px;">
                <i class="bi bi-trophy text-light fs-2"></i>
              </div>
              <div>
                <h2 class="fw-bold mb-0 lh-1">#{{ store.currentStudentRank }}</h2>
                <span class="opacity-75 small text-uppercase fw-semibold">Umumiy reyting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
      <div class="modal-card">
        <div class="modal-header d-flex justify-content-between p-4 border-bottom">
          <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
            <i class="bi bi-pencil-square text-primary"></i>Profilni tahrirlash
          </h5>
          <button class="btn-close shadow-none" @click="showEdit = false"></button>
        </div>

        <form @submit.prevent="saveProfile" class="modal-body p-4">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label text-muted small fw-semibold">To'liq ism</label>
              <input v-model="editForm.name" type="text" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label text-muted small fw-semibold">Email</label>
              <input v-model="editForm.email" type="email" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label text-muted small fw-semibold">Telefon</label>
              <input v-model="editForm.phone" type="tel" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label text-muted small fw-semibold">Tug'ilgan sana</label>
              <input v-model="editForm.birthday" type="text" placeholder="15.03.2004" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label text-muted small fw-semibold">Manzil</label>
              <input v-model="editForm.address" type="text" class="form-control" />
            </div>
            <div class="col-12 mt-4 pt-3 border-top">
              <h6 class="fw-bold mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-shield-lock text-primary"></i> Xavfsizlik
              </h6>
            </div>
            <div class="col-md-6">
              <label class="form-label text-muted small fw-semibold">Yangi parol</label>
              <input v-model="editForm.password" type="password" class="form-control"
                placeholder="Parolni o'zgartirish" />
            </div>
          </div>

          <div class="modal-actions d-flex gap-2 justify-content-end mt-4 pt-3">
            <button type="button" class="btn btn-light border px-4" @click="showEdit = false">Bekor qilish</button>
            <button type="submit" class="btn btn-primary shadow-sm px-4">
              <i class="bi bi-check2 me-1"></i> Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<!-- style -->
<style scoped>
.profile-card {
  border-radius: 16px;
  background: white;
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-upload-btn {
  width: 32px;
  height: 32px;
  transform: translate(10%, 10%);
  transition: transform 0.2s, box-shadow 0.2s;
}

.photo-upload-btn:hover {
  transform: translate(10%, 10%) scale(1.1);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4) !important;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px dashed #e2e8f0;
  font-size: 15px;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

/* MODAL */
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
  z-index: 1000;
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalIn 0.3s ease-out forwards;
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

.form-control {
  padding: 10px 14px;
  border-radius: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.form-control:focus {
  background-color: #fff;
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>
