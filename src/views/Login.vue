<template>
  <div class="auth-container">
    <!-- LEFT SIDE -->
    <div class="auth-left">
      <div class="logo-area">
        <img src="/logotip.png" alt="Logo" width="60" height="60">
        <h1 class="fw-bold mb-0 text-white">Iso<span class="text-danger">Uz</span></h1>
      </div>
      <h2>Xush kelibsiz!</h2>
      <p>Platformaga kirish orqali o'quv jarayoningizni boshqaring va yangiliklardan xabardor bo'ling.</p>
    </div>

    <!-- RIGHT SIDE -->
    <div class="auth-right">
      <div class="auth-form-header">
        <h2 class="auth-title">Kirish</h2>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-block">
          <label class="input-label">Login</label>
          <div class="input-wrapper">
            <i class="bi bi-person"></i>
            <input type="text" v-model="username" placeholder="Loginingizni kiriting" required />
          </div>
        </div>

        <div class="input-block">
          <label class="input-label">Parol</label>
          <div class="input-wrapper">
            <i class="bi bi-lock"></i>
            <input type="password" v-model="password" placeholder="Parolingizni kiriting" required />
          </div>
        </div>

        <p v-if="error" class="text-danger">{{ error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Tizimga kirish
        </button>
      </form>

      <div class="divider">
        <span>Yoki</span>
      </div>

      <div class="social-group">
        <div class="social-btn"><i class="bi bi-google text-danger"></i></div>
        <div class="social-btn"><i class="bi bi-apple text-white"></i></div>
        <div class="social-btn"><i class="bi bi-facebook text-primary"></i></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function handleLogin() {
  error.value = ''
  loading.value = true

  setTimeout(() => {
    const result = authStore.login({ login: username.value, password: password.value })
    loading.value = false

    if (result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (result.user.role === 'teacher') {
        router.push('/teacher/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    } else {
      error.value = "Email yoki parol noto'g'ri!"
    }
  }, 1000)
}
</script>

<style src="@/assets/auth.css"></style>