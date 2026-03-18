<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";

const store = useMainStore();

// Filter uchun v-model
const statusFilter = ref("");

// Boshlanish va tugash sanasi
const startDate = ref("");
const endDate = ref("");

// Current student payments
const payments = computed(() => store.currentStudent?.payments || []);

// Filtrlangan payments
const filteredPayments = computed(() => {
  return payments.value.filter((p) => {
    // Status bo‘yicha filtr
    if (statusFilter.value && p.status !== statusFilter.value) return false;

    // Date bo‘yicha filtr
    const paymentDate = new Date(p.date);
    if (startDate.value && paymentDate < new Date(startDate.value))
      return false;
    if (endDate.value && paymentDate > new Date(endDate.value)) return false;

    return true;
  });
});
</script>

<template>
  <div class="payments">
    <div class="container">
      <!-- FILTER -->
      <div
        class="d-flex justify-content-between align-items-end gap-3 mb-5 w-50"
      >
        <select v-model="statusFilter" class="form-select fw-bold text-dark">
          <option value="">Barchasi</option>
          <option value="paid">To'langan</option>
          <option value="unpaid">To'lanmagan</option>
          <option value="pending">Tasdiqlanmagan</option>
        </select>

        <div class="d-flex flex-column gap-1">
          <label for="startTime">Boshlanish vaqti</label>
          <input
            v-model="startDate"
            class="form-control border border-secondary"
            type="date"
            id="startTime"
          />
        </div>

        <div class="d-flex flex-column gap-1">
          <label for="endTime">Tugash vaqti</label>
          <input
            v-model="endDate"
            class="form-control border border-secondary"
            type="date"
            id="endTime"
          />
        </div>
      </div>

      <!-- TABLE -->
      <div class="card border overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-4">№</th>
                <th>Miqdori</th>
                <th>Holati</th>
                <th>To'lov turi</th>
                <th>Vaqti</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(payment, index) in filteredPayments"
                :key="payment.id"
              >
                <td class="ps-4">{{ index + 1 }}</td>
                <td class="fw-semibold">{{ payment.amount }} so'm</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': payment.status === 'paid',
                      'bg-warning text-dark': payment.status === 'pending',
                      'bg-danger': payment.status === 'unpaid',
                    }"
                  >
                    {{
                      payment.status === "paid"
                        ? "To'langan"
                        : payment.status === "unpaid"
                        ? "To'lanmagan"
                        : "Tasdiqlanmagan"
                    }}
                  </span>
                </td>
                <td>{{ payment.method }}</td>
                <td>{{ payment.date }}</td>
              </tr>

              <!-- AGAR DATA YO'Q BO'LSA -->
              <tr v-if="filteredPayments.length === 0">
                <td colspan="5" class="text-center py-3 text-muted">
                  Ma'lumot topilmadi
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payments {
  width: 100%;
}
</style>
