import { initAnimations } from "./animations.js";
import { initContact } from "./contact.js";
import { initFeedback } from "./feedback.js";
import { getLanguage, initI18n, translate } from "./i18n.js";
import { initNavigation } from "./navigation.js";
import { initPortfolio } from "./portfolio.js";
import { initPricing } from "./pricing.js";
import { makeElement, whatsappUrl } from "./utils.js";

const services = [
  { id: "graphic", icon: "✳", title: "services.graphic.title", body: "services.graphic.body", category: "print" },
  { id: "brand", icon: "◈", title: "services.brand.title", body: "services.brand.body", category: "identity" },
  { id: "web", icon: "▦", title: "services.web.title", body: "services.web.body", category: "web" },
  { id: "logo", icon: "◎", title: "services.logo.title", body: "services.logo.body", category: "logo" },
  { id: "print", icon: "▤", title: "services.print.title", body: "services.print.body", category: "business-card" },
  { id: "social", icon: "⊞", title: "services.social.title", body: "services.social.body", category: "social" }
];

function renderServices(settings) {
  const list = document.querySelector("#service-list");
  list.replaceChildren();
  services.forEach((service, index) => {
    const card = makeElement("article", "service-card");
    const top = makeElement("div", "service-number");
    top.append(makeElement("span", "", `0${index + 1}`), makeElement("span", "service-icon", service.icon));
    card.append(top, makeElement("h3", "", translate(service.title)), makeElement("p", "", translate(service.body)));
    const links = makeElement("div", "service-links");
    const price = makeElement("a", "", `${translate("services.viewPrice")} ↗`);
    price.href = `#pricing`;
    price.addEventListener("click", () => {
      const tab = document.querySelector(`#pricing-tab-${service.category}`);
      tab?.click();
    });
    const message = getLanguage() === "sw"
      ? `Habari, ningependa kuulizia ${translate(service.title)}.`
      : `Hello, I’d like to ask about ${translate(service.title)}.`;
    const contact = makeElement("a", "", `${translate("services.contact")} ↗`);
    contact.href = whatsappUrl(settings.whatsappNumber, message) || "#contact";
    contact.dataset.contactService = service.category;
    if (contact.href.startsWith("https://")) {
      contact.target = "_blank";
      contact.rel = "noopener noreferrer";
    }
    links.append(price, contact);
    card.append(links);
    list.append(card);
  });
}

function renderWhatsAppActions(settings) {
  const message = getLanguage() === "sw"
    ? "Habari, ningependa kuzungumzia mradi mpya."
    : "Hello, I’d like to discuss a new project.";
  const url = whatsappUrl(settings.whatsappNumber, message);
  document.querySelectorAll("[data-whatsapp-cta], [data-whatsapp-contact]").forEach((link) => {
    link.href = url || "#contact";
    if (url) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }
  });
}

async function loadData(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function start() {
  const [settings, pricing, projects, testimonials, translations] = await Promise.all([
    loadData("data/settings.json"),
    loadData("data/pricing.json"),
    loadData("data/projects.json"),
    loadData("data/testimonials.json"),
    loadData("data/translations.json")
  ]);
  initNavigation();
  let refreshPricing = () => {};
  let refreshPortfolio = () => {};
  const rerenderLanguage = () => {
    renderServices(settings);
    renderWhatsAppActions(settings);
    document.querySelector("#working-hours").textContent = settings.workingHours?.[getLanguage()] || "";
    document.querySelector("#payment-note").textContent = settings.paymentNote?.[getLanguage()] || "";
    refreshPricing();
    refreshPortfolio();
  };
  initI18n(translations, document.querySelector("#language-select"), rerenderLanguage);
  refreshPricing = initPricing(pricing, settings);
  refreshPortfolio = initPortfolio(projects, pricing);
  initFeedback(testimonials);
  initContact(settings);
  renderServices(settings);
  renderWhatsAppActions(settings);
  document.querySelector("#payment-note").textContent = settings.paymentNote?.[getLanguage()] || "";
  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest(".dialog-close");
    if (closeButton) closeButton.closest("dialog")?.close();
  });
  document.querySelector("#copyright-year").textContent = new Date().getFullYear();
  initAnimations();
}

start().catch((error) => {
  console.error(error);
  const status = document.querySelector("#form-status");
  status.textContent = "The portfolio content could not be loaded. Run this site from a local web server.";
  status.classList.add("is-error");
});