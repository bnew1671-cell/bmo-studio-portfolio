import { getLanguage, translate } from "./i18n.js";
import { makeElement, safeExternalUrl, whatsappUrl } from "./utils.js";

function setStatus(status, message, isError = false) {
  status.textContent = message;
  status.classList.toggle("is-error", isError);
}

export function initContact(settings) {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const links = document.querySelector("#contact-links");
  const socials = document.querySelector("#social-links");
  const address = settings.address || "";
  const encodedAddress = encodeURIComponent(address);
  const directions = document.querySelector("#directions-link");

  document.querySelector("#address-text").textContent = address;
  document.querySelector("#map-address").textContent = address;
  document.querySelector("#working-hours").textContent = settings.workingHours?.[getLanguage()] || "";
  directions.href = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  document.querySelector("#location-map").src = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  if (settings.whatsappNumber) {
    const link = makeElement("a", "", getLanguage() === "sw" ? "WhatsApp" : "WhatsApp");
    link.dataset.whatsappContact = "true";
    link.href = whatsappUrl(settings.whatsappNumber, getLanguage() === "sw" ? "Habari, ningependa kuulizia huduma zako." : "Hello, I’d like to ask about your services.");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    links.append(link);
  }
  if (settings.phone) {
    const phone = makeElement("a", "", settings.phone);
    phone.href = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;
    links.append(phone);
  }
  if (settings.email) {
    const email = makeElement("a", "", settings.email);
    email.href = `mailto:${settings.email}`;
    links.append(email);
  }
  Object.entries(settings.socials || {}).forEach(([name, value]) => {
    const href = safeExternalUrl(value);
    if (!href) return;
    const link = makeElement("a", "", name[0].toUpperCase() + name.slice(1));
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    socials.append(link);
  });
  if (!links.children.length) links.hidden = true;
  if (!socials.children.length) socials.hidden = true;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-contact-service]");
    if (!link || settings.whatsappNumber) return;
    event.preventDefault();
    const service = document.querySelector("#contact-service");
    const packageOption = [...service.options].find((option) => option.value.startsWith(`${link.dataset.contactService}:`));
    service.value = packageOption?.value || "";
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    service.focus({ preventScroll: true });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.elements.website.value) return;
    if (!form.reportValidity()) {
      setStatus(status, translate("contact.errorRequired"), true);
      return;
    }
    const details = Object.fromEntries(new FormData(form).entries());
    if (String(details.message).trim().length < 10) {
      setStatus(status, translate("contact.errorMessage"), true);
      return;
    }

    if (settings.formspreeEndpoint) {
      if (!/^https:\/\/formspree\.io\/f\/[\w-]+$/.test(settings.formspreeEndpoint)) {
        setStatus(status, translate("contact.notConfigured"), true);
        return;
      }
      const submit = form.querySelector("[type=submit]");
      submit.disabled = true;
      setStatus(status, translate("contact.sending"));
      try {
        const response = await fetch(settings.formspreeEndpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Form submission failed");
        form.reset();
        setStatus(status, translate("contact.successForm"));
      } catch {
        setStatus(status, translate("contact.notConfigured"), true);
      } finally {
        submit.disabled = false;
      }
      return;
    }

    if (settings.whatsappNumber) {
      const serviceLabel = document.querySelector("#contact-service").selectedOptions[0]?.textContent || "";
      const message = getLanguage() === "sw"
        ? `Habari, mimi ni ${details.name}.\nBarua pepe: ${details.email}\nSimu: ${details.phone || "-"}\nHuduma: ${serviceLabel}\nBajeti: ${details.budget || "-"}\nMaelezo: ${details.message}`
        : `Hello, my name is ${details.name}.\nEmail: ${details.email}\nPhone: ${details.phone || "-"}\nService: ${serviceLabel}\nBudget: ${details.budget || "-"}\nProject details: ${details.message}`;
      setStatus(status, translate("contact.fallbackReady"));
      window.open(whatsappUrl(settings.whatsappNumber, message), "_blank", "noopener,noreferrer");
      return;
    }

    setStatus(status, translate("contact.notConfigured"), true);
  });
}