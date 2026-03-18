const fs = require('fs');
const path = 'c:/Users/Hp/Desktop/Iso_Uz/Iso-Uz/src/stores/main.js';
let content = fs.readFileSync(path, 'utf8');

// Insert new arrays at the right position before STORE
const storeRegex = /\/\/ ===== STORE =====/;
if (content.match(storeRegex) && !content.includes("DEFAULT_TEACHER_SCHEDULE")) {
    const newArrays = `// ===== DEFAULT TEACHER SCHEDULE =====
const DEFAULT_TEACHER_SCHEDULE = [
  { id: 1, time: "09:00", group: "Frontend 301", subject: "JavaScript OOP", color: "#6366f1" },
  { id: 2, time: "11:30", group: "JavaScript Bootcamp", subject: "DOM API", color: "#f59e0b" },
  { id: 3, time: "15:00", group: "Frontend 301", subject: "Amaliyot", color: "#ec4899" }
];

// ===== DEFAULT TEACHER ACTIVITY =====
const DEFAULT_TEACHER_ACTIVITY = [
  { id: 1, icon: "bi bi-check2-circle", text: "Frontend 301 guruhiga vazifa berildi", time: "10 daqiqa oldin", bgColor: "#d1fae5", iconColor: "#059669" },
  { id: 2, icon: "bi bi-person-plus", text: "Yangi talaba qo'shildi: Sardor", time: "2 soat oldin", bgColor: "#dbeafe", iconColor: "#2563eb" },
  { id: 3, icon: "bi bi-star", text: "Aziza Karimova 5 ball oldi", time: "Kecha, 15:30", bgColor: "#fef3c7", iconColor: "#d97706" }
];

`;
    content = content.replace(storeRegex, newArrays + "// ===== STORE =====");
}

// Add state refs for new arrays
if (!content.includes("teacherSchedule")) {
    content = content.replace(
        /const notifications = ref\([\s\S]*?\);/,
        `$&
  const teacherSchedule = ref(load("iso_teacher_schedule_v2", DEFAULT_TEACHER_SCHEDULE));
  const activity = ref(load("iso_teacher_activity_v2", DEFAULT_TEACHER_ACTIVITY));`
    );
}

// Update getters
if (!content.includes("teacherGroups")) {
    const oldTeacherStats = `  const teacherStats = computed(() => ({
    totalStudents: students.value.length,
  }));`;

    const newGetters = `  const teacherGroups = computed(() => {
    const tName = currentTeacher.value?.name;
    if (!tName) return [];
    
    const groupsMap = {};
    students.value.forEach((s) => {
      s.groups?.forEach((g) => {
        if (g.teacher === tName) {
          if (!groupsMap[g.name]) {
            groupsMap[g.name] = {
              ...g,
              students: 0,
              totalCoin: 0,
              color: "#6366f1",
              gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
            };
          }
          groupsMap[g.name].students += 1;
          groupsMap[g.name].totalCoin += s.coin;
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
    
    return students.value
      .filter((s) => s.groups?.some((g) => g.teacher === tName))
      .map((s) => {
        const groupName = s.groups.find((g) => g.teacher === tName)?.name;
        const attendance = 85 + (s.id % 15);
        return {
          ...s,
          group: groupName,
          attendance,
          gpa: (s.coin / 100).toFixed(1),
          status: "Faol",
        };
      });
  });

  const teacherStats = computed(() => ({
    totalStudents: teacherStudents.value.length,
    activeGroups: teacherGroups.value.length,
  }));`;

    content = content.replace(oldTeacherStats, newGetters);
}

// Fix saveAll
content = content.replace(
    /save\("iso_notifications_v2", notifications\.value\);/g,
    `save("iso_notifications_v2", notifications.value);\n    save("iso_teacher_schedule_v2", teacherSchedule.value);\n    save("iso_teacher_activity_v2", activity.value);`
);

// Fix exports
if (!content.includes("teacherGroups,")) {
    content = content.replace(
        /notifications,([\s\n]*)\/\/ getters/g,
        "notifications,\n    teacherSchedule,\n    activity,$1// getters"
    );
    content = content.replace(
        /teacherStats,([\s\n]*)\/\/ actions/g,
        "teacherStats,\n    teacherGroups,\n    teacherStudents,$1// actions"
    );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Main store updated');
