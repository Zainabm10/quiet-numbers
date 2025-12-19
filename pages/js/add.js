// فحص إذا الفورم موجود بالصفحة)
const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", function (event) {
    // نمنع الإرسال ال אוטמטי للفورم
    event.preventDefault();

    // نجيب القيم اللي دخلها المستخدم
    const amount = form.amount.value;
    const category = form.category.value;
    const description = form.description.value;

    // فحص المبلغ 
    if (amount === "" || amount <= 0) {
      alert("لازم تدخلي مبلغ صحيح");
      return;
    }

    // فحص ال categoty
    if (category === "") {
      alert("اختاري تصنيف للحركة");
      return;
    }

    // فحص الوصف
    if (description.trim().length < 2) {
      alert("اكتبي وصف قصير على الأقل");
      return;
    }

    // إذا كلشي تمام
    alert("تم حفظ الحركة بنجاح ✅");
    form.reset();
  });
}

// تبديل الثيم  
const THEME_KEY = "quietNumbersTheme";

function applyTheme(themeValue) {
  const isDark = themeValue === "dark";
  document.body.classList.toggle("theme-dark", isDark);
}

// عند فتح الصفحة: نطبّق آخر ثيم المستخدم اختاره
applyTheme(localStorage.getItem(THEME_KEY));

// زر تغيير الثيم
const toggleBtn = document.getElementById("toggleTheme");
if (toggleBtn) {
  toggleBtn.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("theme-dark");

    // حفظ الاختيار بال browser
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

    // نغيّر الثيم בהתאם بالصفحة الثانية
    applyTheme(isDark ? "dark" : "light");
  });
}

// تزامن الثيم بين الصفحات المفتوحة 
window.addEventListener("storage", function (event) {
  if (event.key === THEME_KEY) {
    applyTheme(event.newValue);
  }
});
