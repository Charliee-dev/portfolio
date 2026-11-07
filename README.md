# Chiranjeev Deka — Portfolio

Static portfolio website built with semantic HTML, CSS and vanilla JavaScript. It is hosted on GitHub Pages behind Cloudflare and uses the custom domain `chiranjeevdeka.com`.

## Local preview

The site has no build step, package manager or runtime dependency. From the project root, start any static file server and open its local URL. For example, with Python installed:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`. Clean `/about` and `/projects` routes depend on the production host's routing behavior; on a basic local static server, use `/about/` and `/projects/`.

## Project structure

- `index.html`, `about/index.html`, `projects/index.html`: primary pages.
- `noire.html`, `velix.html`: case studies.
- `css/`: site stylesheets.
- `js/minimal.js`: shared interactions.
- `assets/`: favicon, resume and project imagery.
- `sitemap.xml`: canonical public routes.
- `CNAME`: GitHub Pages custom domain.

## Checks

No build, lint, test, or dependency audit command is configured because this project has no package manifest or installed application dependencies. Before release, validate local links and page assets, parse `sitemap.xml`, inspect changed pages at mobile and desktop widths, and verify the published URLs and hosting headers.

## Deployment

The repository is published with GitHub Pages on the `main` branch and Cloudflare proxies the custom domain. Publish tracked source changes through the repository's configured GitHub workflow/account. Confirm the deployment completes, then check `/`, `/about`, `/projects`, both case studies, `/404.html`, `/sitemap.xml`, `/robots.txt`, and the favicon/resume asset URLs over HTTPS.

Cloudflare-managed production settings are documented in `HOSTING-SECURITY.md`. Do not place credentials or secrets in this static repository.
