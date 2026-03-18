const fs = require('fs');

const path = 'c:/Users/Hp/Desktop/Iso_Uz/Iso-Uz/src/stores/main.js';
let content = fs.readFileSync(path, 'utf8');

// Rename keys
let originalContent = content;
content = content.replace(/"iso_student"/g, '"iso_student_v2"');
content = content.replace(/"iso_teacher"/g, '"iso_teacher_v2"');
content = content.replace(/"iso_students"/g, '"iso_students_v2"');
content = content.replace(/"iso_market"/g, '"iso_market_v2"');
content = content.replace(/"iso_projects"/g, '"iso_projects_v2"');
content = content.replace(/"iso_notifications"/g, '"iso_notifications_v2"');

// Fix DEFAULT_STUDENT
const defaultStudentGroupEnd = `    {
      id: 2,
      direction: "SMM & Marketing",
      name: "SMM Pro",
      teacher: "Dilnoza Yusupova",
      start: "15.01.2026",
      end: "15.07.2026",
      status: "active",
    },
  ],`;
const defaultStudentGroupsExt = `    {
      id: 2,
      direction: "SMM & Marketing",
      name: "SMM Pro",
      teacher: "Dilnoza Yusupova",
      start: "15.01.2026",
      end: "15.07.2026",
      status: "active",
    },
    {
      id: 3,
      direction: "Backend Dasturlash",
      name: "Python 101",
      teacher: "Jasur Nazarov",
      start: "01.03.2026",
      end: "01.09.2026",
      status: "active",
    },
    {
      id: 4,
      direction: "Mobile Dasturlash",
      name: "Flutter Dev",
      teacher: "Bekzod Tursunov",
      start: "01.04.2026",
      end: "01.10.2026",
      status: "active",
    },
  ],`;
content = content.replace(defaultStudentGroupEnd, defaultStudentGroupsExt);

// Extract DEFAULT_STUDENTS array string
const startMarker = "const DEFAULT_STUDENTS = [";
const splitIdx = content.indexOf(startMarker);
const blockStart = splitIdx + startMarker.length - 1; // points to '['
let brackets = 0;
let blockEnd = -1;
for (let i = blockStart; i < content.length; i++) {
    if (content[i] === '[') brackets++;
    if (content[i] === ']') brackets--;
    if (brackets === 0) {
        blockEnd = i + 1;
        break;
    }
}
const arrayStr = content.substring(blockStart, blockEnd);

let stds = eval('(' + arrayStr + ')');
stds.forEach((s, idx) => {
    const feIndex = s.groups.findIndex(g => g.direction && g.direction.includes('Frontend'));
    if (feIndex > 0) {
        const feGroup = s.groups.splice(feIndex, 1)[0];
        s.groups.unshift(feGroup);
    } else if (feIndex === -1 && s.groups.length > 0) {
        s.groups.unshift({
            id: 99 + idx,
            direction: "Frontend",
            name: "JavaScript Bootcamp",
            teacher: "Akmal Karimov",
            start: "01.02.2026",
            end: "01.08.2026",
            status: "active",
        });
    }
});

let str = JSON.stringify(stds, null, 2);
str = str.replace(/"(\w+)":/g, "$1:"); // remove quotes from keys for JS syntax
str = str.replace(/\\"/g, '"'); // fix escaped quotes inside strings

content = content.substring(0, blockStart) + str + content.substring(blockEnd);

// Add actions
const newActions = `  function deleteProject(projectId) {
    projects.value = projects.value.filter((p) => p.id !== projectId);
    saveAll();
  }

  function addMembersToProject(projectId, newMembers) {
    const proj = projects.value.find((p) => p.id === projectId);
    if (proj) {
      proj.members = [...new Set([...(proj.members || []), ...newMembers])];
      saveAll();
    }
  }

  function saveAll()`;
content = content.replace("  function saveAll()", newActions);

const newExports = `    addProject,
    deleteProject,
    addMembersToProject,
    markNotificationRead,`;
content = content.replace("    addProject,\n    markNotificationRead,", newExports);

fs.writeFileSync(path, content, 'utf8');
console.log('Store updated successfully');
