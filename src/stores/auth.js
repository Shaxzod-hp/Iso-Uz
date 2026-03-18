import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useMainStore } from "@/stores";
import DEFAULT_STUDENTS from "./studentStore";
import DEFAULT_TEACHERS from "./teacherStore";

// LocalStorage helpers
function load(key, fallback) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const useAuthStore = defineStore("auth", () => {
  const mainStore = useMainStore();

  // ================= CURRENT USER =================
  const currentUser = ref(load("iso_currentUser", null));

  const isAuthenticated = computed(() => !!currentUser.value);
  const userRole = computed(() => currentUser.value?.role || null);

  // ================= 🔥 USERS (MUHIM FIX) =================
  const users = computed(() => {
    return [
      ...(mainStore.students || []),
      ...(mainStore.teachers || []),
    ];
  });

  // ================= REGISTER =================
  function register(data) {
    const loginLower = data.login.toLowerCase();

    const studentExists = mainStore.students.find(
      (s) => s.login?.toLowerCase() === loginLower
    );

    const teacherExists = mainStore.teachers.find(
      (t) => t.login?.toLowerCase() === loginLower
    );

    if (studentExists || teacherExists) {
      return { success: false, message: "Bu login band!" };
    }

    const newUser = {
      id: Date.now(),
      fullName: data.fullName,
      login: data.login,
      username: data.login, // 🔥 FIX
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
      avatar: data.fullName?.charAt(0)?.toUpperCase() || "U",
      color: "#6366f1",
      createdAt: new Date().toISOString(),
    };

    if (data.role === "student") {
      newUser.group = data.group || "Biriktirilmagan";
      newUser.coin = 350;
      newUser.payment = 0;

      mainStore.students.push(newUser);
    }

    if (data.role === "teacher") {
      newUser.specialty = data.specialty || "Yo‘nalish yo‘q";
      newUser.experience = "Yangi";

      mainStore.teachers.push(newUser);
    }

    mainStore.saveAll();

    return { success: true, user: newUser };
  }

  // ================= LOGIN =================
  function login({ login, password }) {
    const loginLower = login.toLowerCase();

    // ADMIN
    if (
      (mainStore.currentAdmin.login.toLowerCase() === loginLower ||
        mainStore.currentAdmin.email?.toLowerCase() === loginLower) &&
      mainStore.currentAdmin.password === password
    ) {
      currentUser.value = { ...mainStore.currentAdmin, role: "admin" };
      save("iso_currentUser", currentUser.value);
      return { success: true, user: currentUser.value };
    }

    // STUDENT
    const student = mainStore.students.find(
      (s) =>
        (s.login?.toLowerCase() === loginLower ||
          s.email?.toLowerCase() === loginLower) &&
        String(s.password) === String(password)
    );

    if (student) {
      currentUser.value = { ...student, role: "student" };
      save("iso_currentUser", currentUser.value);
      mainStore.currentStudent = student;
      return { success: true, user: currentUser.value };
    }

    // TEACHER
    const teacher = mainStore.teachers.find(
      (t) =>
        (t.login?.toLowerCase() === loginLower ||
          t.email?.toLowerCase() === loginLower) &&
        String(t.password) === String(password)
    );

    if (teacher) {
      currentUser.value = { ...teacher, role: "teacher" };
      save("iso_currentUser", currentUser.value);
      mainStore.currentTeacher = teacher;
      return { success: true, user: currentUser.value };
    }

    // DEFAULT STUDENT
    const defStudent = DEFAULT_STUDENTS.find(
      (s) =>
        (s.login?.toLowerCase() === loginLower ||
          s.email?.toLowerCase() === loginLower) &&
        String(s.password) === String(password)
    );

    if (defStudent) {
      currentUser.value = { ...defStudent, role: "student" };
      save("iso_currentUser", currentUser.value);
      return { success: true, user: currentUser.value };
    }

    // DEFAULT TEACHER
    const defTeacher = DEFAULT_TEACHERS.find(
      (t) =>
        (t.login?.toLowerCase() === loginLower ||
          t.email?.toLowerCase() === loginLower) &&
        String(t.password) === String(password)
    );

    if (defTeacher) {
      currentUser.value = { ...defTeacher, role: "teacher" };
      save("iso_currentUser", currentUser.value);
      return { success: true, user: currentUser.value };
    }

    return { success: false, message: "Login yoki parol noto'g'ri!" };
  }

  // ================= LOGOUT =================
  function logout() {
    currentUser.value = null;
    localStorage.removeItem("iso_currentUser");
  }

  // ================= UPDATE PROFILE =================
  function updateProfile(data) {
    if (!currentUser.value) return false;

    Object.assign(currentUser.value, data);

    currentUser.value.avatar =
      currentUser.value.fullName?.charAt(0)?.toUpperCase() || "U";

    save("iso_currentUser", currentUser.value);

    const sIdx = mainStore.students.findIndex(
      (s) => s.id === currentUser.value.id
    );

    if (sIdx !== -1) {
      mainStore.students.splice(sIdx, 1, { ...currentUser.value });
    }

    const tIdx = mainStore.teachers.findIndex(
      (t) => t.id === currentUser.value.id
    );

    if (tIdx !== -1) {
      mainStore.teachers.splice(tIdx, 1, { ...currentUser.value });
    }

    mainStore.saveAll();

    return true;
  }

  // ================= DELETE USER =================
  function deleteUser(id) {
    mainStore.students = (mainStore.students || []).filter(
      (s) => s.id !== id
    );

    mainStore.teachers = (mainStore.teachers || []).filter(
      (t) => t.id !== id
    );

    mainStore.saveAll();
  }

  return {
    currentUser,
    isAuthenticated,
    userRole,
    users, // 🔥 MUHIM
    register,
    login,
    logout,
    updateProfile,
    deleteUser,
  };
});