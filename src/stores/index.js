import { defineStore } from "pinia";
import { ref, computed } from "vue";
import DEFAULT_STUDENTS from "./studentStore";
import DEFAULT_TEACHERS from "./teacherStore";
import DEFAULT_PROJECTS from "./projectStore";
import DEFAULT_MARKET from "./marketStore";
import DEFAULT_NOTIFICATIONS from "./notificationStore";
import DEFAULT_VIDEOS from "./homeworkVideo";

const DEFAULT_COURSES = [
  { id: 1, name: "Frontend Dasturlash", icon: "bi-code-slash", students: 45, color: "#6366f1", direction: "Frontend" },
  { id: 2, name: "Backend (Python)", icon: "bi-terminal", students: 32, color: "#10b981", direction: "Backend" },
  { id: 3, name: "UI/UX Dizayn", icon: "bi-palette", students: 28, color: "#f59e0b", direction: "Design" },
];

const DEFAULT_ADMIN = {
  id: 0,
  fullName: "Administrator",
  login: "admin",
  password: "admin",
  role: "admin",
  avatar: "A",
  color: "#3b82f6"
};

// ===== LocalStorage Helpers =====
function load(key, fallback) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("LocalStorage save error:", e);
    if (e.name === 'QuotaExceededError') {
      alert("Xotira to'ldi! Iltimos, ba'zi ma'lumotlarni o'chiring yoki profil rasmini kichikroq hajmlisini yuklang.");
    }
  }
}

