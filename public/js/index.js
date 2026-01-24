import { initTheme } from "../common.js";
initTheme();

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const tbody = document.getElementById("tbody");
const msg = document.getElementById("msg");

function showMessage(text, isError = false) {
  if (!msg) return;
  msg.style.display = "block";
  msg.textContent = text;
  msg.classList.toggle("error", isError);
}

function money(n) {
  const num = Number(n) || 0;
  return `₪${num.toFixed(2)}`;
}

function formatDate(d) {
  if (!d) return "";
  // لو كان ISO
  const dt = new Date(d);
  if (!isNaN(dt.getTime())) return dt.toLocaleDateString();
  // لو كان YYYY-MM-DD
  return String(d);
}

async function load() {
  tbody.innerHTML = "";
  showMessage("", false);
  if (msg) msg.style.display = "none";

  const res = await fetch("/api/transactions");
  if (!res.ok) {
    const t = await res.text();
    showMessage(t || "Failed to load", true);
    return;
  }

  const data = await res.json();
  const txs = data.transactions || [];

  let income = 0;
  let expense = 0;

  for (const tx of txs) {
    const type = (tx.type || "").toLowerCase();
    const amt = Number(tx.amount) || 0;

    if (type === "income") income += amt;
    else expense += amt;

    const tr = document.createElement("tr");

    // Category
    const tdCat = document.createElement("td");
    tdCat.textContent = tx.category || "Other";
    tr.appendChild(tdCat);

    // Type
    const tdType = document.createElement("td");
    tdType.textContent = type;
    tr.appendChild(tdType);

    // Date
    const tdDate = document.createElement("td");
    tdDate.textContent = formatDate(tx.date);
    tr.appendChild(tdDate);

    // Amount
    const tdAmount = document.createElement("td");
    tdAmount.className = "right";
    tdAmount.textContent = money(amt);
    tr.appendChild(tdAmount);

    // Actions
    const tdActions = document.createElement("td");
    tdActions.className = "right";

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.type = "button";

    btn.addEventListener("click", async () => {
      if (!confirm("Delete this transaction?")) return;

      const delRes = await fetch(`/api/transactions/${tx.id}`, {
        method: "DELETE",
      });

      if (!delRes.ok) {
        const text = await delRes.text();
        showMessage(text || "Delete failed", true);
        return;
      }

      await load();
    });

    tdActions.appendChild(btn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  }

  incomeEl.textContent = money(income);
  expenseEl.textContent = money(expense);
  balanceEl.textContent = money(income - expense);
}

load().catch((e) => {
  console.error(e);
  showMessage("Error loading data", true);
});
