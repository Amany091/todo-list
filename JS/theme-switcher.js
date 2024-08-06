
  
const themes = document.querySelectorAll(".theme-item");
const html = document.querySelector("html");

window.addEventListener("DOMContentLoaded", () => {
    let theme = localStorage.getItem("theme");
    if (theme) {
      html.setAttribute("data-theme", theme);
    }
});

themes.forEach((theme) => {
  theme.addEventListener("click", () => {
    let themeName = theme.getAttribute("theme");
      html.setAttribute("data-theme", themeName);
    localStorage.setItem("theme", themeName);
  });
});

