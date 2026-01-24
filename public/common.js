const THEME_KEY = "qn_theme";

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
}

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function initTheme() {
  applyTheme(getSavedTheme());

  const toggleBtn = document.getElementById("toggleTheme");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = getSavedTheme();
      const next = current === "dark" ? "light" : "dark";
      saveTheme(next);
      applyTheme(next);
    });
  }
}
