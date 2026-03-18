const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "To'lov muddati yaqinlashmoqda",
    message:
      "JavaScript Bootcamp guruhi uchun to'lov muddati 5 April 2026. Iltimos, o'z vaqtida to'lang.",
    type: "warning",
    icon: "bi bi-exclamation-triangle",
    date: "2026-03-12 10:00",
    read: false,
  },
  {
    id: 2,
    title: "Yangi dars qo'shildi",
    message:
      "SMM Pro guruhiga yangi dars qo'shildi: 'Targetli reklama yaratish'. Bugun soat 18:00 da.",
    type: "info",
    icon: "bi bi-bell",
    date: "2026-03-11 16:30",
    read: false,
  },
  {
    id: 3,
    title: "Reyting yangilandi",
    message:
      "Tabriklaymiz! Siz reytingda 3-o'ringa ko'tarildingiz. Davom eting!",
    type: "success",
    icon: "bi bi-trophy",
    date: "2026-03-10 09:00",
    read: true,
  },
];

export default DEFAULT_NOTIFICATIONS;
