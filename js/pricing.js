import { getLanguage, translate } from "./i18n.js";
import { formatPrice, makeElement, whatsappUrl } from "./utils.js";

export function initPricing(pricing, settings) {
  const tabs = document.querySelector("#pricing-tabs");
  const content = document.querySelector("#pricing-content");
  const serviceSelect = document.querySelector("#contact-service");
  let selectedCategory = pricing.categories[0]?.id;

  function updateServiceOptions() {
    const selectedService = serviceSelect.value;
    serviceSelect.replaceChildren();
    const placeholder = makeElement("option", "", translate("contact.servicePlaceholder"));
    placeholder.value = "";
    serviceSelect.append(placeholder);
    pricing.categories.forEach((category) => {
      category.packages.forEach((item) => {
        const label = `${translate(category.title)} · ${translate(item.name)}`;
        const option = makeElement("option", "", label);
        option.value = `${category.id}:${item.id}`;
        serviceSelect.append(option);
      });
    });
    serviceSelect.value = selectedService;
  }

  function renderGallery(category) {
    if (!Array.isArray(category.gallery) || category.gallery.length === 0) return null;
    const gallery = makeElement("div", "sample-gallery");
    category.gallery.forEach((item) => {
      const button = makeElement("button", "sample-image");
      button.type = "button";
      button.setAttribute("aria-label", item.alt || translate("pricing.galleryEmpty"));
      const image = makeElement("img");
      image.src = item.image;
      image.alt = item.alt || "";
      image.loading = "lazy";
      image.addEventListener("click", () => {
        const dialog = document.querySelector("#lightbox-dialog");
        const lightboxImage = document.querySelector("#lightbox-image");
        lightboxImage.src = item.image;
        lightboxImage.alt = image.alt;
        dialog.showModal();
      });
      button.append(image);
      gallery.append(button);
    });
    return gallery;
  }

  function renderCategory() {
    const category = pricing.categories.find((item) => item.id === selectedCategory);
    if (!category) return;
    updateServiceOptions();
    tabs.replaceChildren();
    pricing.categories.forEach((item) => {
      const tab = makeElement("button", "", translate(item.title));
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(item.id === selectedCategory));
      tab.setAttribute("aria-controls", "pricing-content");
      tab.id = `pricing-tab-${item.id}`;
      tab.addEventListener("click", () => {
        selectedCategory = item.id;
        renderCategory();
      });
      tabs.append(tab);
    });

    content.replaceChildren();
    const heading = makeElement("div", "pricing-category-heading");
    heading.setAttribute("role", "tabpanel");
    heading.setAttribute("aria-labelledby", `pricing-tab-${category.id}`);
    heading.append(makeElement("h3", "", translate(category.title)));
    heading.append(makeElement("p", "", translate(category.description)));
    content.append(heading);

    const cards = makeElement("div", "package-grid");
    category.packages.forEach((item) => {
      const card = makeElement("article", "package-card");
      card.append(makeElement("h4", "", translate(item.name)));
      card.append(makeElement("p", "package-subtitle", translate(item.subtitle)));
      let priceText = item.quote || item.price === null
        ? translate("pricing.quoteLabel")
        : formatPrice(item.price, getLanguage());
      if (item.from && item.price !== null) priceText = `${translate("pricing.currencyFrom")} ${priceText}`;
      card.append(makeElement("p", "package-price", priceText));
      const includes = makeElement("ul");
      item.includes.forEach((key) => includes.append(makeElement("li", "", translate(key))));
      card.append(includes);

      const packageMessage = getLanguage() === "sw"
        ? `Habari, ningependa kuulizia ${translate(item.name)}${item.price ? ` (${formatPrice(item.price, getLanguage())})` : ""}.`
        : `Hello, I’d like to ask about ${translate(item.name)}${item.price ? ` (${formatPrice(item.price, getLanguage())})` : ""}.`;
      const action = makeElement("a", "button");
      action.textContent = translate(item.quote || item.price === null ? "pricing.quote" : "pricing.order");
      action.href = whatsappUrl(settings.whatsappNumber, packageMessage) || "#contact";
      action.dataset.contactService = category.id;
      if (action.href.startsWith("https://")) {
        action.target = "_blank";
        action.rel = "noopener noreferrer";
      }
      card.append(action);
      cards.append(card);
    });
    content.append(cards);

    if (category.extras?.length) {
      const extras = makeElement("div", "pricing-extras");
      const extraTitle = makeElement("h4", "", translate("pricing.extrasTitle"));
      extras.append(extraTitle);
      const list = makeElement("ul");
      category.extras.forEach((extra) => {
        const row = makeElement("li");
        row.append(makeElement("span", "", translate(extra.name)));
        const detail = extra.price === null
          ? translate(extra.note)
          : `${formatPrice(extra.price, getLanguage())}${extra.suffix ? ` ${translate(extra.suffix)}` : ""}`;
        row.append(makeElement("strong", "", detail));
        list.append(row);
      });
      extras.append(list);
      content.append(extras);
    }

    if (category.note) content.append(makeElement("p", "pricing-note", translate(category.note)));
    const gallery = renderGallery(category);
    if (gallery) content.append(gallery);
    if (["logo", "business-card"].includes(category.id) && !category.gallery?.length) {
      content.append(makeElement("p", "gallery-empty", translate("pricing.galleryEmpty")));
    }
  }

  renderCategory();
  return renderCategory;
}