const app = document.getElementById("app");
const toast = document.getElementById("toast");

const state = {
  screen: localStorage.getItem("emc_screen") || "splash",
  user: JSON.parse(localStorage.getItem("emc_user") || "null"),
  booking: JSON.parse(localStorage.getItem("emc_booking") || "null"),
  selectedClinic: null,
  selectedDepartment: null,
  selectedDate: null,
  selectedTime: null,
  accessibility: JSON.parse(localStorage.getItem("emc_accessibility") || '{"largeText":false,"contrast":false}')
};

const clinics = [
  { id: 1, name: "Kabuga PHC", location: "Kabuga, Kano", distance: "1.2 km", queue: "Low queue", queueClass: "badge-low", doctors: "2 providers available" },
  { id: 2, name: "Dala PHC", location: "Dala, Kano", distance: "2.1 km", queue: "Medium queue", queueClass: "badge-medium", doctors: "1 provider available" },
  { id: 3, name: "Nassarawa PHC", location: "Nassarawa, Kano", distance: "3.4 km", queue: "Low queue", queueClass: "badge-low", doctors: "3 providers available" },
  { id: 4, name: "Chawalla PHC", location: "Chawalla, Kano", distance: "4.0 km", queue: "Low queue", queueClass: "badge-low", doctors: "2 providers available" }
];

const departments = [
  "General Outpatient",
  "Ante-natal Clinic",
  "Child Welfare",
  "Immunization",
  "Physiotherapy",
  "Family Planning"
];

