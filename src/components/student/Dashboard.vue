<!-- script -->
<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";
const store = useMainStore();

// dars jadavali chiqarish uchun kun oy yilini olish funcsiyalari
const currentDate = ref(new Date());

const daysInMonth = computed(() => {
  const y = currentDate.value.getFullYear();
  const m = currentDate.value.getMonth();
  return new Date(y, m + 1, 0).getDate();
});

function isLessonDay(day) {
  const y = currentDate.value.getFullYear();
  const m = currentDate.value.getMonth();
  const weekDay = new Date(y, m, day).getDay();
  if (weekDay === 0) return false;
  return day % 2 !== 0;
}

const firstDay = computed(() => {
  const y = currentDate.value.getFullYear();
  const m = currentDate.value.getMonth();
  const day = new Date(y, m, 1).getDay();
  return day === 0 ? 6 : day - 1;
});

const monthName = computed(() =>
  currentDate.value.toLocaleString("uz-UZ", { month: "long", year: "numeric" })
);

const chartLabels = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
const chartData = computed(() => {
  const defaultProgress = [85, 40, 95, 60, 100, 75, 15];
  const progress =
    store.currentStudent?.weeklyProgress &&
    store.currentStudent.weeklyProgress.length === 7
      ? store.currentStudent.weeklyProgress
      : defaultProgress;

  return chartLabels.map((day, idx) => ({
    day,
    val: Math.min(100, Math.max(progress[idx] || 0, 5)),
  }));
});

const totalGroups = computed(() => store.currentStudent?.groups?.length || 0);
</script>

<!-- html -->
<template>
  <div class="dashboard py-1">
    <!-- STATISTIKA -->
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <router-link
          to="/student/market"
          class="card border-0 shadow-sm p-4 rounded-4 h-100 text-decoration-none stat-card bg-white"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6
                class="text-muted small text-uppercase fw-bold mb-2 text-primary"
              >
                Omonat (Coinlar)
              </h6>
              <h2
                class="fw-bold mb-0 text-dark d-flex align-items-center gap-2"
              >
                {{ store.currentStudent?.coin || 0 }}
                <i class="bi bi-coin text-warning fs-4"></i>
              </h2>
            </div>
            <div
              class="icon-box rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-wallet2 fs-3"></i>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-md-4">
        <router-link
          to="/student/groups"
          class="card border-0 shadow-sm p-4 rounded-4 h-100 text-decoration-none stat-card bg-white"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6
                class="text-muted small text-uppercase fw-bold mb-2 text-primary"
              >
                Guruhlarim
              </h6>
              <h2 class="fw-bold mb-0 text-dark">{{ totalGroups }}</h2>
            </div>
            <div
              class="icon-box rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-people-fill fs-3"></i>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-md-4">
        <router-link
          to="/student/reyting"
          class="card border-0 shadow-sm p-4 rounded-4 h-100 text-decoration-none stat-card bg-white"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6
                class="text-muted small text-uppercase fw-bold mb-2 text-primary"
              >
                Reytingdagi o'rnim
              </h6>
              <h2 class="fw-bold mb-0 text-dark">
                #{{ store.currentStudentRank }}
              </h2>
            </div>
            <div
              class="icon-box rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-trophy-fill fs-3"></i>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- GRAFIK VA JADVAL -->
    <div class="row g-4 mb-4">
      <div class="col-lg-4 md: mb-5">
        <h5 class="fw-bold mb-3">Dars jadvali</h5>
        <div class="card shadow-sm p-4 rounded-4 h-100 text-dark bg-white">
          <div class="text-center mb-3">
            <span
              class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold"
              >{{ monthName }}</span
            >
          </div>
          <div
            class="d-grid text-center small fw-bold text-secondary mb-3 pb-2 border-bottom"
            style="grid-template-columns: repeat(7, 1fr)"
          >
            <div>Du</div>
            <div>Se</div>
            <div>Ch</div>
            <div>Pa</div>
            <div>Ju</div>
            <div>Sh</div>
            <div class="text-danger">Ya</div>
          </div>
          <div
            class="d-grid text-center gap-1"
            style="grid-template-columns: repeat(7, 1fr)"
          >
            <div v-for="n in firstDay" :key="'e' + n"></div>
            <div v-for="day in daysInMonth" :key="day" class="py-1">
              <span
                class="d-inline-flex align-items-center justify-content-center rounded-circle calendar-day fw-semibold"
                :class="
                  isLessonDay(day) ? 'has-lesson text-white' : 'hover-bg-light'
                "
                style="width: 32px; height: 32px; font-size: 13px"
              >
                {{ day }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <h5 class="fw-bold mb-3">Haftalik o'zlashtirish</h5>
        <div class="card shadow-sm p-5 rounded-4 h-100 text-dark bg-white">
          <div
            class="chart-box d-flex align-items-end justify-content-between gap-5 px- flex-grow-1"
          >
            <div
              class="bar-wrap flex-grow-1"
              v-for="b in chartData"
              :key="b.day"
            >
              <div
                class="bar w-100 position-relative shadow-sm"
                :style="{ height: b.val + '%' }"
              >
                <span class="bar-tip shadow-sm fw-bold">{{ b.val }}%</span>
              </div>
              <div class="mt-2">
                <small class="mt-3 fw-bold text-secondary">{{ b.day }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- style -->
<style scoped>
.stat-card {
  transition: 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08) !important;
}

.icon-box {
  width: 50px;
  height: 50px;
}

.calendar-day {
  transition: all 0.2s;
}

.has-lesson {
  background: linear-gradient(135deg, #6366f1, #818cf8);
}

.chart-box {
  height: 200px;
}

.bar-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.bar {
  background: linear-gradient(180deg, #6366f1, #818cf8);
  border-radius: 6px 6px 2px 2px;
  min-height: 10px;
  /* Increased from 5px */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar:hover {
  filter: brightness(1.1);
  transform: scaleY(1.01);
}

.bar:hover .bar-tip {
  opacity: 1 !important;
  transform: translateX(-50%) translateY(0);
}

.bar-tip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  background: #1e293b;
  color: #fff;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
</style>
