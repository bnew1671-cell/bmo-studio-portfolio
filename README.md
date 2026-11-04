# BMO Creative Portfolio

A public, static portfolio for Baraka Muhsini Omary / BMO All service. It uses HTML, CSS, vanilla JavaScript, and editable JSON data. There is no login, backend, database, or admin area. The site is designed for GitHub Pages.

## Run locally

The page fetches JSON data, so open it through a local web server rather than opening `index.html` directly.

1. Open this folder in VS Code.
2. Start a static server from the project root. For example, with Python installed, run `python3 -m http.server 8000` in the terminal.
3. Visit `http://localhost:8000` in your browser.
4. Stop the server with `Ctrl+C` when finished.

No package installation or build step is required.

## Edit the site

Make changes in the files below, then preview them locally before publishing:

- `data/settings.json`: WhatsApp number, email, phone, Formspree endpoint, location, hours, payment note, and social links. WhatsApp accepts an international number with country code and no punctuation, such as `2557XXXXXXXX`; a 10-digit Tanzanian local number beginning with `0` is also converted automatically. Add only contact details you want shown publicly.
- `data/pricing.json`: package prices, included items, and optional extras. Prices are integer TZS amounts; use `null` for quote-only services. Labels refer to keys in `data/translations.json`.
- `data/projects.json`: projects shown in the portfolio. Start from the example below and use paths relative to the project root.
- `data/testimonials.json`: genuine client feedback only, shared with permission. The file is intentionally empty until you add real feedback.
- `data/translations.json`: all interface copy in English and Swahili. Keep keys in both language objects when adding or changing text.

The listed prices are editable starting placeholders, not a confirmed quote. Confirm your actual rates before publishing. The `_sampleNotice` field in `pricing.json` flags these defaults.

`projects.json` includes the SokoLink and ClimTrek Hub websites and the screenshots supplied for them. The testimonials file remains empty until genuine client feedback is available and approved for publication.

### Add a project

Add an object to `data/projects.json`, then place its real images in `assets/images/projects/`:

```json
{
  "title": "Project title",
  "titleSw": "Jina la mradi kwa Kiswahili",
  "category": "brand",
  "categoryLabel": "Brand identity",
  "description": "A short, accurate description of the work.",
  "descriptionSw": "Maelezo mafupi na sahihi ya kazi kwa Kiswahili.",
  "date": "2026",
  "image": "assets/images/projects/project-cover.webp",
  "alt": "Accurate description of the image",
  "altSw": "Maelezo sahihi ya picha kwa Kiswahili",
  "imageFit": "contain",
  "gallery": ["assets/images/projects/project-detail.webp"],
  "tools": ["Illustrator", "Photoshop"],
  "featured": false,
  "url": ""
}
```

Use one of these category IDs: `graphic`, `logo`, `brand`, `web`, `print`, `social`, or `business-card`. Swahili fields are optional; add `imageFit: "contain"` for screenshots that should stay fully visible. Image files should be compressed WebP where practical, and alt text should describe the actual image. Do not list client work unless you have permission to publish it.

### Add a testimonial

Add an object to `data/testimonials.json` with genuine, approved content:

```json
{
  "clientName": "Client or business name",
  "projectType": "Project type",
  "description": "A short summary of the work.",
  "feedback": "The client's exact approved words.",
  "rating": 5,
  "image": "assets/images/clients/client-project.webp",
  "imageAlt": "Description of the completed work",
  "url": "https://example.com/project"
}
```

The rating and image are optional. Never create or paraphrase a review as if a client said it.

### Add logo and business-card samples

Put real, approved examples in `assets/images/logos/` and `assets/images/business-cards/`. In the matching category in `data/pricing.json`, add objects to its `gallery` array, for example `{ "image": "assets/images/logos/brand-name.webp", "alt": "Approved logo design for Brand Name" }`. The sample areas are empty until real examples are added; no stock work is shown as yours.

### Change languages

The language selector switches immediately between English and Swahili. The selection is remembered in the visitor's browser. For every new interface key, add both translations in `data/translations.json` and reference the key from the HTML or data file.

## Configure contact

1. Set `whatsappNumber` in `data/settings.json` to your real international number without `+` or punctuation. WhatsApp links and form fallback messages then become active.
2. Add your public contact email and phone if you want them shown.
3. To use Formspree, create a form and put its public endpoint, such as `https://formspree.io/f/your-form-id`, in `formspreeEndpoint`. The form includes a honeypot and browser validation. Do not put secret keys in this repository.
4. If Formspree is not configured, valid enquiries open a prefilled WhatsApp message when a WhatsApp number is present. If neither is configured, the page displays a setup notice rather than pretending the message was sent.
5. The map and directions use the editable address text. They do not use invented coordinates or claim a verified map pin.

## Publish on GitHub Pages

1. Create a public GitHub repository and push the contents of this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
3. The workflow in `.github/workflows/pages.yml` deploys the site. Open the **Actions** tab and wait for the deployment to finish.
4. Open the URL shown in the Pages deployment, usually `https://username.github.io/repository-name/`.
5. To update the site, edit the JSON files and add or replace files in `assets/images/`, then commit and push to `main`. The site redeploys automatically.
6. To use a custom domain later, add it under **Settings → Pages → Custom domain**, configure the DNS records with your domain provider, and enable HTTPS after GitHub verifies the domain.

All site asset and data references are relative, so the project works in a repository subpath. If you publish `sitemap.xml`, replace its example `username` and `repo-name` URL with your actual GitHub Pages address.

## Project structure

```text
index.html
404.html
data/             Editable prices, settings, translations, projects, and feedback
css/style.css     Responsive visual system and motion preferences
js/               Navigation, translations, pricing, portfolio, feedback, and contact logic
assets/icons/     Favicon and social sharing image
assets/images/    Add approved profile, project, logo, card, and client images here
sitemap.xml
robots.txt
```