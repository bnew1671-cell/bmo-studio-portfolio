let dictionary = {};
let currentLanguage = "en";
let onLanguageChange = () => {};

export function translate(key) {
  return dictionary[key] || key;
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = translate(node.dataset.i18n);
    if (node.children.length) {
      const textNode = [...node.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.nodeValue = `${value} `;
      else node.prepend(document.createTextNode(`${value} `));
    } else {
      node.textContent = value;
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", translate(node.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    const value = translate(node.dataset.i18nAriaLabel);
    node.setAttribute("aria-label", value);
    if (node.hasAttribute("title")) node.setAttribute("title", value);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    node.setAttribute("alt", translate(node.dataset.i18nAlt));
  });
  onLanguageChange(currentLanguage);
}

export function initI18n(translations, select, callback) {
  dictionary = translations.en || {};
  onLanguageChange = callback || (() => {});
  try {
    const saved = localStorage.getItem("bmo-language");
    currentLanguage = translations[saved] ? saved : "en";
  } catch {
    currentLanguage = "en";
  }
  select.value = currentLanguage;
  select.addEventListener("change", () => {
    currentLanguage = translations[select.value] ? select.value : "en";
    dictionary = translations[currentLanguage];
    try {
      localStorage.setItem("bmo-language", currentLanguage);
    } catch {
      // The selected language still works when storage is unavailable.
    }
    applyTranslations();
  });
  dictionary = translations[currentLanguage] || translations.en || {};
  applyTranslations();
}

export function getLanguage() {
  return currentLanguage;
}