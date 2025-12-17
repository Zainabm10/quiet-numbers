// ===== Form validation (only if form exists) =====
const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = form.amount.value;
    const category = form.category.value;
    const description = form.description.value;

    if (amount === "" || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (category === "") {
      alert("Please choose a category");
      return;
    }

    if (description.trim().length < 2) {
      alert("Please enter a short description");
      return;
    }

    alert("Transaction saved successfully!");
    form.reset();
  });
}

// ===== Theme toggle (instant across tabs/pages) =====
const THEME_KEY = "quietNumbersTheme";

function applyTheme(themeValue) {
  const warm = themeValue === "warm";
  document.body.classList.toggle("theme-warm", warm);
}

// Apply saved theme on page load
applyTheme(localStorage.getItem(THEME_KEY));

// Toggle theme on button click
const toggleBtn = document.getElementById("toggleTheme");
if (toggleBtn) {
  toggleBtn.addEventListener("click", function () {
    const isWarm = !document.body.classList.contains("theme-warm");
    localStorage.setItem(THEME_KEY, isWarm ? "warm" : "light");
    applyTheme(isWarm ? "warm" : "light"); // update current page immediately
  });
}

// Listen for theme changes from OTHER tabs/windows and apply instantly
window.addEventListener("storage", function (event) {
  if (event.key === THEME_KEY) {
    applyTheme(event.newValue);
  }
});
