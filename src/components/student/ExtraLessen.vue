<template>
  <div class="container py-1">
    <div class="mb-4 d-flex align-items-center gap-3">
      <div>
        <h5 class="fw-bold mb-1">Mavjud darslar materiallari</h5>
        <span class="text-muted small"
          >Qo'shimcha malaka va foydali ko'nikmalarni o'rganing</span
        >
      </div>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-lg-4 col-md-6" v-for="course in courses" :key="course.id">
        <div
          class="card h-100 border-0 shadow-sm rounded-4 course-card overflow-hidden"
        >
          <div class="course-thumb position-relative">
            <img
              :src="course.image"
              :alt="course.title"
              class="w-100 h-100 object-fit-cover"
            />
            <div
              class="overlay d-flex align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100"
            >
              <a
                :href="course.video"
                target="_blank"
                class="btn btn-light rounded-circle shadow p-0 d-flex align-items-center justify-content-center play-btn"
              >
                <i class="bi bi-play-fill fs-2 text-primary ms-1"></i>
              </a>
            </div>
            <span
              class="badge bg-dark position-absolute bottom-0 end-0 m-3 opacity-75"
            >
              <i class="bi bi-clock me-1"></i> {{ course.duration }}
            </span>
          </div>

          <div class="card-body p-4 d-flex flex-column">
            <span
              class="badge bg-primary-soft text-primary align-self-start mb-2 rounded-pill px-3"
              >{{ course.category }}</span
            >
            <h6 class="fw-bold mb-2">{{ course.title }}</h6>
            <p class="text-muted small mb-4" style="line-height: 1.5">
              {{ course.desc }}
            </p>

            <a
              :href="course.video"
              class="btn btn-outline-primary mt-auto w-100 rounded-3 d-flex justify-content-center align-items-center gap-2"
            >
              Ko'rishni boshlash
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const courses = [
  {
    id: 1,
    title: "HR suhbatigacha tayyorgarlik: Mukammal Rezyume",
    category: "Ish izlash",
    desc: "Qanday qilib HR menejer e'tiborini tortuvchi, professional rezyume (CV) va portfolio yaratish sirlari.",
    duration: "45 daqiqa",
    video: "https://www.youtube.com/watch?v=7UPkdQNB-gQ",
    image:
      "https://i.ytimg.com/vi/7UPkdQNB-gQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBeCG16QTNlC-paLIDk60LNZ19YsQ",
  },
  {
    id: 2,
    title: "IT kompaniyalarda HR suhbat",
    category: "Ish izlash",
    desc: "Suhbat davomida ko'p beriladigan savollar, o'zini tutish qoidalari va kutilmagan savollarga to'g'ri javob berish.",
    duration: "1 soat 15 daqiqa",
    video: "https://www.youtube.com/watch?v=e4sClkLPPKg",
    image:
      "https://cdn.prod.website-files.com/643507075046cf6dcb169402/65f713e8c032ac3baf60070a_leading-human-resources-the-comprehensive-guide-to-becoming-an-hr-manager-65cc179a0c396.webp",
  },
  {
    id: 3,
    title: "Soft Skills: Muhim ko'nikmalar",
    category: "Shaxsiy rivojlanish",
    desc: "Kommunikatsiya, vaqtni to'g'ri taqsimlash (Time management) va jamoada ishlash usullari haqida to'liq qo'llanma.",
    duration: "50 daqiqa",
    video: "https://www.youtube.com/watch?v=zjPStzJh6bo",
    image:
      "https://www.mentorink.com/wp-content/uploads/2024/09/soft-skills.webp",
  },
  {
    id: 4,
    title: "Senior dasturchi bilan texnik suhbat",
    category: "Texnik tajriba",
    desc: "Texnik suhbatlarda qanday algoritmlar va qaysi savollar tushishi haqida Senior mutaxassislardan maslahatlar.",
    duration: "1 soat 30 daqiqa",
    video: "https://www.youtube.com/watch?v=xTt369tULiU",
    image:
      "https://i.ytimg.com/vi/FoLqsbmy0qk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC3pdiZ38ZFHBVdsvoTGHo9cALSEg",
  },
  {
    id: 5,
    title: "Upwork va Freelance faoliyati",
    category: "Frilans",
    desc: "Xalqaro platformalarda qanday qilib birinchi buyurtmani olish va doimiy mijozlar bazasini shakllantirish sirlari.",
    duration: "1 soat",
    video: "https://www.youtube.com/watch?v=JmYO1OaPe-4",
    image:
      "https://media.licdn.com/dms/image/v2/D4E12AQEeNW16YK5-eg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1721188164203?e=2147483647&v=beta&t=xgIN5mYowsmB5Vr0-SXY3zb3WPU4rd5OHFcBUGXJNfc",
  },
  {
    id: 6,
    title: "Rezyume tayyorlash",
    category: "Ish izlash",
    desc: "Rezyumeni mukammal tayyorlash uchun o'quv qo'llanma. ",
    duration: "2 soat",
    video: "https://www.youtube.com/watch?v=7UPkdQNB-gQ",
    image: "https://www.spot.uz/media/img/2021/06/ijsAU416226497669338_l.jpg",
  },
];
</script>

<style scoped>
.course-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.course-thumb {
  height: 200px;
}





.overlay {
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s;
}

.course-card:hover .overlay {
  opacity: 1;
}

.play-btn {
  width: 60px;
  height: 60px;
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.course-card:hover .play-btn {
  transform: scale(1);
}

.play-btn:hover {
  background-color: #f8f9fa !important;
  transform: scale(1.1) !important;
}

.bg-primary-soft {
  background-color: #e0e7ff;
}
</style>
