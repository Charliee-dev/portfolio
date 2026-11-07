# Project standards and applicability

| Module | Status | Reason |
| --- | --- | --- |
| Design preservation | REQUIRED | Existing approved portfolio identity and layout must remain intact. |
| Semantic HTML and responsive layout | REQUIRED | Public pages must work across device sizes and assistive technologies. |
| Accessibility | REQUIRED | Maintain landmarks, labels, keyboard behavior, contrast, useful alt text and reduced-motion support. |
| SEO and metadata | REQUIRED | Public portfolio pages need canonical URLs, descriptions, social metadata and a valid sitemap. |
| HTTPS | REQUIRED | Production domain must redirect HTTP to HTTPS at Cloudflare. |
| Security headers and CSP | REQUIRED | Keep page CSP; configure transport and response headers at the hosting edge where possible. |
| Secrets management | REQUIRED | No production secrets are needed; do not commit credentials. |
| Input validation/sanitization | NOT APPLICABLE | No form, API, user-generated content or server-side input exists. |
| Authentication/authorization | NOT APPLICABLE | All pages are intentionally public; there is no private area. |
| CORS/API security | NOT APPLICABLE | No API or cross-origin data service is used. Review the edge's wildcard CORS header; it is unnecessary for this public static site. |
| Dependency vulnerability review | NOT APPLICABLE | No package manifest, lockfile or third-party runtime dependency is present. |
| Error handling/logging | CONDITIONAL | Browser-side interactions should fail gracefully; there is no application server to log. Hosting/platform logs are operational. |
| Privacy/data protection | REQUIRED | Minimize collection; no site backend or analytics is present. External mail and hosting services have their own policies. |
| Performance/image optimization | REQUIRED | Keep initial content lean, correctly sized and responsive; assess image conversion with visual comparison before replacing source assets. |
| Automated tests/build | DEFERRED | No existing build/test framework; use focused static checks and browser review without introducing dependencies solely for this static site. |
| Deployment verification | REQUIRED | Confirm GitHub Pages completion, custom-domain HTTPS and all public routes/assets after release. |
| Figma redesign | NOT APPLICABLE | User explicitly requested an audit without redesign or overwriting the existing design. |
