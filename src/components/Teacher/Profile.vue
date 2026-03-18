<template>
  <div class="profile-page">
    <!-- PROFIL KARTA -->
    <div class="card profile-card p-4 mb-4">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-4">
          <div class="position-relative">
            <div class="prof-avatar overflow-hidden" :style="{ background: userData.color }">
              <img v-if="userData.avatarImg" :src="userData.avatarImg" class="w-100 h-100 object-fit-cover" />
              <span v-else>{{ userData.avatar }}</span>
            </div>
            <label class="avatar-upload-label shadow-sm">
              <i class="bi bi-camera-fill"></i>
              <input type="file" class="d-none" accept="image/*" @change="handleAvatarUpload" />
            </label>
          </div>
          <div>
            <h3 class="fw-bold mb-1">
              {{ userData.fullName || userData.name }}
            </h3>
            <p class="text-muted mb-0">{{ userData.email }}</p>
            <span class="badge-ok mt-2 d-inline-block">O'qituvchi</span>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn-edit" @click="openEdit">
            <i class="bi bi-pencil-square me-1"></i> Tahrirlash
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card p-4 h-100">
          <h5 class="fw-semibold mb-3">
            <i class="bi bi-person me-2"></i>Shaxsiy ma'lumotlar
          </h5>
          <div class="info-row">
            <span class="info-label">Ism</span><span>{{ userData.fullName || userData.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email</span><span>{{ userData.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Telefon</span><span>{{ userData.phone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tug'ilgan sana</span><span>{{ userData.birthday || "-" }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Manzil</span><span>{{ userData.address || "-" }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Mutaxassislik</span><span>{{
              userData.specialty || store.currentTeacher.specialty
            }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tajriba</span><span class="fw-bold">{{
              userData.experience || store.currentTeacher.experience
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
      <div class="modal-card">
        <div class="modal-header-custom">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-pencil-square me-2"></i>Profilni tahrirlash
          </h5>
          <button class="btn-close-custom" @click="showEdit = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <form @submit.prevent="saveProfile" class="modal-body-custom">
          <div class="form-group-custom">
            <label>To'liq ism</label>
            <input v-model="editForm.fullName" type="text" required />
          </div>
          <div class="form-group-custom">
            <label>Email</label>
            <input v-model="editForm.email" type="email" required />
          </div>
          <div class="form-group-custom">
            <label>Telefon</label>
            <input v-model="editForm.phone" type="tel" />
          </div>
          <div class="form-group-custom">
            <label>Tug'ilgan sana</label>
            <input v-model="editForm.birthday" type="text" placeholder="15.05.1990" />
          </div>
          <div class="form-group-custom">
            <label>Manzil</label>
            <input v-model="editForm.address" type="text" />
          </div>
          <div class="form-group-custom">
            <label>Mutaxassislik</label>
            <input v-model="editForm.specialty" type="text" />
          </div>
          <div class="form-group-custom">
            <label>Tajriba</label>
            <input v-model="editForm.experience" type="text" placeholder="5 yil" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showEdit = false">
              Bekor qilish
            </button>
            <button type="submit" class="btn-save">
              <i class="bi bi-check-lg me-1"></i> Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

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

const userData = computed(() => {
  if (authStore.currentUser) return authStore.currentUser;
  return store.currentTeacher;
});

function openEdit() {
  editForm.value = {
    fullName: userData.value.fullName || userData.value.name || "",
    email: userData.value.email || "",
    phone: userData.value.phone || "",
    birthday: userData.value.birthday || "",
    address: userData.value.address || "",
    specialty: userData.value.specialty || store.currentTeacher.specialty || "",
    experience:
      userData.value.experience || store.currentTeacher.experience || "",
  };
  showEdit.value = true;
}

function saveProfile() {
  if (authStore.currentUser) {
    authStore.updateProfile(editForm.value);
  }
  // Also update main store
  store.currentTeacher.name = editForm.value.fullName;
  store.currentTeacher.email = editForm.value.email;
  store.currentTeacher.phone = editForm.value.phone;
  store.currentTeacher.birthday = editForm.value.birthday;
  store.currentTeacher.address = editForm.value.address;
  store.currentTeacher.specialty = editForm.value.specialty;
  store.currentTeacher.experience = editForm.value.experience;
  store.saveAll();
  showEdit.value = false;
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const imgData = e.target.result;
    store.updateTeacherAvatar(imgData);
    if (authStore.currentUser) {
      authStore.currentUser.avatarImg = imgData;
    }
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #fff);
}

.prof-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-upload-label {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  border: 2px solid white;
}

.avatar-upload-label:hover {
  background: #4f46e5;
  transform: scale(1.1);
}

.card {
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.info-label {
  color: #94a3b8;
  font-weight: 600;
}

.badge-ok {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #d1fae5;
  color: #059669;
}

/* BUTTONS */
.btn-edit {
  padding: 8px 20px;
  border: 2px solid #6366f1;
  border-radius: 10px;
  background: transparent;
  color: #6366f1;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit:hover {
  background: #6366f1;
  color: #fff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

.btn-logout {
  padding: 8px 20px;
  border: 2px solid #ef4444;
  border-radius: 10px;
  background: transparent;
  color: #ef4444;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.btn-close-custom {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.btn-close-custom:hover {
  color: #ef4444;
}

.modal-body-custom {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group-custom label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
}

.form-group-custom input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  background: #fafbfc;
}

.form-group-custom input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: #fff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
}

.btn-cancel {
  padding: 10px 24px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-save {
  padding: 10px 28px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transform: translateY(-1px);
}
</style>
