// LocalStorage Simulated Database
let teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
let students = JSON.parse(localStorage.getItem('students') || '[]');
let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
let messages = JSON.parse(localStorage.getItem('messages') || '[]');
let currentTeacher = '';

function saveAll() {
  localStorage.setItem('teachers', JSON.stringify(teachers));
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('appointments', JSON.stringify(appointments));
  localStorage.setItem('messages', JSON.stringify(messages));
}

// ================= Admin Functions =================
function addTeacher() {
  const name = document.getElementById('tName').value.trim();
  const dept = document.getElementById('tDept').value.trim();
  const subject = document.getElementById('tSubject').value.trim();
  if (!name || !dept || !subject) return alert('All fields required.');

  teachers.push({ name, dept, subject });
  saveAll();
  alert('Teacher added!');
  document.getElementById('tName').value = '';
  document.getElementById('tDept').value = '';
  document.getElementById('tSubject').value = '';
  renderTeachers();
}

function updateTeacher(index) {
  const t = teachers[index];
  const name = prompt("Update Name", t.name);
  const dept = prompt("Update Department", t.dept);
  const subject = prompt("Update Subject", t.subject);
  if (name && dept && subject) {
    teachers[index] = { name, dept, subject };
    saveAll();
    renderTeachers();
    alert("Teacher updated");
  }
}

function deleteTeacher(index) {
  if (confirm("Delete this teacher?")) {
    teachers.splice(index, 1);
    saveAll();
    renderTeachers();
  }
}

function registerStudent() {
  const name = document.getElementById('sName').value.trim();
  if (!name) return alert("Name required.");
  students.push({ name, approved: false });
  saveAll();
  alert('Registration submitted!');
  document.getElementById('sName').value = '';
}

function approveStudent(index) {
  students[index].approved = true;
  saveAll();
  renderStudents();
}

// ================= Student Functions =================
function bookAppointment() {
  const teacher = document.getElementById('appointmentTeacher').value;
  const time = document.getElementById('appointmentTime').value;
  const student = document.getElementById('appointmentStudentName')?.value || 'Anonymous';
  if (!teacher || !time) return alert("Teacher and Time required.");

  appointments.push({ teacher, time, student, status: 'Pending' });
  saveAll();
  alert('Appointment requested');
  document.getElementById('appointmentTime').value = '';
}

function sendMessage() {
  const teacher = document.getElementById('msgTeacher').value;
  const text = document.getElementById('msgText').value;
  const student = document.getElementById('msgStudent')?.value || 'Anonymous';
  if (!teacher || !text) return alert("Message and Teacher required");

  messages.push({ teacher, student, text });
  saveAll();
  alert('Message sent');
  document.getElementById('msgText').value = '';
}

// ================= Teacher Functions =================
function loginTeacher() {
  const name = document.getElementById('teacherLoginName').value.trim();
  if (!name) return alert("Please enter name.");
  currentTeacher = name;
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('teacherNameLabel').textContent = name;
  renderTeacherDashboard();
}

function logout() {
  currentTeacher = '';
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginSection').style.display = 'block';
}

function addSchedule() {
  const time = document.getElementById('scheduleTime').value.trim();
  if (!time) return alert("Enter a time slot.");
  appointments.push({ teacher: currentTeacher, time, status: 'Available' });
  saveAll();
  document.getElementById('scheduleTime').value = '';
  renderTeacherDashboard();
}

function approveAppointment(index) {
  appointments[index].status = 'Approved';
  saveAll();
  renderTeacherDashboard();
}

function cancelAppointment(index) {
  appointments[index].status = 'Cancelled';
  saveAll();
  renderTeacherDashboard();
}

// ================ Rendering Functions ================
function renderTeachers() {
  const ul = document.getElementById('teacherList');
  if (!ul) return;
  ul.innerHTML = teachers.map((t, i) =>
    `<li>
      ${t.name} (${t.dept} - ${t.subject})
      <button onclick="updateTeacher(${i})">Edit</button>
      <button onclick="deleteTeacher(${i})">Delete</button>
    </li>`
  ).join('');
}

function renderStudents() {
  const ul = document.getElementById('studentRequests');
  if (!ul) return;
  ul.innerHTML = students.map((s, i) =>
    !s.approved ? `<li>${s.name} <button onclick="approveStudent(${i})">Approve</button></li>` : ''
  ).join('');
}

function renderTeacherSearch() {
  const ul = document.getElementById('teacherSearchResults');
  if (!ul) return;
  ul.innerHTML = teachers.map(t => `<li>${t.name} - ${t.subject}</li>`).join('');
}

function renderAppointments() {
  const ul = document.getElementById('appointmentsList');
  if (!ul) return;
  ul.innerHTML = appointments.map(a =>
    `<li>${a.teacher} - ${a.time} (${a.status}) [Student: ${a.student}]</li>`
  ).join('');
}

function renderMessages() {
  const ul = document.getElementById('messagesList');
  if (!ul) return;
  ul.innerHTML = messages.map(m =>
    `<li>${m.teacher} ⇄ ${m.student}: ${m.text}</li>`
  ).join('');
}

// =============== Teacher Dashboard Rendering ============
function renderTeacherDashboard() {
  const pendingList = document.getElementById('pendingAppointmentsList');
  const allList = document.getElementById('allAppointmentsList');
  const availList = document.getElementById('availabilityList');
  const msgList = document.getElementById('teacherMessagesList');

  if (!pendingList || !allList || !availList || !msgList) return;

  pendingList.innerHTML = '';
  allList.innerHTML = '';
  availList.innerHTML = '';
  msgList.innerHTML = '';

  appointments.forEach((a, i) => {
    if (a.teacher === currentTeacher) {
      allList.innerHTML += `<li>${a.time} - ${a.status} (Student: ${a.student || 'N/A'})</li>`;
      if (a.status === 'Pending') {
        pendingList.innerHTML += `<li>${a.time} (Student: ${a.student || 'N/A'})
          <button onclick="approveAppointment(${i})">Approve</button>
          <button onclick="cancelAppointment(${i})">Cancel</button>
        </li>`;
      }
      if (a.status === 'Available') {
        availList.innerHTML += `<li>${a.time}</li>`;
      }
    }
  });

  messages.forEach(m => {
    if (m.teacher === currentTeacher) {
      msgList.innerHTML += `<li><strong>${m.student || 'Student'}:</strong> ${m.text}</li>`;
    }
  });
}

// ================ Init on Load ===================
window.onload = () => {
  renderTeachers();
  renderStudents();
  renderTeacherSearch();
  renderAppointments();
  renderMessages();
};
