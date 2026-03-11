const profileBtn = document.getElementById("goToProfile");

if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    // Отримуємо ID (наприклад, 1), який ми раніше зашили в кнопку
    const id = profileBtn.getAttribute("data-userid");

    // Перенаправляємо браузер на новий URL
    // Це згенерирує запит GET /user/1
    window.location.href = `/user/${id}`;
  });
}
