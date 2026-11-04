import { translate } from "./i18n.js";

export function initNavigation() {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const themeButton = document.querySelector(".theme-toggle");

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", translate(isOpen ? "nav.menu" : "nav.closeMenu"));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  });

  let theme = "light";
  try {
    theme = localStorage.getItem("bmo-theme") || "light";
  } catch {
    theme = "light";
  }
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
  themeButton.addEventListener("click", () => {
    theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bmo-theme", theme);
    } catch {
      // Theme changes remain available when storage is unavailable.
    }
  });
}