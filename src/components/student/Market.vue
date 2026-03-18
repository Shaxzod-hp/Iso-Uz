<template>
  <div class="container py-1">
    <!-- Tabs -->
    <div class="mb-4 pb-2 d-flex flex-wrap justify-content-between align-items-center gap-3">
      <div class="d-flex gap-4">
        <button class="btn fs-5 fw-bold border-0 px-0 tab-btn"
          :class="activeTab === 'sale' ? 'text-primary tab-active' : 'text-secondary opacity-75'"
          @click="activeTab = 'sale'">
          Sotuvda
        </button>

        <button class="btn fs-5 fw-bold border-0 px-0 tab-btn"
          :class="activeTab === 'bought' ? 'text-primary tab-active' : 'text-secondary opacity-75'"
          @click="activeTab = 'bought'">
          Xaridlarim
        </button>
      </div>

      <div
        class="d-flex align-items-center gap-2 bg-primary bg-opacity-10 px-3 py-2 rounded-pill border border-primary border-opacity-10">
        <h6 class="mb-0 text-primary small fw-bold">Balans:</h6>
        <span class="fs-5 fw-bold text-primary">
          {{ store.currentStudent?.coin || 0 }} <i class="bi bi-coin text-warning"></i>
        </span>
      </div>
    </div>

    <!-- Category filter for sales -->
    <div v-if="activeTab === 'sale'" class="mb-4 d-flex gap-3 overflow-auto p-2 scroll-hide">
      <button class="badge rounded-pill border-0 px-3 py-2 shadow-sm transition-all"
        :class="categoryFilter === '' ? 'bg-primary text-white scale-105' : 'bg-white text-secondary border'"
        @click="categoryFilter = ''">Barchasi</button>
      <button v-for="cat in categories" :key="cat"
        class="badge rounded-pill border-0 px-3 py-2 shadow-sm transition-all"
        :class="categoryFilter === cat ? 'bg-primary text-white scale-105' : 'bg-white text-secondary border'"
        @click="categoryFilter = cat">{{ cat }}</button>
    </div>

    <!-- Cards -->
    <div class="row g-4" v-if="filteredItems.length">
      <div class="col-lg-4 col-md-6" v-for="item in filteredItems" :key="item.id">
        <div
          class="card h-100 border-0 shadow-sm rounded-4 product-card bg-white position-relative overflow-hidden fade-in">
          <!-- Category badge -->
          <div v-if="item.category" class="position-absolute top-0 start-0 m-3 z-3">
            <span class="badge bg-white text-primary border border-primary border-opacity-10 shadow-sm px-2 py-1 small">
              {{ item.category }}
            </span>
          </div>

          <!-- Image -->
          <div class="bg-white d-flex align-items-center justify-content-center p-4 position-relative"
            style="height: 220px;">
            <img v-if="item.image" :src="item.image" class="w-100 h-100 object-fit-contain transition-all hover-zoom"
              :alt="item.name"
              @error="(e) => (e.target.src = 'https://ui-avatars.com/api/?name=' + item.name + '&background=f8fafc&color=6366f1')" />
            <div v-else class="text-center opacity-25">
              <i class="bi bi-image fs-1 d-block mb-1"></i>
              <span class="extra-small">Rasm yo'q</span>
            </div>
          </div>

          <div class="card-body d-flex flex-column p-4 border-top">
            <h6 class="fw-bold mb-2 text-dark">{{ item.name }}</h6>
            <p class="text-muted small mb-4 flex-grow-1" style="line-height: 1.5;">
              {{ item.desc }}
            </p>

            <div class="d-flex justify-content-between align-items-center mt-auto">
              <div>
                <div class="text-muted extra-small fw-bold text-uppercase opacity-75 mb-1">Narxi</div>
                <div class="fw-bold fs-5 text-warning">
                  {{ item.price }} <i class="bi bi-coin small"></i>
                </div>
              </div>

              <button v-if="activeTab === 'sale'"
                class="btn btn-sm px-4 py-2 fw-bold rounded-pill shadow-sm transition-all" :class="(store.currentStudent?.coin || 0) >= item.price ? 'btn-primary' : 'btn-light text-muted border border-secondary border-opacity-10'
                  " @click="buy(item)" :disabled="(store.currentStudent?.coin || 0) < item.price">
                {{
                  (store.currentStudent?.coin || 0) >= item.price
                    ? "Sotib olish"
                    : "Mablag' yetarli emas"
                }}
              </button>
              <span v-else
                class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold border border-success border-opacity-25">
                <i class="bi bi-check2-circle me-1"></i> Xarid qilindi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5 mt-5 fade-in">
      <div class="empty-cart-box mx-auto mb-4">
        <i class="bi bi-cart-x fs-1 opacity-25"></i>
      </div>
      <h5 class="text-dark fw-bold">
        {{ activeTab === 'sale' ? "Hozircha mahsulotlar yo'q" : "Siz hali mahsulot xarid qilmadingiz" }}
      </h5>
      <p class="text-muted small">Market bo'limini muntazam kuzatib boring!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";
const store = useMainStore();

const activeTab = ref("sale");
const categoryFilter = ref("");

const categories = computed(() => {
  const cats = (store.marketItems || []).map(i => i.category).filter(Boolean);
  return [...new Set(cats)];
});

const filteredItems = computed(() => {
  let items = store.marketItems || [];

  if (activeTab.value === "sale") {
    items = items.filter(i => !i.bought);
  } else {
    items = items.filter(i => i.bought);
  }

  if (activeTab.value === "sale" && categoryFilter.value) {
    items = items.filter(i => i.category === categoryFilter.value);
  }

  return items;
});

function buy(item) {
  if (!store.currentStudent) {
    alert("Xatolik: Tizimga qayta kiring.");
    return;
  }
  if (store.currentStudent.coin < item.price) {
    alert("Coinlaringiz yetarli emas.");
    return;
  }

  if (confirm(`"${item.name}" mahsulotini xarid qilmoqchimisiz?`)) {
    store.buyItem(item.id);
  }
}
</script>

<style scoped>
.product-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
}

.hover-zoom {
  transition: transform 0.5s ease;
}

.product-card:hover .hover-zoom {
  transform: scale(1.08);
}

.tab-btn {
  position: relative;
  transition: all 0.3s;
}

.tab-active::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #6366f1;
  border-radius: 10px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }

  to {
    width: 100%;
    opacity: 1;
  }
}

.empty-cart-box {
  width: 90px;
  height: 90px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-hide::-webkit-scrollbar {
  display: none;
}

.scroll-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.extra-small {
  font-size: 10px;
}

.scale-105 {
  transform: scale(1.05);
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
