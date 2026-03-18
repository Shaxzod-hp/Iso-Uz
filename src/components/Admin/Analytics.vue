<template>
  <div class="analytics-page p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">Tahlil va Statistika</h4>
        <p class="text-muted small mb-0">Loyiha bo'yicha umumiy ko'rsatkichlar</p>
      </div>
      <div class="d-flex gap-2">
        <select class="form-select form-select-sm shadow-sm" style="width: 150px">
          <option>Oxirgi 30 kun</option>
          <option>Shu oy</option>
          <option>Shu yil</option>
        </select>
        <button class="btn btn-primary btn-sm px-3 shadow-sm">
          <i class="bi bi-download me-1"></i> Hisobot
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="row g-4 mb-4">
      <div class="col-md-3" v-for="stat in stats" :key="stat.title">
        <div class="card border-0 shadow-sm rounded-4 p-3 h-100 analytics-card">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="icon-box rounded-3 d-flex align-items-center justify-content-center" :style="{ background: stat.bg, color: stat.color }">
              <i :class="stat.icon" class="fs-5"></i>
            </div>
            <div>
              <p class="text-muted small mb-0">{{ stat.title }}</p>
              <h5 class="fw-bold mb-0">{{ stat.value }}</h5>
            </div>
          </div>
          <div class="mt-2 d-flex align-items-center gap-1">
            <span :class="stat.trend > 0 ? 'text-success' : 'text-danger'" class="small fw-bold">
              <i :class="stat.trend > 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              {{ Math.abs(stat.trend) }}%
            </span>
            <span class="text-muted extra-small">o'tgan oyga nisbatan</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- Chart Placeholder -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="fw-bold mb-0">O'quvchilar o'sish dinamikasi</h6>
            <div class="dropdown">
              <button class="btn btn-light btn-sm rounded-pill px-3 border shadow-sm" type="button">
                Har haftalik
              </button>
            </div>
          </div>
          <div class="chart-area bg-light rounded-4 d-flex align-items-center justify-content-center text-muted" style="height: 300px">
            <div class="text-center">
              <i class="bi bi-bar-chart-line fs-1 opacity-25 d-block mb-2"></i>
              <p class="small">Grafik ko'rinishi (Chart.js integratsiyasi uchun tayyor)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Courses -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <h6 class="fw-bold mb-4">Ommabop yo'nalishlar</h6>
          <div class="course-list d-flex flex-column gap-3">
            <div v-for="course in store.courses" :key="course.id" class="d-flex align-items-center gap-3">
              <div class="course-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                   :style="{ background: course.color + '20', color: course.color }" style="width: 40px; height: 40px">
                <i :class="course.icon" class="fs-6"></i>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between mb-1">
                  <span class="small fw-semibold">{{ course.name }}</span>
                  <span class="small text-muted">{{ course.students }} ta</span>
                </div>
                <div class="progress" style="height: 6px">
                  <div class="progress-bar rounded-pill" :style="{ width: (course.students / 1) + '%', background: course.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMainStore } from "@/stores";

const store = useMainStore();

const stats = ref([
  { title: "Jami Talabalar", value: "1,280", trend: 12, icon: "bi bi-people", bg: "#e0e7ff", color: "#4f46e5" },
  { title: "Faol Kurslar", value: "24", trend: 5, icon: "bi bi-journal-check", bg: "#dcfce7", color: "#16a34a" },
  { title: "Oylik Tushum", value: "$12,450", trend: 8, icon: "bi bi-credit-card", bg: "#fef3c7", color: "#d97706" },
  { title: "O'rtacha Ball", value: "85.4", trend: -2, icon: "bi bi-star", bg: "#f3e8ff", color: "#9333ea" },
]);
</script>

<style scoped>
.analytics-card {
  transition: transform 0.2s ease;
}
.analytics-card:hover {
  transform: translateY(-3px);
}
.icon-box {
  width: 48px;
  height: 48px;
}
.extra-small {
  font-size: 0.7rem;
}
.progress-bar {
  transition: width 1s ease-in-out;
}
</style>