export const useMainStore = defineStore("main", () => {
  // STATE
  const loadedStudent = load("iso_current_student", DEFAULT_STUDENTS[0]);
  if (loadedStudent && (!loadedStudent.weeklyProgress || loadedStudent.weeklyProgress.length !== 7)) {
    loadedStudent.weeklyProgress = [85, 40, 95, 60, 100, 75, 15]; // Reset to default if corrupted or missing
  }
  const currentStudent = ref(loadedStudent);
  const currentTeacher = ref(load("iso_current_teacher", DEFAULT_TEACHERS[0]));
  const currentAdmin = ref(load("iso_current_admin", DEFAULT_ADMIN));

  const students = ref(load("iso_students", DEFAULT_STUDENTS).map(s => ({ ...s, role: 'student' })));
  const teachers = ref(load("iso_teachers", DEFAULT_TEACHERS).map(t => ({ ...t, role: 'teacher' })));
  const courses = ref(load("iso_courses", DEFAULT_COURSES));
  const marketItems = ref(load("iso_market", DEFAULT_MARKET || []));
  const projects = ref(load("iso_projects", DEFAULT_PROJECTS || []));
  // Migration for empty projects
  if (!projects.value || projects.value.length === 0) {
    projects.value = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
  }

  const notifications = ref(load("iso_notifications", DEFAULT_NOTIFICATIONS || []));
  const adminData = ref(load("iso_admin", DEFAULT_ADMIN));
  const teacherSchedule = ref(load("iso_teacher_schedule", []));
  const activity = ref(load("iso_teacher_activity", []));
  const isDarkMode = ref(load("iso_dark_mode", false));
  const homeworkSubmissions = ref(load("iso_homework_submissions", []));

  // Sync students migration: Ensure roles are saved
  if (students.value.some(s => !s.role)) {
    students.value = students.value.map(s => ({ ...s, role: 'student' }));
    save("iso_students", students.value);
  }
  if (teachers.value.some(t => !t.role)) {
    teachers.value = teachers.value.map(t => ({ ...t, role: 'teacher' }));
    save("iso_teachers", teachers.value);
  }

  const assignments = ref(load("iso_assignments", [
    { id: 1, title: "3 - oy. 4-Lesson. Non-primitive types", group: "JavaScript Bootcamp", date: "24 Apr, 2025", submitted: 0, total: 15, status: "Bajarilmagan", icon: "bi-code", color: "#ef4444", bgColor: "#fee2e2" },
    { id: 2, title: "3 - oy. 3-Lesson. Non-primitive types", group: "JavaScript Bootcamp", date: "21 Apr, 2025", submitted: 0, total: 15, status: "Bajarilmagan", icon: "bi-code", color: "#ef4444", bgColor: "#fee2e2" },
    { id: 3, title: "3 - oy. 2-Lesson. Shartli va takrorlash operatorlari", group: "JavaScript Bootcamp", date: "19 Apr, 2025", submitted: 0, total: 15, status: "Bajarilmagan", icon: "bi-code", color: "#ef4444", bgColor: "#fee2e2" },
    { id: 4, title: "HTML/CSS Basic", group: "JavaScript Bootcamp", date: "2026-03-10", submitted: 12, total: 15, status: "Bajarildi", icon: "bi-code", color: "#6366f1", bgColor: "#e0e7ff" },
    { id: 5, title: "Responsive Layout", group: "Frontend 301", date: "2026-03-12", submitted: 8, total: 12, status: "Kutilmoqda", icon: "bi-layout-sidebar", color: "#f59e0b", bgColor: "#fef3c7" },
  ]));

  // Migration for Market (Reset bought state if needed and update images)
  const BASE_URL = import.meta.env.BASE_URL || '/';
  if (marketItems.value && marketItems.value.length > 0) {
    marketItems.value = marketItems.value.map(item => {
      const defaultItem = DEFAULT_MARKET.find(d => d.id === item.id);
      if (defaultItem) {
        // Fix image paths for GitHub Pages
        if (defaultItem.image && !defaultItem.image.startsWith('http')) {
          const cleanPath = defaultItem.image.startsWith('/') ? defaultItem.image.slice(1) : defaultItem.image;
          item.image = BASE_URL + cleanPath;
        }
        // Force bought to false if it's currently true to meet user request
        item.bought = false;
      }
      return item;
    });
  }

  const videos = ref(load("iso_videos", DEFAULT_VIDEOS));

  // Migration for Market (Reset bought state if needed and update images)
  // (Removed redundant block)

  // GETTERS
  const sortedStudentsByRating = computed(() => {
    return [...students.value].sort((a, b) => b.coin - a.coin);
  });

  const currentStudentRank = computed(() => {
    const sorted = sortedStudentsByRating.value;
    if (!currentStudent.value) return 0;
    const idx = sorted.findIndex((s) => s.id === currentStudent.value.id);
    return idx >= 0 ? idx + 1 : 0;
  });

  const unreadNotificationsCount = computed(
    () => notifications.value.filter((n) => !n.read).length
  );

  const studentStats = computed(() => ({
    coin: currentStudent.value?.coin || 0,
    payments: currentStudent.value?.payments || [],
    groupsCount: currentStudent.value?.groups?.length || 0,
  }));

  const globalGroupRatings = computed(() => {
    const groupsMap = {};
    students.value.forEach((s) => {
      s.groups?.forEach((g) => {
        if (!groupsMap[g.name]) {
          groupsMap[g.name] = {
            name: g.name,
            direction: g.direction || "Dasturlash",
            students: 0,
            totalCoin: 0,
            avg: 0
          };
        }
        groupsMap[g.name].students += 1;
        groupsMap[g.name].totalCoin += (s.coin || 0);
      });
    });

    return Object.values(groupsMap).map((g) => {
      g.avg = g.students > 0 ? Math.round(g.totalCoin / g.students) : 0;
      return g;
    }).sort((a, b) => b.totalCoin - a.totalCoin);
  });

  const teacherGroups = computed(() => {
    const tName = currentTeacher.value?.name;
    if (!tName) return [];

    const groupsMap = {};
    students.value.forEach((s) => {
      s.groups?.forEach((g) => {
        if (g.teacher === tName || !g.teacher) {
          if (!groupsMap[g.name]) {
            groupsMap[g.name] = {
              name: g.name,
              direction: g.direction || "Dasturlash",
              students: 0,
              totalCoin: 0,
              avg: 0,
              tasks: assignments.value.filter(a => a.group === g.name).length,
              status: g.status || "Faol",
              color: "#6366f1",
              gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
            };
          }
          groupsMap[g.name].students += 1;
          groupsMap[g.name].totalCoin += (s.coin || 0);
        }
      });
    });

    return Object.values(groupsMap).map((g) => {
      g.avg = g.students > 0 ? Math.min(100, Math.round(g.totalCoin / g.students / 10)) : 0;
      return g;
    });
  });

  const teacherStudents = computed(() => {
    const tName = currentTeacher.value?.name;
    if (!tName) return [];
    return students.value.filter(s => s.groups?.some(g => g.teacher === tName || !g.teacher));
  });

  const teacherStats = computed(() => ({
    totalStudents: teacherStudents.value.length,
    activeGroups: teacherGroups.value.length,
  }));

  const allPayments = computed(() => {
    const res = [];
    students.value.forEach(s => {
      if (s.payments) {
        s.payments.forEach(p => {
          res.push({
            ...p,
            student: s.name,
            studentId: s.id,
            color: s.color || "#3b82f6"
          });
        });
      }
    });
    return res.sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  const financeStats = computed(() => {
    const total = allPayments.value.reduce((acc, curr) => acc + (curr.status === 'paid' ? Number(curr.amount) : 0), 0);
    const pending = allPayments.value.reduce((acc, curr) => acc + (curr.status !== 'paid' ? Number(curr.amount) : 0), 0);
    return {
      totalBalance: total,
      pendingPayments: pending,
      totalTransactions: allPayments.value.length
    };
  });

  const allGroups = computed(() => {
    const res = [];
    students.value.forEach(s => {
      s.groups?.forEach(g => {
        const existing = res.find(gr => gr.name === g.name);
        if (existing) {
          existing.studentsCount++;
        } else {
          res.push({
            ...g,
            studentsCount: 1,
            teacher: g.teacher || "Tayinlanmagan"
          });
        }
      });
    });
    return res;
  });

  // ACTIONS
  function saveAll() {
    save("iso_current_student", currentStudent.value);
    save("iso_current_teacher", currentTeacher.value);
    save("iso_current_admin", currentAdmin.value);
    save("iso_students", students.value);
    save("iso_teachers", teachers.value);
    save("iso_courses", courses.value);
    save("iso_market", marketItems.value);
    save("iso_projects", projects.value);
    save("iso_notifications", notifications.value);
    save("iso_teacher_schedule", teacherSchedule.value);
    save("iso_teacher_activity", activity.value);
    save("iso_admin", adminData.value);
    save("iso_assignments", assignments.value);
    save("iso_videos", videos.value);
    save("iso_dark_mode", isDarkMode.value);
    save("iso_homework_submissions", homeworkSubmissions.value);
  }

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value;
    saveAll();
  }

  function updateStudent(studentId, updatedData) {
    const idx = students.value.findIndex(s => s.id === studentId);
    if (idx !== -1) {
      students.value[idx] = { ...students.value[idx], ...updatedData };
      if (currentStudent.value && currentStudent.value.id === studentId) {
        currentStudent.value = { ...currentStudent.value, ...updatedData };
      }
      saveAll();
      return true;
    }
    return false;
  }

  function resetAll() {
    currentStudent.value = JSON.parse(JSON.stringify(DEFAULT_STUDENTS[0]));
    currentTeacher.value = JSON.parse(JSON.stringify(DEFAULT_TEACHERS[0]));
    currentAdmin.value = JSON.parse(JSON.stringify(DEFAULT_ADMIN));
    students.value = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    teachers.value = JSON.parse(JSON.stringify(DEFAULT_TEACHERS));
    courses.value = JSON.parse(JSON.stringify(DEFAULT_COURSES));
    marketItems.value = JSON.parse(JSON.stringify(DEFAULT_MARKET || []));
    projects.value = JSON.parse(JSON.stringify(DEFAULT_PROJECTS || []));
    notifications.value = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS || []));
    assignments.value = [
      { id: 1, title: "HTML/CSS Basic", group: "JavaScript Bootcamp", date: "2026-03-10", submitted: 12, total: 15, status: "Bajarildi", icon: "bi-code", color: "#6366f1", bgColor: "#e0e7ff" },
    ];
    videos.value = [];
    teacherSchedule.value = [];
    activity.value = [];
    adminData.value = JSON.parse(JSON.stringify(DEFAULT_ADMIN));
    homeworkSubmissions.value = [];
    saveAll();
  }

  function addCoinToStudent(studentId, amount, reason) {
    const student = students.value.find((s) => s.id === studentId);
    if (student) {
      student.coin = (student.coin || 0) + Number(amount);
      activity.value.unshift({
        id: Date.now(),
        icon: "bi bi-star",
        text: `${student.name}ga ${amount} coin qo'shildi: ${reason}`,
        time: new Date().toLocaleTimeString(),
        bgColor: "#fef3c7",
        iconColor: "#d97706",
      });
      saveAll();
      return true;
    }
    return false;
  }

  function addTeacherTask(taskData) {
    const groupStudents = students.value.filter(s => s.groups?.some(g => g.name === taskData.group)).length;
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      group: taskData.group,
      date: new Date().toISOString().split('T')[0],
      submitted: 0,
      total: groupStudents || 10,
      status: "Kutilmoqda",
      icon: "bi-journal-text",
      color: "#6366f1",
      bgColor: "#e0e7ff"
    };
    assignments.value.unshift(newTask);
    saveAll();
  }

  function addStudent(studentData) {
    const newStudent = {
      id: Date.now(),
      name: studentData.name,
      familya: studentData.familya || "",
      login: studentData.login || studentData.name.toLowerCase().replace(' ', '_'),
      password: studentData.password || "12345",
      phone: studentData.phone || "",
      email: studentData.email || "",
      avatar: studentData.name[0],
      color: "#6366f1",
      coin: 0,
      groups: [{ name: studentData.group, direction: "Dasturlash", teacher: currentTeacher.value?.name, status: "Faol" }]
    };
    students.value.push(newStudent);
    saveAll();
  }

  function createGroup(groupData) {
    activity.value.unshift({
      id: Date.now(),
      icon: "bi bi-collection",
      text: `Yangi guruh ochildi: ${groupData.name}`,
      time: "Hozirgina",
      bgColor: "#f3e8ff",
      iconColor: "#9333ea",
    });
    saveAll();
  }

  function uploadVideo(groupName, videoData) {
    const newVid = {
      id: Date.now(),
      title: videoData.title,
      url: videoData.url,
      group: groupName,
      date: new Date().toISOString().split('T')[0],
      teacher: currentTeacher.value?.name,
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg"
    }
    videos.value.unshift(newVid)

    activity.value.unshift({
      id: Date.now() + 1,
      icon: "bi bi-play-circle",
      text: `${groupName} guruhiga yangi video yuklandi: ${videoData.title}`,
      time: "Hozirgina",
      bgColor: "#fef2f2",
      iconColor: "#ef4444",
    });
    saveAll();
  }

  function markAttendance(groupName, date, attendanceData) {
    activity.value.unshift({
      id: Date.now(),
      icon: "bi bi-calendar-check",
      text: `${groupName} guruhi uchun davomat olindi (${date})`,
      time: "Hozirgina",
      bgColor: "#cffafe",
      iconColor: "#0891b2",
    });
    saveAll();
  }

  // === PROJECT ACTIONS ===
  function addProject(projectData) {
    const newProj = {
      ...projectData,
      id: Date.now(),
      progress: projectData.progress || 0,
      status: projectData.status || "Kutilmoqda",
      createdBy: currentStudent.value?.id
    };
    projects.value.unshift(newProj);
    saveAll();
    // Force reactivity update for any observers
    projects.value = [...projects.value];
  }

  function deleteProject(id) {
    projects.value = projects.value.filter(p => p.id !== id);
    saveAll();
  }

  function addMembersToProject(projectId, members) {
    const proj = projects.value.find(p => p.id === projectId);
    if (proj) {
      proj.members = [...new Set([...(proj.members || []), ...members])];
      saveAll();
    }
  }

  function buyItem(itemId) {
    const item = marketItems.value.find(i => i.id === itemId);
    if (item && currentStudent.value && currentStudent.value.coin >= item.price) {
      currentStudent.value.coin -= item.price;
      item.bought = true;
      saveAll();
    }
  }

  // === PROFILE ACTIONS ===
  function updateStudentAvatar(imgData) {
    if (currentStudent.value) {
      currentStudent.value = { ...currentStudent.value, avatarImg: imgData };
      const idx = students.value.findIndex(s => s.id === currentStudent.value.id);
      if (idx !== -1) {
        students.value[idx] = { ...students.value[idx], avatarImg: imgData };
      }
      saveAll();
    }
  }

  function updateTeacherAvatar(imgData) {
    if (currentTeacher.value) {
      currentTeacher.value = { ...currentTeacher.value, avatarImg: imgData };
      const idx = teachers.value.findIndex(t => t.id === currentTeacher.value.id);
      if (idx !== -1) {
        teachers.value[idx] = { ...teachers.value[idx], avatarImg: imgData };
      }
      saveAll();
    }
  }

  function addTeacherHomework(homeworkData) {
    const newTask = {
      id: Date.now(),
      title: homeworkData.title,
      group: homeworkData.group,
      date: new Date().toISOString().split('T')[0],
      submitted: 0,
      total: students.value.filter(s => s.groups?.some(g => g.name === homeworkData.group)).length || 10,
      status: "Kutilmoqda",
      icon: "bi-journal-text",
      color: "#6366f1",
      bgColor: "#e0e7ff",
      description: homeworkData.description,
      deadline: homeworkData.deadline
    };
    assignments.value.unshift(newTask);
    saveAll();
  }

  function submitHomework(lessonId, data) {
    const idx = homeworkSubmissions.value.findIndex(h => h.lessonId === lessonId && h.studentId === currentStudent.value?.id);
    if (idx !== -1) {
      homeworkSubmissions.value[idx] = { ...homeworkSubmissions.value[idx], ...data, updatedAt: new Date().toISOString() };
    } else {
      homeworkSubmissions.value.push({
        lessonId,
        studentId: currentStudent.value?.id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    saveAll();
  }

  function addCourse(courseData) {
    const newCourse = {
      id: Date.now(),
      name: courseData.name,
      icon: courseData.icon || "bi-journal-text",
      students: 0,
      color: courseData.color || "#6366f1"
    };
    courses.value.push(newCourse);
    saveAll();
  }

  function addPayment(paymentData) {
    const student = students.value.find(s => s.id === paymentData.studentId || (s.name === paymentData.student));
    if (student) {
      if (!student.payments) student.payments = [];
      student.payments.unshift({
        id: Date.now(),
        amount: Number(paymentData.amount.toString().replace(/[^0-9]/g, '')),
        status: paymentData.status || 'paid',
        method: paymentData.method || 'Naqd',
        date: new Date().toISOString(),
        group: paymentData.group || (student.groups?.[0]?.name || 'Noma\'lum')
      });
      saveAll();
    }
  }

  return {
    currentStudent, currentTeacher, currentAdmin, students, teachers, courses, marketItems, projects, notifications, teacherSchedule, activity, adminData, assignments, videos,
    sortedStudentsByRating, currentStudentRank, unreadNotificationsCount, studentStats, teacherStats, teacherGroups, teacherStudents, globalGroupRatings, homeworkSubmissions, allPayments, financeStats, allGroups,
    addCoinToStudent, addTeacherTask, addStudent, createGroup, uploadVideo, markAttendance,
    addProject, deleteProject, addMembersToProject, updateStudentAvatar, updateTeacherAvatar, addTeacherHomework, buyItem,
    saveAll, resetAll, toggleDarkMode, updateStudent, isDarkMode, submitHomework, addCourse, addPayment
  };
});
