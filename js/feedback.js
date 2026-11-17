import { makeElement, safeExternalUrl } from "./utils.js";
import { getLanguage, translate } from "./i18n.js";

export function initFeedback(testimonials) {
  const list = document.querySelector("#feedback-list");
  const empty = document.querySelector("#feedback-empty");
  function localizedText(item, field) {
    const localizedField = `${field}${getLanguage() === "sw" ? "Sw" : ""}`;
    return item[localizedField] || item[field] || "";
  }

  function render() {
    list.replaceChildren();
    empty.hidden = testimonials.length > 0;
    testimonials.forEach((item) => {
      const card = makeElement("article", "testimonial-card");
      if (item.image) {
        const image = makeElement("img");
        image.src = item.image;
        image.alt = localizedText(item, "imageAlt");
        image.loading = "lazy";
        card.append(image);
      }
      if (Number.isInteger(item.rating) && item.rating > 0 && item.rating <= 5) {
        const rating = makeElement("p", "testimonial-rating", `${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}`);
        rating.setAttribute("aria-label", `${item.rating} out of 5`);
        card.append(rating);
      }
      const description = localizedText(item, "description");
      if (description) card.append(makeElement("p", "testimonial-description", description));
      card.append(makeElement("blockquote", "", localizedText(item, "feedback")));
      const attribution = [localizedText(item, "clientName"), localizedText(item, "projectType")].filter(Boolean).join(" · ");
      if (attribution) card.append(makeElement("p", "", attribution));
      const url = safeExternalUrl(item.url);
      if (url) {
        const link = makeElement("a", "text-link", item.linkLabel || `${translate("feedback.viewProject")} ↗`);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        card.append(link);
      }
      list.append(card);
    });
  }

  render();
  return render;
}