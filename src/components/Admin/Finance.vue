<template>
  <div class="finance-page p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">Moliya va To'lovlar</h4>
        <p class="text-muted small mb-0">Tizimdagi barcha pul operatsiyalari nazorati</p>
      </div>
      <button class="btn btn-primary d-flex align-items-center gap-2 rounded-3 shadow-sm px-4" @click="openModal">
        <i class="bi bi-plus-lg"></i>
        To'lov qo'shish
      </button>
    </div>

    <!-- Finance Widgets -->
    <div class="row g-4 mb-4">
      <div class="col-md-4" v-for="widget in financeWidgets" :key="widget.title">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100" :style="{ borderLeft: `4px solid ${widget.color}` }">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="icon-box rounded-3 d-flex align-items-center justify-content-center shadow-sm"
              :style="{ background: widget.bg, color: widget.color }" style="width: 45px; height: 45px">
              <i :class="widget.icon" class="fs-5"></i>
            </div>
            <span class="text-muted small fw-semibold">{{ widget.period }}</span>
          </div>
          <p class="text-muted small mb-1">{{ widget.title }}</p>
          <h4 class="fw-bold mb-0 text-dark">{{ widget.value }}</h4>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card border-0 shadow-sm rounded-4">
      <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
        <h6 class="fw-bold mb-0">Oxirgi to'lovlar</h6>
        <div class="d-flex gap-2">
          <div class="search-box position-relative">
            <i class="bi bi-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
            <input type="text" v-model="searchQuery" class="form-control form-control-sm border shadow-sm ps-5"
              placeholder="Ism yoki guruh bo'yicha..." style="width: 250px">
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="ps-4 border-0 small text-muted text-uppercase">O'quvchi</th>
              <th class="border-0 small text-muted text-uppercase">Summa</th>
              <th class="border-0 small text-muted text-uppercase">Sana</th>
              <th class="border-0 small text-muted text-uppercase">Status</th>
              <th class="border-0 small text-muted text-uppercase">Usul</th>
              <th class="pe-4 border-0 text-end"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pay in filteredPayments" :key="pay.id">
              <td class="ps-4">
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="avatar-sm rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                    :style="{ background: pay.color }" style="width: 32px; height: 32px; font-size: 12px">
                    {{ pay.student[0] }}
                  </div>
                  <div>
                    <h6 class="mb-0 small fw-bold text-dark">{{ pay.student }}</h6>
                    <span class="extra-small text-muted">{{ pay.group }}</span>
                  </div>
                </div>
              </td>
              <td><span class="fw-bold text-dark small">{{ pay.amount.toLocaleString() }} UZS</span></td>
              <td><span class="text-muted small">{{ formatDate(pay.date) }}</span></td>
              <td>
                <span
                  :class="pay.status === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'"
                  class="badge rounded-pill px-3 py-1 fw-semibold" style="font-size: 0.7rem">
                  {{ pay.status === 'paid' ? 'To\'landi' : 'Kutilmoqda' }}
                </span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-1 text-muted small">
                  <i
                    :class="pay.method === 'Click' ? 'bi bi-phone' : pay.method === 'Payme' ? 'bi bi-phone-fill' : 'bi bi-cash'"></i>
                  {{ pay.method }}
                </div>
              </td>
              <td class="pe-4 text-end">
                <button class="btn btn-light btn-sm rounded-circle"><i class="bi bi-three-dots"></i></button>
              </td>
            </tr>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">Ma'lumot topilmadi</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADD PAYMENT MODAL -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header border-bottom p-4">
          <h5 class="fw-bold mb-0">Yangi to'lov qo'shish</h5>
          <button class="btn-close" @click="showModal = false"></button>
        </div>
        <form @submit.prevent="savePayment" class="p-4">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label small fw-bold">Talaba</label>
              <select v-model="form.studentId" class="form-select" required>
                <option value="" disabled>Talabani tanlang</option>
                <option v-for="s in mainStore.students" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold">Summa (UZS)</label>
              <input v-model="form.amount" type="number" class="form-select" placeholder="Masalan: 800000" required />
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold">To'lov usuli</label>
              <select v-model="form.method" class="form-select">
                <option value="Click">Click</option>
                <option value="Payme">Payme</option>
                <option value="Naqd">Naqd</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold">Holat</label>
              <select v-model="form.status" class="form-select">
                <option value="paid">To'langan</option>
                <option value="pending">Kutilmoqda</option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-light" @click="showModal = false">Bekor qilish</button>
            <button type="submit" class="btn btn-primary px-4">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";

const mainStore = useMainStore();
const searchQuery = ref("");
const showModal = ref(false);

const form = ref({
  studentId: "",
  amount: "",
  method: "Click",
  status: "paid",
  group: ""
});

const financeWidgets = computed(() => [
  {
    title: "Jami tushum",
    value: mainStore.financeStats.totalBalance.toLocaleString() + " UZS",
    icon: "bi bi-wallet2",
    bg: "#eff6ff",
    color: "#3b82f6",
    period: "Umumiy"
  },
  {
    title: "Kutilayotgan",
    value: mainStore.financeStats.pendingPayments.toLocaleString() + " UZS",
    icon: "bi bi-clock-history",
    bg: "#fff7ed",
    color: "#f97316",
    period: "Shu oy"
  },
  {
    title: "Tranzaksiyalar",
    value: mainStore.financeStats.totalTransactions + " ta",
    icon: "bi bi-arrow-left-right",
    bg: "#f0fdf4",
    color: "#16a34a",
    period: "Jami"
  },
]);

const filteredPayments = computed(() => {
  return mainStore.allPayments.filter(p =>
    p.student.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.group.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function openModal() {
  form.value = {
    studentId: "",
    amount: "",
    method: "Click",
    status: "paid",
    group: ""
  };
  showModal.value = true;
}

function savePayment() {
  mainStore.addPayment(form.value);
  showModal.value = false;
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.bg-success-subtle {
  background-color: #d1fae5;
}

.bg-warning-subtle {
  background-color: #fef3c7;
}

.extra-small {
  font-size: 0.7rem;
}

.avatar-sm {
  flex-shrink: 0;
}

/* MODAL STYLES */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.search-box i {
  font-size: 0.9rem;
}

.form-select,
.form-control {
  border-radius: 0.75rem;
  padding: 0.6rem 1rem;
}

.form-select:focus,
.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.1);
}
</style>
