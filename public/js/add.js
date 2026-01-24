import { initTheme } from "../common.js";
initTheme();

const form = document.getElementById("form");
const msg = document.getElementById("msg");

const descriptionEl = document.getElementById("description");
const categoryEl = document.getElementById("category");
const typeEl = document.getElementById("type");
const amountEl = document.getElementById("amount");

function showMessage(text, isError = false) {
  msg.style.display = "block";
  msg.textContent = text;
  msg.classList.toggle("error", isError);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const category = categoryEl.value;
  const type = typeEl.value;
  const amount = Number(amountEl.value);

  if (!description) return showMessage("title is required", true);
  if (!category) return showMessage("category is required", true);
  if (!amount || amount <= 0) return showMessage("amount must be > 0", true);

  const payload = {
    title: description,
    category,
    type,
    amount,
  };

  try {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return showMessage(data.error || `Error ${res.status}`, true);
    }

    showMessage("Saved ✅");
    setTimeout(() => (window.location.href = "index.html"), 400);
  } catch (err) {
    console.error(err);
    showMessage("Server not reachable. Is the server running?", true);
  }
});
