<template>
  <div class="dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-muted">Guruhlar va talabalarni boshqarish.</p>
      </div>
    </div>

    <!-- STATISTIKA -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="s-card" style="--clr: #6366f1">
          <div class="s-icon"><i class="bi bi-people"></i></div>
          <p class="s-label">Jami talabalar</p>
          <h3 class="s-value">{{ store.teacherStats.totalStudents }}</h3>
        </div>
      </div>

      <div class="col-md-3">
        <div class="s-card" style="--clr: #10b981">
          <div class="s-icon"><i class="bi bi-collection"></i></div>
          <p class="s-label">Faol guruhlar</p>
          <h3 class="s-value">{{ store.teacherStats.activeGroups }}</h3>
        </div>
      </div>
    </div>

    <!-- GURUHLAR -->
    <div class="row">
      <div class="col-12">
        <div class="d-card">
          <h5 class="fw-semibold mb-3">Mening guruhlarim</h5>

          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Guruh</th>
                  <th>Talabalar</th>
                  <th>O'rtacha</th>
                  <th>Holat</th>
                  <th class="text-end">Amallar</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="g in store.teacherGroups" :key="g.id">
                  <td class="fw-semibold">{{ g.name }}</td>

                  <td>{{ g.students }}</td>

                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="prog-bg">
                        <div class="prog-fill" :style="{ width: g.avg + '%', background: g.color }"></div>
                      </div>
                      <small class="text-muted">{{ g.avg }}%</small>
                    </div>
                  </td>

                  <td>
                    <span class="badge-s" :class="g.status === 'Faol' ? 'b-ok' : 'b-warn'">
                      {{ g.status }}
                    </span>
                  </td>

                  <td class="text-end">
                    <button class="msg-btn" @click="sendMessage">
                      <i class="bi bi-send"></i> Xabar yuborish
                    </button>
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/stores";
const store = useMainStore();

function sendMessage() {
  alert("Xabar yuborish funksiyasi tez kunda ishga tushadi!");
}
</script>

<style scoped>
.s-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
}

.s-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--clr);
}

.s-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.s-label {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
}

.s-value {
  font-weight: 800;
  color: #1e293b;
}

.s-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--clr) 12%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--clr);
}

.d-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f1f5f9;
}

.table th {
  font-size: 12px;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
}

.table td {
  font-size: 14px;
  color: #334155;
}

.prog-bg {
  width: 80px;
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
}

.prog-fill {
  height: 100%;
  border-radius: 10px;
}

.badge-s {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.b-ok {
  background: #d1fae5;
  color: #059669;
}

.b-warn {
  background: #fef3c7;
  color: #d97706;
}

/* Xabar tugmasi */

.msg-btn {
  background: #6366f1;
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.msg-btn:hover {
  background: #4f46e5;
}
</style>
