

document.addEventListener("DOMContentLoaded", () => {

  let mode = document.getElementById("theme-toggle");

  mode.addEventListener('click', () => {
    document.body.classList.toggle("dark-mode");
  });
});