const dates = ["Mon, 22 Jun", "Tue, 23 Jun", "Wed, 24 Jun", "Thu, 25 Jun", "Fri, 26 Jun", "Sat, 27 Jun"];
const times = ["08:00 AM", "09:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];

function saveState() {
  localStorage.setItem("emc_screen", state.screen);
  localStorage.setItem("emc_user", JSON.stringify(state.user));
  localStorage.setItem("emc_booking", JSON.stringify(state.booking));
  localStorage.setItem("emc_accessibility", JSON.stringify(state.accessibility));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

function navigate(screen) {
  state.screen = screen;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function topbar(title, back = null) {
  return `
    <header class="topbar">
      <button class="icon-btn" aria-label="${back ? "Go back" : "Menu"}" onclick="${back ? `navigate('${back}')` : "showToast('Menu options are available on the Profile screen.')"}">${back ? "←" : "☰"}</button>
      <h1>${escapeHtml(title)}</h1>
      <button class="icon-btn" aria-label="Notifications" onclick="showToast('No new notifications.')">♧</button>
    </header>
  `;
}

function bottomNav(active) {
  return `
    <nav class="bottom-nav" aria-label="Primary navigation">
      <button class="${active==="home"?"active":""}" onclick="navigate('home')" aria-label="Home">⌂<br>Home</button>
      <button class="${active==="book"?"active":""}" onclick="navigate('clinic')" aria-label="Book appointment">＋<br>Book</button>
      <button class="${active==="appointments"?"active":""}" onclick="navigate('appointments')" aria-label="Appointments">▣<br>Appointments</button>
      <button class="${active==="profile"?"active":""}" onclick="navigate('profile')" aria-label="Profile">●<br>Profile</button>
    </nav>
  `;
}

function render() {
  document.body.classList.toggle("large-text", state.accessibility.largeText);
  document.body.classList.toggle("high-contrast", state.accessibility.contrast);

  const screens = {
    splash: renderSplash,
    onboarding: renderOnboarding,
    login: renderLogin,
    register: renderRegister,
    home: renderHome,
    clinic: renderClinic,
    department: renderDepartment,
    datetime: renderDateTime,
    confirm: renderConfirm,
    success: renderSuccess,
    appointments: renderAppointments,
    clinicCard: renderClinicCard,
    profile: renderProfile,
    accessibility: renderAccessibility,
    queue: renderQueue
  };
  (screens[state.screen] || renderSplash)();
}

function renderSplash() {
  app.innerHTML = `
    <main class="center-page">
      <div class="center-content">
        <div class="brand-mark" aria-hidden="true">+</div>
        <div class="logo-text">EasyMediCare</div>
        <p class="tagline">Quality care. Less waiting.</p>
        <p class="muted">A simple way to find a nearby primary healthcare facility and book an appointment.</p>
        <button class="btn btn-green" onclick="navigate('onboarding')">Get Started</button>
      </div>
    </main>
  `;
}

function renderOnboarding() {
  app.innerHTML = `
    <main class="center-page">
      <div class="center-content">
        <div class="brand-mark" aria-hidden="true">+</div>
        <h1>Book appointments easily</h1>
        <p class="page-subtitle">Reduce waiting time and manage your next primary healthcare visit.</p>
        <div class="card" style="text-align:left">
          <strong>What you can do</strong>
          <ul>
            <li>Find nearby clinics</li>
            <li>See queue information</li>
            <li>Choose a department and time</li>
            <li>Keep your appointment details in one place</li>
          </ul>
        </div>
        <button class="btn btn-primary" onclick="navigate('login')">Sign In</button>
        <button class="btn btn-secondary" onclick="navigate('register')">Create Account</button>
        <button class="text-button" onclick="navigate('home')">Explore demo without signing in</button>
      </div>
    </main>
  `;
}

function renderLogin() {
  app.innerHTML = `
    <main class="screen">
      ${topbar("Welcome Back", "onboarding")}
      <div class="container auth-card">
        <p class="page-subtitle">Sign in to continue.</p>
        <form onsubmit="event.preventDefault(); loginDemo();">
          <div class="form-group">
            <label for="login-phone">Phone number</label>
            <input id="login-phone" type="tel" placeholder="08012345678" autocomplete="tel" required>
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input id="login-password" type="password" placeholder="Enter password" autocomplete="current-password" required>
          </div>
          <button class="text-button" type="button" onclick="showToast('Demo: password recovery would be connected to a backend.')">Forgot password?</button>
          <button class="btn btn-primary" type="submit">Sign In</button>
        </form>
        <p class="muted" style="text-align:center">Don't have an account?</p>
        <button class="text-button" style="display:block;margin:auto" onclick="navigate('register')">Register</button>
      </div>
    </main>
  `;
}

function loginDemo() {
  state.user = { name: "Aisha", phone: "08012345678" };
  navigate("home");
  showToast("Signed in to the demo.");
}

function renderRegister() {
  app.innerHTML = `
    <main class="screen">
      ${topbar("Create Account", "onboarding")}
      <div class="container auth-card">
        <p class="page-subtitle">Enter your details to get started.</p>
        <form onsubmit="event.preventDefault(); registerDemo();">
          <div class="form-group">
            <label for="reg-name">Full name</label>
            <input id="reg-name" type="text" placeholder="Full name" required>
          </div>
          <div class="form-group">
            <label for="reg-phone">Phone number</label>
            <input id="reg-phone" type="tel" placeholder="08012345678" required>
          </div>
          <div class="form-group">
            <label for="reg-password">Password</label>
            <input id="reg-password" type="password" placeholder="Create password" required minlength="6">
          </div>
          <div class="form-group">
            <label for="reg-confirm">Confirm password</label>
            <input id="reg-confirm" type="password" placeholder="Repeat password" required minlength="6">
          </div>
          <button class="btn btn-primary" type="submit">Create Account</button>
        </form>
        <p class="muted" style="text-align:center">Already have an account?</p>
        <button class="text-button" style="display:block;margin:auto" onclick="navigate('login')">Sign in</button>
      </div>
    </main>
  `;
}

function registerDemo() {
  const name = document.getElementById("reg-name").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;
  if (password !== confirm) {
    showToast("Passwords do not match.");
    return;
  }
  state.user = { name: name || "Aisha", phone };
  navigate("home");
  showToast("Account created in the demo.");
}

function renderHome() {
  const name = state.user?.name || "Aisha";
  const booking = state.booking;
  app.innerHTML = `
    <main class="screen">
      ${topbar("EasyMediCare")}
      <div class="container desktop-content">
        <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:1rem">
          <div>
            <p class="muted" style="margin:0">Good morning,</p>
            <h2 style="margin:.15rem 0">${escapeHtml(name)}</h2>
            <p class="muted" style="margin:0">Ready for your next appointment?</p>
          </div>
          <div class="brand-mark" style="width:56px;height:56px;font-size:1.5rem;margin:0" aria-hidden="true">+</div>
        </div>

        ${booking ? `
          <section class="card appointment-card" aria-labelledby="next-title">
            <h2 id="next-title">Next Appointment</h2>
            <div class="summary-row"><span>Date & time</span><strong>${escapeHtml(booking.date)} • ${escapeHtml(booking.time)}</strong></div>
            <div class="summary-row"><span>Clinic</span><strong>${escapeHtml(booking.clinic)}</strong></div>
            <div class="summary-row"><span>Department</span><strong>${escapeHtml(booking.department)}</strong></div>
            <div class="summary-row"><span>Queue</span><strong>No. ${escapeHtml(booking.queue)}</strong></div>
            <button class="btn btn-primary" onclick="navigate('appointments')">View details</button>
          </section>
        ` : `
          <section class="card">
            <h2>No upcoming appointment</h2>
            <p class="muted">Book a visit before you go to the clinic.</p>
            <button class="btn btn-primary" onclick="navigate('clinic')">Book Appointment</button>
          </section>
        `}

        <section aria-labelledby="quick-title">
          <h2 id="quick-title">Quick Actions</h2>
          <div class="quick-actions">
            <button onclick="navigate('clinic')">📅<br>Book<br>Appointment</button>
            <button onclick="navigate('appointments')">🗓️<br>My<br>Appointments</button>
            <button onclick="navigate('clinicCard')">🪪<br>Clinic<br>Card</button>
            <button onclick="navigate('profile')">⚙️<br>Profile</button>
          </div>
        </section>

        <div class="notice" style="margin-top:1rem">
          <strong>Demo notice:</strong> This prototype uses sample clinic and queue data. It does not create real medical appointments.
        </div>
      </div>
      ${bottomNav("home")}
    </main>
  `;
}

function renderClinic() {
  app.innerHTML = `
    <main class="screen">
      ${topbar("Book Appointment", "home")}
      <div class="container desktop-content">
        <div class="progress" aria-label="Step 1 of 3"><span class="active"></span><span></span><span></span></div>
        <h2 class="page-title">Select Health Facility</h2>
        <p class="page-subtitle">Choose a nearby clinic based on distance and queue status.</p>

        <div class="clinic-list">
          ${clinics.map(c => `
            <button class="clinic-card" onclick="selectClinic(${c.id})" aria-label="Select ${escapeHtml(c.name)}">
              <div class="clinic-thumb" aria-hidden="true">🏥</div>
              <div>
                <h3>${escapeHtml(c.name)}</h3>
                <p>${escapeHtml(c.location)} • ${escapeHtml(c.distance)}</p>
                <span class="badge ${c.queueClass}">${escapeHtml(c.queue)}</span>
                <p>${escapeHtml(c.doctors)}</p>
              </div>
              <span aria-hidden="true">›</span>
            </button>
          `).join("")}
        </div>
      </div>
      ${bottomNav("book")}
    </main>
  `;
}

function selectClinic(id) {
  state.selectedClinic = clinics.find(c => c.id === id);
  navigate("department");
}

function renderDepartment() {
  app.innerHTML = `
    <main class="screen">
      ${topbar("Book Appointment", "clinic")}
      <div class="container desktop-content">
        <div class="progress" aria-label="Step 2 of 3"><span class="active"></span><span class="active"></span><span></span></div>
        <h2 class="page-title">Select Department</h2>
        <p class="page-subtitle">Choose the service you need at ${escapeHtml(state.selectedClinic?.name || "the clinic")}.</p>
        <div class="option-list">
          ${departments.map((d,i) => `
            <div class="option">
              <input type="radio" id="dept-${i}" name="department" value="${escapeHtml(d)}">
              <label for="dept-${i}">${escapeHtml(d)}</label>
            </div>
          `).join("")}
        </div>
        <button class="btn btn-primary" style="margin-top:1rem" onclick="chooseDepartment()">Next</button>
      </div>
    </main>
  `;
}

function chooseDepartment() {
  const chosen = document.querySelector('input[name="department"]:checked');
  if (!chosen) {
    showToast("Please select a department.");
    return;
  }
  state.selectedDepartment = chosen.value;
  navigate("datetime");
}

function renderDateTime() {
  app.innerHTML = `
    <main class="screen">
      ${topbar("Book Appointment", "department")}
      <div class="container desktop-content">
        <div class="progress" aria-label="Step 3 of 3"><span class="active"></span><span class="active"></span><span class="active"></span></div>
        <h2 class="page-title">Choose Date & Time</h2>
        <p class="page-subtitle">Select a convenient appointment slot.</p>

        <div class="card">
          <h3>Available dates</h3>
          <div class="date-grid">
            ${dates.map(d => `<button class="choice" onclick="pickDate(this, '${d}')">${d}</button>`).join("")}
          </div>
        </div>

        <div class="card">
          <h3>Available times</h3>
          <div class="time-grid">
            ${times.map(t => `<button class="choice" onclick="pickTime(this, '${t}')">${t}</button>`).join("")}
          </div>
        </div>

        <button class="btn btn-primary" onclick="goConfirm()">Next</button>
      </div>
    </main>
  `;
}

function pickDate(button, value) {
  document.querySelectorAll(".date-grid .choice").forEach(b => b.classList.remove("selected"));
  button.classList.add("selected");
  state.selectedDate = value;
}

function pickTime(button, value) {
  document.querySelectorAll(".time-grid .choice").forEach(b => b.classList.remove("selected"));
  button.classList.add("selected");
  state.selectedTime = value;
}

function goConfirm() {
  if (!state.selectedDate || !state.selectedTime) {
    showToast("Please select both a date and time.");
    return;
  }
  navigate("confirm");
}

function renderConfirm() {
  const c = state.selectedClinic;
  app.innerHTML = `
    <main class="screen">
      ${topbar("Confirm Appointment", "datetime")}
      <div class="container desktop-content">
        <div class="card">
          <h2>Review your booking</h2>
          <div class="summary-row"><span>Clinic</span><strong>${escapeHtml(c?.name || "")}</strong></div>
          <div class="summary-row"><span>Department</span><strong>${escapeHtml(state.selectedDepartment || "")}</strong></div>
          <div class="summary-row"><span>Date</span><strong>${escapeHtml(state.selectedDate || "")}</strong></div>
          <div class="summary-row"><span>Time</span><strong>${escapeHtml(state.selectedTime || "")}</strong></div>
          <div class="summary-row"><span>Patient</span><strong>${escapeHtml(state.user?.name || "Aisha")}</strong></div>
        </div>
        <div class="notice">
          <strong>Before you confirm:</strong> This is a prototype. Your booking is simulated and will not contact a real clinic.
        </div>
        <button class="btn btn-primary" onclick="confirmBooking()">Confirm Booking</button>
        <button class="btn btn-secondary" onclick="navigate('datetime')">Back</button>
      </div>
    </main>
  `;
}

function confirmBooking() {
  state.booking = {
    clinic: state.selectedClinic.name,
    distance: state.selectedClinic.distance,
    department: state.selectedDepartment,
    date: state.selectedDate,
    time: state.selectedTime,
    queue: "023",
    serving: "018",
    ahead: 5,
    wait: "~25 minutes"
  };
  navigate("success");
}

function renderSuccess() {
  const b = state.booking;
  app.innerHTML = `
    <main class="screen">
      ${topbar("Appointment Confirmed")}
      <div class="container desktop-content">
        <div class="success-box">
          <div class="success-icon" aria-hidden="true">✓</div>
          <h2>Appointment Confirmed!</h2>
          <p>${escapeHtml(b.date)} • ${escapeHtml(b.time)}</p>
          <p><strong>${escapeHtml(b.clinic)}</strong><br>${escapeHtml(b.department)}</p>
          <div class="queue-box">
            <div>Queue Number</div>
            <div class="queue-number">${escapeHtml(b.queue)}</div>
            <div class="muted">5 people currently ahead of you</div>
          </div>
          <p class="muted">You will receive a reminder before your appointment.</p>
        </div>
        <button class="btn btn-primary" onclick="navigate('appointments')" style="margin-top:1rem">View My Appointment</button>
        <button class="btn btn-secondary" onclick="navigate('home')">Back Home</button>
      </div>
      ${bottomNav("appointments")}
    </main>
  `;
}

function renderAppointments() {
  const b = state.booking;
  app.innerHTML = `
    <main class="screen">
      ${topbar("My Appointments", "home")}
      <div class="container desktop-content">
        <div class="card" style="padding:.35rem;display:flex;gap:.35rem">
          <button class="btn btn-primary" style="min-height:42px" onclick="showToast('Showing upcoming appointments.')">Upcoming</button>
          <button class="btn btn-light" style="min-height:42px" onclick="showToast('No past appointments in this demo.')">Past</button>
        </div>
        ${b ? `
          <article class="card appointment-card">
            <h2>${escapeHtml(b.date)} • ${escapeHtml(b.time)}</h2>
            <p><strong>${escapeHtml(b.clinic)}</strong></p>
            <p>${escapeHtml(b.department)}</p>
            <p>Queue No: <strong>${escapeHtml(b.queue)}</strong></p>
            <button class="btn btn-secondary" onclick="navigate('queue')">View queue status</button>
            <button class="btn btn-danger" onclick="cancelBooking()">Reschedule / Cancel</button>
          </article>
        ` : `
          <div class="empty-state">
            <h2>No appointments yet</h2>
            <p>Book your first appointment to see it here.</p>
            <button class="btn btn-primary" onclick="navigate('clinic')">Book Appointment</button>
          </div>
        `}
      </div>
      ${bottomNav("appointments")}
    </main>
  `;
}

function cancelBooking() {
  if (confirm("Cancel this demo appointment?")) {
    state.booking = null;
    saveState();
    navigate("appointments");
    showToast("Appointment cancelled.");
  }
}

function renderClinicCard() {
  const name = state.user?.name || "Aisha Client";
  app.innerHTML = `
    <main class="screen">
      ${topbar("Clinic Card", "home")}
      <div class="container desktop-content">
        <div class="card" style="background:#fff5f4;border-color:#ee9b94">
          <div style="display:flex;gap:1rem;align-items:center">
            <div class="brand-mark" style="margin:0;width:64px;height:64px" aria-hidden="true">●</div>
            <div>
              <h2 style="margin:0">${escapeHtml(name)}</h2>
              <p style="margin:.2rem 0">Patient ID: 01234</p>
              <p style="margin:.2rem 0">Blood Group: O+</p>
              <p style="margin:.2rem 0">DOB: 21/09/2000</p>
            </div>
          </div>
          <hr>
          <p><strong>Demo barcode</strong></p>
          <div style="font-size:2rem;letter-spacing:.2rem;overflow:hidden">|||| ||| |||| || |||||</div>
        </div>
        <p style="text-align:center;font-weight:700">Show this card at the clinic</p>
        <div class="notice">For the capstone prototype only. Do not use this screen as a real medical identity card.</div>
      </div>
      ${bottomNav("")}
    </main>
  `;
}

function renderProfile() {
  const name = state.user?.name || "Aisha";
  app.innerHTML = `
    <main class="screen">
      ${topbar("Profile", "home")}
      <div class="container desktop-content">
        <div class="card" style="display:flex;align-items:center;gap:1rem">
          <div class="brand-mark" style="margin:0;width:64px;height:64px">●</div>
          <div>
            <h2 style="margin:0">${escapeHtml(name)}</h2>
            <p class="muted" style="margin:.2rem 0">${escapeHtml(state.user?.phone || "08012345678")}</p>
          </div>
        </div>
        <div class="card">
          <button class="btn btn-light" onclick="navigate('accessibility')">Accessibility & Display</button>
          <button class="btn btn-light" onclick="showToast('Notifications are enabled for this demo.')">Notifications</button>
          <button class="btn btn-light" onclick="showToast('Privacy settings would be connected to a backend.')">Privacy</button>
        </div>
        <div class="card">
          <h3>About this prototype</h3>
          <p class="muted">EasyMediCare is an MVP concept for improving access to primary healthcare through appointment and queue information.</p>
        </div>
      </div>
      ${bottomNav("profile")}
    </main>
  `;
}

function renderAccessibility() {
  app.innerHTML = `
    <main class="screen">
      ${topbar("Accessibility & Display", "profile")}
      <div class="container desktop-content">
        <div class="card">
          <div class="settings-row">
            <div>
              <strong>Larger text</strong>
              <div class="muted">Increase the default text size.</div>
            </div>
            <button class="switch ${state.accessibility.largeText ? "on":""}" onclick="toggleAccessibility('largeText')" aria-label="Toggle larger text"><span></span></button>
          </div>
          <div class="settings-row">
            <div>
              <strong>High contrast</strong>
              <div class="muted">Increase contrast for easier reading.</div>
            </div>
            <button class="switch ${state.accessibility.contrast ? "on":""}" onclick="toggleAccessibility('contrast')" aria-label="Toggle high contrast"><span></span></button>
          </div>
        </div>
        <div class="card">
          <h3>Accessibility notes</h3>
          <ul>
            <li>Keyboard focus states are visible.</li>
            <li>Form controls have labels.</li>
            <li>Color is not the only way information is communicated.</li>
            <li>The layout adapts to smaller and larger screens.</li>
            <li>Reduced-motion preferences are respected.</li>
          </ul>
        </div>
      </div>
    </main>
  `;
}

function toggleAccessibility(key) {
  state.accessibility[key] = !state.accessibility[key];
  saveState();
  render();
  showToast(`${key === "largeText" ? "Larger text" : "High contrast"} ${state.accessibility[key] ? "enabled" : "disabled"}.`);
}

/* Queue screen is kept separate so the appointment flow can demonstrate the
   original problem: reducing uncertainty around waiting time. */
function renderQueue() {
  const b = state.booking;
  app.innerHTML = `
    <main class="screen">
      ${topbar("Queue Status", "appointments")}
      <div class="container desktop-content">
        <div class="card">
          <h2>${escapeHtml(b?.clinic || "Kabuga PHC")}</h2>
          <p class="muted">${escapeHtml(b?.department || "Immunization")}</p>
          <div class="queue-box">
            <div>Your queue number</div>
            <div class="queue-number">${escapeHtml(b?.queue || "023")}</div>
          </div>
          <div class="status-row"><span>Currently serving</span><strong>${escapeHtml(b?.serving || "018")}</strong></div>
          <div class="status-row"><span>People ahead</span><strong>${escapeHtml(String(b?.ahead || 5))}</strong></div>
          <div class="status-row"><span>Estimated wait</span><strong>${escapeHtml(b?.wait || "~25 minutes")}</strong></div>
        </div>
        <div class="notice"><strong>Tip:</strong> You can arrive closer to your appointment time instead of waiting at the clinic unnecessarily.</div>
      </div>
    </main>
  `;
}

render();
