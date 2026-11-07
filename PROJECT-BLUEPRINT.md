# Project blueprint

## Product and audience

A public personal portfolio for a UI/UX designer and front-end developer. Its audience includes recruiters, hiring teams, collaborators and prospective clients.

## Assumptions and open questions

- The site is informational and public; it does not need visitor accounts or private data.
- Contact is handled through a mail link; there is no server-side contact form.
- Existing copy, image assets, visual identity and page structure are the approved direction and should be preserved.
- Cloudflare account access is needed to make host-level redirect and security-header changes.

## Roles and journeys

- Visitor: arrive at the homepage, review work and case studies, learn about the designer, download the résumé or contact them.
- Maintainer: edit static source/assets, review changes, publish through GitHub Pages and verify the deployed site.

## Pages and important states

- `/`: portfolio introduction and selected work.
- `/projects`: project index.
- `/about`: profile and contact.
- `/noire.html`, `/velix.html`: case studies.
- Unknown path: branded 404 page.
- Shared interactions: theme toggle, navigation, case-study tabs/gallery/lightbox and restrained scroll reveals; reduced-motion preferences should be respected.

## Features included / excluded

- Included: responsive portfolio pages, downloadable résumé, external project/profile links, SEO/social metadata and sitemap.
- Excluded by design: login, database, API, CMS, visitor tracking, payment, admin area and contact-form backend. There is no product need for these services.

## Data, integrations and privacy

No visitor data is submitted to a site backend. A mail link opens the visitor's configured email client. The site loads its own static assets; there are no runtime third-party JavaScript dependencies. Hosting and DNS are provided by GitHub Pages and Cloudflare.

## Security considerations

- Keep this static deployment free of credentials and private data.
- Preserve the restrictive page CSP and validate its inline script hash if the inline script changes.
- Enforce HTTPS redirects and response security headers at the edge/host.
- A static site has no server-side input, authentication, API or database surface to validate.
- Cloudflare currently serves a managed `robots.txt`; do not add a competing file without checking the resulting live policy.

## Design and Figma

No Figma edit is in scope for this maintenance audit. Preserve the existing layout, typography, colours, spacing, imagery and motion. Use the live site and source as the existing design reference; only change visual code if an identified accessibility/usability defect requires it.

## Architecture

Plain HTML pages, shared CSS files and vanilla JavaScript, deployed as static files. No build system, package manager, backend, environment variables or runtime dependencies are required.

## Verification and release

Parse the sitemap, check route and asset links (including trailing-slash paths), review semantic/accessibility and responsive behavior, inspect source for secrets and dependency manifests, then verify live routes/assets and the GitHub Pages deployment. Host-level Cloudflare changes require account access and separate verification.
