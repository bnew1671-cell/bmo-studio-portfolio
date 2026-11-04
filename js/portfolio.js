import { getLanguage, translate } from "./i18n.js";
import { makeElement, safeExternalUrl } from "./utils.js";

export function initPortfolio(projects, pricing) {
  const grid = document.querySelector("#project-list");
  const empty = document.querySelector("#work-empty");
  const controls = document.querySelector("#work-controls");
  const filters = document.querySelector("#project-filters");
  const search = document.querySelector("#project-search");
  const dialog = document.querySelector("#project-dialog");
  const dialogBody = document.querySelector("#dialog-body");
  let category = "all";
  let query = "";
  let activeProject = 0;
  const portfolioCategories = ["graphic", "logo", "brand", "web", "print", "social", "business-card"];

  function projectText(project, field) {
    const localizedField = `${field}${getLanguage() === "sw" ? "Sw" : ""}`;
    return project[localizedField] || project[field] || "";
  }

  function visibleProjects() {
    return projects.filter((project) => {
      const matchesCategory = category === "all" || project.category === category;
      const text = `${project.title || ""} ${project.titleSw || ""} ${project.description || ""} ${project.descriptionSw || ""} ${project.category || ""}`.toLocaleLowerCase(getLanguage());
      return matchesCategory && text.includes(query.toLocaleLowerCase(getLanguage()));
    });
  }

  function renderModal(index) {
    const list = visibleProjects();
    if (!list.length) return;
    activeProject = (index + list.length) % list.length;
    const project = list[activeProject];
    dialogBody.replaceChildren();
    if (project.image) {
      const image = makeElement("img");
      image.src = project.image;
      image.alt = projectText(project, "alt") || projectText(project, "title");
      dialogBody.append(image);
    }
    const categoryText = translate(`work.category.${project.category}`);
    dialogBody.append(makeElement("p", "project-meta", categoryText.startsWith("work.category.") ? project.categoryLabel || project.category || "" : categoryText));
    const title = makeElement("h2", "", projectText(project, "title"));
    title.id = "dialog-title";
    dialogBody.append(title);
    dialogBody.append(makeElement("p", "", projectText(project, "description")));
    (project.gallery || []).forEach((item) => {
      const imagePath = typeof item === "string" ? item : item.image;
      if (!imagePath) return;
      const image = makeElement("img");
      image.src = imagePath;
      image.alt = typeof item === "string" ? project.title || "" : item.alt || project.title || "";
      image.loading = "lazy";
      image.addEventListener("click", () => {
        const lightbox = document.querySelector("#lightbox-dialog");
        const preview = document.querySelector("#lightbox-image");
        preview.src = image.src;
        preview.alt = image.alt;
        lightbox.showModal();
      });
      dialogBody.append(image);
    });
    if (Array.isArray(project.tools) && project.tools.length) {
      dialogBody.append(makeElement("p", "", `${translate("work.tools")}: ${project.tools.join(", ")}`));
    }
    if (safeExternalUrl(project.url)) {
      const link = makeElement("a", "text-link", translate("work.viewWebsite"));
      link.href = safeExternalUrl(project.url);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      dialogBody.append(link);
    }
    const nav = makeElement("div", "dialog-nav");
    const previous = makeElement("button", "text-link", `← ${translate("work.previous")}`);
    previous.type = "button";
    previous.addEventListener("click", () => renderModal(activeProject - 1));
    const next = makeElement("button", "text-link", `${translate("work.next")} →`);
    next.type = "button";
    next.addEventListener("click", () => renderModal(activeProject + 1));
    nav.append(previous, next);
    dialogBody.append(nav);
  }

  function render() {
    const list = visibleProjects();
    grid.replaceChildren();
    empty.hidden = projects.length > 0;
    controls.hidden = projects.length === 0;
    if (!projects.length) return;
    list.forEach((project, index) => {
      const card = makeElement("article", "project-card");
      const open = makeElement("button", "project-image-button");
      open.type = "button";
      open.setAttribute("aria-label", `${translate("work.viewProject")}: ${projectText(project, "title")}`);
      if (project.image) {
        const image = makeElement("img");
        image.src = project.image;
        image.alt = projectText(project, "alt") || projectText(project, "title");
        if (project.imageFit === "contain") image.classList.add("project-image-contain");
        image.loading = "lazy";
        open.append(image);
      }
      if (project.featured) open.append(makeElement("span", "project-featured", translate("work.featured")));
      open.addEventListener("click", () => {
        const originalIndex = list.indexOf(project);
        renderModal(originalIndex);
        dialog.showModal();
      });
      card.append(open);
      const copy = makeElement("div", "project-copy");
      const meta = makeElement("div", "project-meta");
      const categoryText = translate(`work.category.${project.category}`);
      meta.append(makeElement("span", "", categoryText.startsWith("work.category.") ? project.categoryLabel || project.category || "" : categoryText));
      if (project.date) meta.append(makeElement("span", "", project.date));
      copy.append(meta, makeElement("h3", "", projectText(project, "title")), makeElement("p", "", projectText(project, "description")));
      const link = makeElement("button", "text-link", `${translate("work.viewProject")} ↗`);
      link.type = "button";
      link.addEventListener("click", () => {
        renderModal(index);
        dialog.showModal();
      });
      copy.append(link);
      card.append(copy);
      grid.append(card);
    });
    empty.hidden = list.length > 0;
    if (!list.length) {
      empty.querySelector("h3").textContent = translate("work.noResultsTitle");
      empty.querySelector("p").textContent = translate("work.noResultsBody");
    } else {
      empty.querySelector("h3").textContent = translate("work.emptyTitle");
      empty.querySelector("p").textContent = translate("work.emptyBody");
    }
  }

  function renderFilters() {
    filters.replaceChildren();
    const categories = [{ id: "all", key: "work.filterAll" }, ...portfolioCategories.map((id) => ({ id, key: `work.category.${id}` }))];
    categories.forEach((item) => {
      const button = makeElement("button", "", translate(item.key));
      button.type = "button";
      button.setAttribute("aria-pressed", String(category === item.id));
      button.addEventListener("click", () => {
        category = item.id;
        render();
      });
      filters.append(button);
    });
  }
  search.addEventListener("input", () => { query = search.value; render(); });
  const renderProjects = render;
  render = () => {
    if (projects.length) renderFilters();
    renderProjects();
  };
  render();
  return render;
}