import { initTheme } from "../common.js";

initTheme();

const tbody = document.getElementById("tbody");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const msg = document.getElementById("msg");

function formatMoney(n) {
  return `₪${Number(n).toFixed(2)}`;
}

function showMessage(text) {
  if (!msg) return;
  msg.style.display = "block";
  msg.textContent = text;
  setTimeout(() => (msg.style.display = "none"), 2200);
}

function fmtDate(isoOrDate) {
  try {
    const d = new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return String(isoOrDate);
    return d.toLocaleDateString();
  } catch {
    return String(isoOrDate);
  }
}

async function fetchTransactions() {
  const res = await fetch("/api/transactions");
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Failed to load");
  return json.data;
}

async function deleteTransaction(id) {
  const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Failed to delete");
}

function render(transactions) {
  let income = 0;
  let expense = 0;

  tbody.innerHTML = "";

  if (!transactions.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="text-align:center; opacity:0.75;">No transactions yet.</td>`;
    tbody.appendChild(tr);
  } else {
    for (const t of transactions) {
      const amount = Number(t.amount);
      if (t.type === "income") income += amount;
      else expense += amount;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.category}</td>
        <td>${t.type}</td>
        <td>${fmtDate(t.date)}</td>
        <td class="right">${formatMoney(amount)}</td>
        <td class="right">
          <button class="danger-btn" data-id="${t.id}" type="button">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  }

  const balance = income - expense;
  incomeEl.textContent = formatMoney(income);
  expenseEl.textContent = formatMoney(expense);
  balanceEl.textContent = formatMoney(balance);

  document.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        await deleteTransaction(id);
        const next = await fetchTransactions();
        render(next);
      } catch (e) {
        showMessage(e.message);
      }
    });
  });
}

(async () => {
  try {
    const transactions = await fetchTransactions();
    render(transactions);
  } catch (e) {
    showMessage(e.message);
  }
})();
