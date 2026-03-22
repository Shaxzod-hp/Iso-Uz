<template>
  <div class="kirish">
    <div class="main h-100">
      <div>
        <h1 class="fw-bold md: text-sm">
          Welcome to Iso<span class="text-danger">Uz</span>
        </h1>
        <div class="line"></div>
      </div>
      <p class="fs-1 mb-3">Davom etish:</p>
      <div class="d-flex align-items-center gap-4">
        <router-link to="/login" class="btn btn-outline-light text-uppercase fw-bold px-4 py-3 btn-glow">
          <i class="bi bi-box-arrow-in-right me-2"></i>Kirish
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
}

.kirish {
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("../assets/student/bg-dashboard.jpg");
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
}

.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: main 1s ease;
}

.main h1 {
  font-size: 100px;
}

.btn-glow:hover {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);

}

.btn-glow:hover i {
  color: #000000 !important;
}

.btn-glow-alt {
  transition: all 0.3s;
}

.btn-glow-alt:hover {
  color: #000000 !important;
}

.btn-glow-alt i {
  color: #ffffff !important;
  transition: all 0.3s;
}

.btn-glow-alt:hover i {
  color: #000000 !important;
}

@keyframes main {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
