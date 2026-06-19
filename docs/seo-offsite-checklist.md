# SEO off-site checklist

Manual steps after deploying SEO improvements to `https://zeddrix.com`. Code handles sitemap, redirects, structured data, and meta tags; these steps get Google and other surfaces caught up.

## 1. Verify live site (5 min)

- [ ] Open [https://zeddrix.com](https://zeddrix.com) — confirm the new portfolio (not BeAmaZedd / WordPress).
- [ ] Open [https://zeddrix.com/robots.txt](https://zeddrix.com/robots.txt) — should list `Sitemap: https://zeddrix.com/sitemap.xml`.
- [ ] Open [https://zeddrix.com/sitemap.xml](https://zeddrix.com/sitemap.xml) — should list home, projects, and certificates with `<lastmod>`.
- [ ] Confirm `www.zeddrix.com` redirects to `zeddrix.com` (or pick one canonical and stick with it).

## 2. Google Search Console — setup

1. Go to [Google Search Console](https://search.google.com/search-console).
2. **Add property** → **URL prefix** → `https://zeddrix.com`.
3. **Verify ownership** via DNS TXT record in Namecheap (recommended) or HTML file upload.
4. If you use `www`, add a second property or set preferred domain to non-www under **Settings**.

## 3. Submit sitemap and request indexing

1. GSC → **Sitemaps** → enter `sitemap.xml` → **Submit**.
2. **URL Inspection** → paste `https://zeddrix.com/` → **Request indexing**.
3. Repeat for priority pages:
   - `https://zeddrix.com/projects/queue`
   - `https://zeddrix.com/projects/answeriq`
   - `https://zeddrix.com/projects/merns-shop`
   - `https://zeddrix.com/certificates`

## 4. Monitor (weekly, first month)

- **Pages** → indexed vs not indexed — watch for old WordPress URLs dropping and new URLs appearing.
- **Sitemaps** → “Success” and last read date.
- **Core Web Vitals** and **HTTPS** — should stay clean on GitHub Pages.

## 5. Retired WordPress on `zeddrix.com`

**Current state:** Namecheap DNS points to GitHub Pages. The old WordPress site on Hostinger is **not** serving `zeddrix.com` anymore. Google still shows old BeAmaZedd snippets because it has not fully re-crawled.

**What the portfolio deploy does:**

- Legacy certificate paths (e.g. `/mern-ecommerce-from-scratch-certificate/`) redirect to `/certificates/{slug}`.
- Common old paths like `/home/` and `/about-zeddrix-fabian/` redirect to `/`.

**What you do manually:**

1. GSC → **Removals** → **New request** → **Temporarily remove URL** for the worst stale results (old `/home/page/N/` blog URLs, old “About Zeddrix Fabian” archive URLs). Removals last ~6 months; use while new content takes over.
2. GSC → **URL Inspection** → test an old indexed URL → confirm it now redirects or 404s to the portfolio.
3. **Optional:** Ask your father to delete or park the Hostinger WordPress install so it cannot accidentally be pointed at `zeddrix.com` again.

**Timeline:** Re-indexing usually takes days to a few weeks. Do not expect instant removal of old snippets.

## 6. Deleted `zeddrix.github.io/zeddrix-portfolio`

The repo was deleted ~2 weeks ago; the URL 404s (correct). Google may still show the old listing.

- You cannot redirect that exact path without recreating a repo (not recommended).
- Stale results will drop naturally; after 2–4 weeks use [Remove outdated content](https://search.google.com/search-console/removals) if the snippet persists.
- Ensure **LinkedIn**, **GitHub profile README**, and resume all link to `https://zeddrix.com` only — helps Google consolidate on the custom domain.

## 7. Rich Results and social preview checks

- [ [Rich Results Test](https://search.google.com/test/rich-results) ] → test homepage (expect Person + WebSite).
- [ [Rich Results Test](https://search.google.com/test/rich-results) ] → test one project URL (expect CreativeWork or SoftwareApplication + BreadcrumbList).
- Share `https://zeddrix.com` in Slack or iMessage — confirm the OG card shows the new 1200×630 image and title.

## 8. Bing Webmaster Tools (optional, ~10 min)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) → add `https://zeddrix.com`.
2. Verify (DNS or import from GSC).
3. Submit `https://zeddrix.com/sitemap.xml`.

## 9. Backlinks and entity consistency

- [ ] GitHub profile README → `https://zeddrix.com`
- [ ] LinkedIn **Website** → `https://zeddrix.com`
- [ ] LinkedIn About mentions portfolio once (see [`docs/career-profile-manual-checklist.md`](career-profile-manual-checklist.md))
- [ ] Update `zeddrix.com` links on Stack Exchange / other profiles when you edit them

## 10. Legacy certificate redirects (verify after deploy)

Test in a browser:

| Old WordPress path                                   | Should land on                                       |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `/mern-ecommerce-from-scratch-certificate/`          | `/certificates/mern-ecommerce-from-scratch`          |
| `/modern-javascript-from-the-beginning-certificate/` | `/certificates/modern-javascript-from-the-beginning` |

Full mapping lives in [`src/lib/data/legacy-redirects.ts`](../src/lib/data/legacy-redirects.ts) and [`src/lib/data/certificates.ts`](../src/lib/data/certificates.ts) (`legacyZeddrixPath`).

---

Related: [`docs/career-profile-manual-checklist.md`](career-profile-manual-checklist.md) for LinkedIn and resume sync.
