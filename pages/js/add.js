// ============================
// Quiet Numbers - JavaScript
// ============================

// مفتاح تخزين الثيم
const THEME_KEY = "quietNumbersTheme";

// مفتاح تخزين العمليات
const TX_KEY = "quietNumbersTransactions";

// ---------- ثيم (ليل/نهار) ----------
function applyTheme(themeValue) {
  const dark = themeValue === "dark";
  document.body.classList.toggle("theme-dark", dark);
}

// طبق الثيم المحفوظ أول ما الصفحة تفتح
applyTheme(localStorage.getItem(THEME_KEY) || "light");

// زر تغيير الثيم (موجود بالصفحتين)
const toggleBtn = document.getElementById("toggleTheme");
if (toggleBtn) {
  toggleBtn.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("theme-dark");
    const newTheme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  });
}

// مزامنة فورية بين التابات/النوافذ
window.addEventListener("storage", function (event) {
  if (event.key === THEME_KEY) {
    applyTheme(event.newValue);
  }
});

// ---------- بيانات العمليات ----------
function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(TX_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveTransactions(list) {
  localStorage.setItem(TX_KEY, JSON.stringify(list));
}

function formatMoney(n) {
  return Number(n).toFixed(2);
}

// ---------- صفحة Add Transaction ----------
const form = document.getElementById("txForm");
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const type = form.type.value;
    const amount = Number(form.amount.value);
    const category = form.category.value;
    const description = form.description.value.trim();

    // ولديشنز
    if (!type) {
      alert("اختاري نوع الحركة (Income/Expense)");
      return;
    }

    if (!form.amount.value || isNaN(amount) || amount <= 0) {
      alert("اكتبي مبلغ صحيح أكبر من 0");
      return;
    }

    if (!category) {
      alert("اختاري Category");
      return;
    }

    if (description.length < 2) {
      alert("اكتبي وصف قصير (على الأقل حرفين)");
      return;
    }

    // حفظ
    const txs = loadTransactions();
    txs.unshift({
      type,
      category,
      description,
      amount: Number(amount.toFixed(2)),
      createdAt: Date.now()
    });
    saveTransactions(txs);

    // رسالة حفظ (بدل alert)
    const msg = document.getElementById("saveMessage");
    if (msg) {
      msg.style.display = "block";
      msg.textContent = "✅ تم حفظ الحركة بنجاح! ارجعي للـ Home لمشاهدة التحديث.";
    }

    form.reset();
  });
}

// ---------- صفحة Home ----------
function renderHome() {
  const bodyEl = document.getElementById("txTableBody");
  const balanceEl = document.getElementById("balanceValue");
  const incomeEl = document.getElementById("incomeValue");
  const expenseEl = document.getElementById("expenseValue");

  // إذا مش بصفحة Home، اطلعي
  if (!bodyEl || !balanceEl || !incomeEl || !expenseEl) return;

  const txs = loadTransactions();

  let income = 0;
  let expense = 0;

  for (const t of txs) {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  }

  const balance = income - expense;

  incomeEl.textContent = formatMoney(income);
  expenseEl.textContent = formatMoney(expense);
  balanceEl.textContent = formatMoney(balance);

  // جدول
  bodyEl.innerHTML = "";
  if (txs.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">No transactions yet</td>`;
    bodyEl.appendChild(row);
    return;
  }

  for (const t of txs.slice(0, 10)) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>${t.description}</td>
      <td class="right">${formatMoney(t.amount)}</td>
    `;
    bodyEl.appendChild(row);
  }
}

renderHome();

// زر Clear All
const clearBtn = document.getElementById("clearAll");
if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    const ok = confirm("متأكدة بدك تمسحي كل العمليات؟");
    if (!ok) return;
    saveTransactions([]);
    renderHome();
  });
}
