# Portfolio technical audit

**Scope:** static source and live public site, checked 2026-11-07. Visual redesign was explicitly out of scope. Findings below distinguish repository fixes from host-side work.

## Architecture and exposure

- Static HTML, CSS and vanilla JavaScript on GitHub Pages behind Cloudflare; no backend, API, account system, database, forms or runtime package dependencies were found.
- No credentials were found in the reviewed source. The restrictive page CSP is present; the homepage inline-script SHA-256 hash was verified against the current inline script.
- Authentication, API authorization, input sanitization, database, server logging and dependency vulnerability scans are not applicable to the current architecture. This changes if a form, analytics, external scripts or backend is added.

## Findings and actions

| Area | Finding | Action/status |
| --- | --- | --- |
| Routing/assets | Résumé links on clean nested routes were relative and resolved to missing `/about/assets/...` and `/projects/assets/...` URLs. | Changed résumé references to root-relative URLs across pages. |
| Sitemap | Sitemap URL-set namespace used HTTPS instead of the canonical sitemap namespace. | Corrected to `http://www.sitemaps.org/schemas/sitemap/0.9`. |
| HTTPS | Live HTTP homepage returned 200 rather than redirecting. | Requires Cloudflare redirect setting; instructions in `HOSTING-SECURITY.md`. |
| Response headers | Live HTTPS responses lacked HSTS, nosniff, frame policy and Permissions Policy. A wildcard `Access-Control-Allow-Origin` was present although no API exists. | Requires Cloudflare response-header rules; instructions documented. |
| Robots | Cloudflare serves a managed `robots.txt`; no sitemap directive was observed in its current response. | Do not shadow it blindly. Configure managed policy to include sitemap URL if supported. |
| SEO | Pages include titles, descriptions, canonicals and social metadata; sitemap lists the primary routes. | Sitemap namespace fixed. Submit/inspect sitemap in Search Console as an operational follow-up. |
| Accessibility | Pages use language, viewport, landmarks, named navigation and descriptive images; theme control is a button and lightbox/tabs use keyboard interaction. | Retain current structure; browser review remains advisable at mobile and desktop widths. |
| Performance | Self-hosted site has no runtime libraries. The project listing uses a large hero screenshot (~1.5 MB) and duplicate social-preview images exist. | No lossy or destructive asset replacement made. Consider creating responsive WebP/AVIF variants with visual comparison and keeping fallbacks. |
| Links | Local source scan found the nested résumé path issue. Main routes and direct résumé asset were live; selected external links responded, while LinkedIn/Figma anti-bot responses were inconclusive. | Fixed local paths; external links cannot be guaranteed from bot-blocked HTTP probes. |
| Deployment | GitHub Pages workflow completed successfully for the then-current published source. Local tracked source tree matched the published tree at audit start. | Recheck deployment after publishing these fixes. |

## Verification performed

- Inspected project files, hosting marker, CSP declarations, scripts and available dependency manifests.
- Calculated the inline script SHA-256 and confirmed it matches the CSP hash.
- Checked the live public routes, static assets, HTTPS/HTTP behavior, robots response and selected external project links.
- Fixed résumé URL resolution and sitemap namespace in source; post-change local XML/link checks are part of this change's verification.

## Remaining limitations

Cloudflare settings require account access. No guarantee is possible for every browser/device or third-party service. No Lighthouse/Core Web Vitals lab result or broad device matrix is claimed. The site is static, so server-side protections only apply if the architecture later gains server endpoints.
