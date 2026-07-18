const themeButton = document.getElementById("theme-toggle");
themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "☀️ Light Mode";
  } else {
    themeButton.textContent = "🌙 Dark Mode";
  }
});
