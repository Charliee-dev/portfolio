# Hosting security follow-up

The repository is a static GitHub Pages site. It cannot itself control the Cloudflare proxy's HTTP redirect or HTTP response headers. The live domain was observed returning the HTTP homepage without redirecting to HTTPS, and HTTPS responses lacked several recommended browser security headers. Apply and verify these in the Cloudflare zone for `chiranjeevdeka.com`.

## Recommended Cloudflare changes

1. Enable **Always Use HTTPS** (or an equivalent single redirect rule from `http://*chiranjeevdeka.com/*` to `https://chiranjeevdeka.com/$1`). Avoid adding a redirect loop and preserve the requested path/query.
2. Add a response-header transform rule for site responses to set:
   - `Strict-Transport-Security: max-age=31536000` after confirming HTTPS works on every subdomain in scope. Add `includeSubDomains` only if all subdomains are HTTPS-ready; do not enable preload casually.
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `X-Frame-Options: DENY` (the site does not need framing)
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
3. Remove `Access-Control-Allow-Origin: *` if it is being added by a Cloudflare transform. This site has no cross-origin API; public static assets do not require a wildcard CORS header for same-origin use.
4. Prefer a response-header `Content-Security-Policy` only after testing the complete page set. The current HTML has a meta CSP, including a hash for the homepage's inline JSON-LD. Header CSP is stronger and should be consolidated deliberately to avoid unintended blocking; do not blindly copy a generic policy.
5. Inspect Cloudflare's managed `robots.txt` settings before changing them. Current live behavior is Cloudflare-managed; ensure the final response preserves its crawler policy and includes `Sitemap: https://chiranjeevdeka.com/sitemap.xml` if the platform allows it.

## Verify after changes

- `http://chiranjeevdeka.com/` returns a redirect to the HTTPS homepage.
- HTTPS root, clean routes, case studies, 404, sitemap, favicon, résumé and images load successfully.
- Response headers are present on HTML responses and do not break the existing CSP, site styles or scripts.
- `https://chiranjeevdeka.com/robots.txt` preserves the intended Cloudflare bot policy and references the sitemap.

These settings require Cloudflare dashboard/account access; no API token or zone credential is stored in this repository.
