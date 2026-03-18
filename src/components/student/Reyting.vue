<!-- script -->
<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";
const store = useMainStore();

const activeTab = ref('students'); // 'students' or 'groups'

// store getter has sorted students
const sortedStudents = computed(() => store.sortedStudentsByRating);
const groupRatings = computed(() => store.globalGroupRatings);
</script>

<!-- html -->
<template>
  <div class="container py-1">
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
      <h5 class="fw-semibold mb-0">Platformadagi faol talabalar</h5>
      <div class="btn-group bg-light p-1 rounded-3 gap-3">
        <button class="btn btn-sm px-3 rounded-2"
          :class="activeTab === 'students' ? 'btn-white shadow-sm fw-bold' : 'btn-light text-muted'"
          @click="activeTab = 'students'">
          Talabalar
        </button>
        <button class="btn btn-sm px-3 rounded-2"
          :class="activeTab === 'groups' ? 'btn-white shadow-sm fw-bold' : 'btn-light text-muted'"
          @click="activeTab = 'groups'">
          Guruhlar
        </button>
      </div>
      <div class="current-user-rank fs-6 text-muted">
        Sizning o'rningiz:
        <span class="badge bg-primary rounded-pill fs-6 ms-1">
          #{{ store.currentStudentRank }}
        </span>
      </div>
    </div>

    <!-- Students Rating Table -->
    <div v-if="activeTab === 'students'" class="card border-0 shadow-sm rounded-4 px-3 py-1">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style="width: 80px">Reyting</th>
              <th>Ism-familya</th>
              <th>Guruh</th>
              <th class="text-end pe-4">Coin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, index) in sortedStudents" :key="m.id"
              :class="{ 'current-student-row': m.id === store.currentStudent?.id }">
              <td>
                <div v-if="index === 0"
                  class="rank-badge gold shadow-sm text-dark d-flex align-items-center justify-content-center">
                  <i class="bi bi-trophy-fill me-1 text-warning"></i> 1
                </div>
                <div v-else-if="index === 1"
                  class="rank-badge silver shadow-sm text-dark d-flex align-items-center justify-content-center">
                  <i class="bi bi-award-fill me-1 text-secondary"></i> 2
                </div>
                <div v-else-if="index === 2"
                  class="rank-badge bronze shadow-sm text-dark d-flex align-items-center justify-content-center">
                  <i class="bi bi-award-fill me-1" style="color: #b08d57"></i> 3
                </div>
                <div v-else class="rank-badge default text-muted d-flex align-items-center justify-content-center">
                  #{{ index + 1 }}
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img v-if="m.avatarImg" :src="m.avatarImg" class="rounded-circle object-fit-cover"
                    style="width: 40px; height: 40px" />
                  <div v-else class="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
                    :style="{
                      width: '40px',
                      height: '40px',
                      background: m.color || '#6366f1',
                    }">
                    {{ m.avatar || m.name[0] }}
                  </div>
                  <div>
                    <div class="fw-semibold">
                      {{ m.name }}
                      <span v-if="m.id === store.currentStudent?.id" class="badge bg-primary ms-1"
                        style="font-size: 10px">(Siz)</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span v-if="m.groups && m.groups.length > 0">
                  {{ m.groups[0].name }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td class="text-end pe-4 fw-bold" style="color: #f59e0b; font-size: 17px">
                {{ m.coin }} <i class="bi bi-coin ms-1"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Groups Rating Table -->
    <div v-else class="card border-0 shadow-sm rounded-4 px-3 py-1">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style="width: 80px">Reyting</th>
              <th>Guruh nomi</th>
              <th>Yo'nalish</th>
              <th>Talabalar</th>
              <th class="text-end pe-4">Umumiy Coin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(g, index) in groupRatings" :key="g.name">
              <td>
                <div class="rank-badge default text-muted d-flex align-items-center justify-content-center">
                  #{{ index + 1 }}
                </div>
              </td>
              <td>
                <div class="fw-bold">{{ g.name }}</div>
              </td>
              <td>
                <span class="badge bg-info-subtle text-info px-3">{{ g.direction }}</span>
              </td>
              <td>{{ g.students }} ta</td>
              <td class="text-end pe-4 fw-bold text-success" style="font-size: 17px">
                {{ g.totalCoin }} <i class="bi bi-coin ms-1"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<!-- style -->
<style scoped>
.table thead th {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  border-top: none;
  padding: 16px 12px;
}

.table tbody td {
  padding: 12px;
}

.current-student-row {
  background-color: rgba(99, 102, 241, 0.04) !important;
}

.rank-badge {
  width: 50px;
  height: 28px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #fef08a, #fbbf24);
}

.rank-badge.silver {
  background: linear-gradient(135deg, #e2e8f0, #94a3b8);
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #fcd34d, #b45309);
  color: white !important;
}

.rank-badge.default {
  background: #f1f5f9;
}

/* Tab Styles */
.btn-white {
  background-color: #fff;
  border: 1px solid #e2e8f0;
}

.dark-mode .btn-white {
  background-color: #334155;
  border-color: #475569;
  color: #fff !important;
}

.dark-mode .bg-light {
  background-color: #1e293b !important;
}
</style>
