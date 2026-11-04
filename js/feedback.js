import { makeElement, safeExternalUrl } from "./utils.js";
import { translate } from "./i18n.js";

export function initFeedback(testimonials) {
  const list = document.querySelector("#feedback-list");
  const empty = document.querySelector("#feedback-empty");
  empty.hidden = testimonials.length > 0;
  testimonials.forEach((item) => {
    const card = makeElement("article", "testimonial-card");
    if (item.image) {
      const image = makeElement("img");
      image.src = item.image;
      image.alt = item.imageAlt || "";
      image.loading = "lazy";
      card.append(image);
    }
    if (Number.isInteger(item.rating) && item.rating > 0 && item.rating <= 5) {
      const rating = makeElement("p", "testimonial-rating", `${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}`);
      rating.setAttribute("aria-label", `${item.rating} out of 5`);
      card.append(rating);
    }
    if (item.description) card.append(makeElement("p", "testimonial-description", item.description));
    card.append(makeElement("blockquote", "", item.feedback || ""));
    card.append(makeElement("p", "", [item.clientName, item.projectType].filter(Boolean).join(" · ")));
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