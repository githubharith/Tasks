// --- DOM NODES ---
const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const usernameInput = document.getElementById("username");
const userDisplay = document.getElementById("userDisplay");

const sidebarItems = document.querySelectorAll(".sidebar-menu .nav-item");
const tabPanes = document.querySelectorAll(".tab-pane");

// --- 1. AUTHENTICATION CONTROLLER ---
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = usernameInput.value.trim();
  if (!user) return;

  // Persist session in localStorage
  localStorage.setItem("session_user", user);

  // Transition UI
  mountApp(user);
});

logoutBtn.addEventListener("click", () => {
  // Clear persistent session
  localStorage.removeItem("session_user");

  // Revert UI to Login
  usernameInput.value = "";
  dashboardView.style.display = "none";
  loginView.style.display = "flex";
});

function mountApp(username) {
  userDisplay.textContent = username;
  loginView.style.display = "none";
  dashboardView.style.display = "flex";
}

// --- 2. SIDEBAR TAB-SWITCHER LOGIC ---
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetTab = item.dataset.tab;

    // 1. Remove active state from all sidebar items and panes
    sidebarItems.forEach((btn) => btn.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    // 2. Set active state on clicked item
    item.classList.add("active");

    // 3. Reveal targeted content container
    const selectedPane = document.getElementById(`tab-${targetTab}`);
    if (selectedPane) {
      selectedPane.classList.add("active");
    }
  });
});

// --- 3. SESSION INITIALIZATION ---
window.addEventListener("DOMContentLoaded", () => {
  const activeUser = localStorage.getItem("session_user");
  if (activeUser) {
    mountApp(activeUser);
  }
});