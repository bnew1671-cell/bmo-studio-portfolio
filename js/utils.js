export function makeElement(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function formatPrice(amount, language = "en") {
  const locale = language === "sw" ? "sw-TZ" : "en-TZ";
  return `TZS ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)}`;
}

export function whatsappUrl(number, message) {
  let digits = String(number || "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) digits = `255${digits.slice(1)}`;
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}