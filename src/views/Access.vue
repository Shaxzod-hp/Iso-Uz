<template>
  <div class="kirish d-flex align-items-center justify-content-center">
    <div class="main w-100 px-3">
      <div class="text-center">
        <h1 class="fw-bold display-1 responsive-title">
          Welcome to Iso<span class="text-danger">Uz</span>
        </h1>
        <div class="line mx-auto"></div>
      </div>
      <div class="text-center mt-4">
        <p class="fs-4 mb-4">Davom etish:</p>
        <div class="d-flex justify-content-center">
          <router-link to="/login" class="btn btn-outline-light text-uppercase fw-bold px-5 py-3 btn-glow">
            <i class="bi bi-box-arrow-in-right me-2"></i>Kirish
          </router-link>
        </div>
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
  background-position: center;
}

.main {
  animation: mainMove 1s ease;
}

.responsive-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 1.2;
}

.line {
  height: 4px;
  width: 100px;
  background-color: #dc3545;
  margin-top: 10px;
}

.btn-glow {
  transition: all 0.3s ease;
  border-width: 2px;
}

.btn-glow:hover {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  background-color: white;
  color: black !important;
}

.btn-glow:hover i {
  color: black !important;
}

@keyframes mainMove {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* For small screens */
@media (max-width: 576px) {
  .responsive-title {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  .fs-4 {
    font-size: 1.2rem !important;
  }
}
</style>
