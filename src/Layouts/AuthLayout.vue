<template>
  <div class="auth-wrapper">
    <!-- Background Video -->
    <video class="bg-video" autoplay muted loop playsinline>
      <source :src="`${baseUrl}auth/auth.mp4`" type="video/mp4" />
    </video>

    <!-- Dark Overlay -->
    <div class="video-overlay"></div>

    <!-- Back Button -->
    <router-link to="/access" class="back-home-btn border">
      <i class="bi bi-arrow-left"></i> Bosh sahifaga
    </router-link>

    <!-- Auth Container (changes between Login/Register) -->
    <router-view v-slot="{ Component }">
      <transition name="auth-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
const baseUrl = import.meta.env.BASE_URL;
</script>

<style scoped>
/* Wrapper */
.auth-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

/* VIDEO */
.bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
}

/* OVERLAY */
.video-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

/* Back Button */
.back-home-btn {
  position: absolute;
  top: 25px;
  left: 30px;
  z-index: 3;
  padding: 8px 18px;
  background: none;
  backdrop-filter: blur(25px);

  border-radius: 8px;
  text-decoration: none;
  color: #ffffff;
  font-weight: 600;
  transition: 0.3s;
}

.back-home-btn:hover {
  background: #ffffff;
  color: #2d3561;
}

/* Transition */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.auth-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.auth-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
