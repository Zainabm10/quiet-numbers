export function initTheme() {
  const btn = document.getElementById("toggleTheme");
  const key = "qn-theme";

  // load saved theme
  const saved = localStorage.getItem(key);
  if (saved === "dark") document.body.classList.add("dark");

  // if button not on this page, just stop
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem(key, isDark ? "dark" : "light");
  });
}
