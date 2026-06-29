# SEO off-site checklist

Manual steps after deploying SEO improvements to `https://zeddrix.com`. Code handles sitemap, redirects, structured data, and meta tags; these steps get Google and other surfaces caught up.

## 1. Verify live site (5 min)

- [x] Open [https://zeddrix.com](https://zeddrix.com) — confirm the new portfolio (not BeAmaZedd / WordPress).
- [x] Open [https://zeddrix.com/robots.txt](https://zeddrix.com/robots.txt) — should list `Sitemap: https://zeddrix.com/sitemap.xml`.
- [x] Open [https://zeddrix.com/sitemap.xml](https://zeddrix.com/sitemap.xml) — should list home, projects, and certificates with `<lastmod>`.
- [x] Confirm `www.zeddrix.com` redirects to `zeddrix.com` (or pick one canonical and stick with it).

## 2. Google Search Console — setup

1. Go to [Google Search Console](https://search.google.com/search-console).
2. **Add property** → **URL prefix** → `https://zeddrix.com`.
3. **Verify ownership** via DNS TXT record in Namecheap (recommended) or HTML file upload.
4. If you use `www`, add a second property or set preferred domain to non-www under **Settings**.

## 3. Submit sitemap and request indexing (WordPress → portfolio migration)

You already have a Search Console property for `zeddrix.com` with history (e.g. hundreds of “not indexed” pages and a few dozen indexed). **That is expected** after replacing WordPress with this portfolio on the same domain. You are not starting from zero — you are **retiring old URLs** and **introducing new ones**. GSC will look messy for a few weeks.

### What the numbers mean (your Overview)

| GSC stat                         | Typical cause after migration                                                          |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| **Many not indexed** (e.g. 300+) | Old WordPress paths (`/home/page/N/`, archives, tags) that no longer exist or redirect |
| **Few indexed** (e.g. ~26)       | Mix of old pages still in the index and new portfolio pages Google has crawled         |
| **Performance graph**            | Historical clicks from the old site; new portfolio traffic will lag until re-crawl     |

Do **not** try to “fix” every not-indexed URL. Focus on the new sitemap URLs and a handful of removals for the worst stale results (see §5).

### Step A — Clean up old sitemaps (if any)

1. GSC → **Indexing** → **Sitemaps**.
2. Check **Submitted sitemaps** for WordPress leftovers, for example:

- `sitemap_index.xml`, `wp-sitemap.xml`, `post-sitemap.xml`, or plugin paths from Yoast/Rank Math.

3. If an old sitemap still shows **Success** with hundreds of URLs, open it and note the path, then **remove** that submitted sitemap (⋮ menu → **Remove sitemap**). WordPress is gone; keeping its sitemap confuses crawl budget.
4. If no old sitemaps are listed, skip to Step B.

### Step B — Submit the new portfolio sitemap

1. GSC → **Indexing** → **Sitemaps**.
2. Under **Add a new sitemap**, enter only: `sitemap.xml` (not the full URL).
3. Click **Submit**.
4. Within 24–48 hours, status should show **Success** and ~20 URLs discovered (home, projects, certificates — exact count matches your live [sitemap.xml](https://zeddrix.com/sitemap.xml)).
5. If status is **Couldn’t fetch**, open `https://zeddrix.com/sitemap.xml` in a browser and fix deploy/DNS before retrying.

This tells Google: “These are the pages that matter now.” It does **not** delete old indexed URLs by itself.

### Step C — Request indexing for priority pages (manual, limited quota)

Use the top search bar **“Inspect any URL in zeddrix.com”** or **Indexing** → **URL inspection**.

For each URL below:

1. Paste the full URL → **Enter**.
2. Wait for **URL is on Google** or **URL is not on Google**.
3. Click **Test live URL** — confirm the live page is the **new portfolio** (not WordPress, not a generic 404).
4. Click **Request indexing** (or **Request indexing** after “URL is not on Google”).

**Do these first (highest value):**

- [x] `https://zeddrix.com/`
- [x] `https://zeddrix.com/projects/queue`
- [ ] `https://zeddrix.com/projects/jw-tabs`
- [x] `https://zeddrix.com/projects/merns-shop`
- [x] `https://zeddrix.com/certificates`

Google limits how many manual requests you can make per day. The sitemap (Step B) handles the rest over time; you do not need to request every project slug manually.

### Step D — Spot-check one old WordPress URL

1. URL inspection → paste an old indexed URL from search results (e.g. a `/home/…` or old cert path).
2. **Test live URL** should show either:

- **Redirect** to a portfolio page (legacy cert paths, `/home/`), or
- **404** / not found (old blog pagination you did not redirect).

3. If an important old URL still returns WordPress content, DNS or deploy is wrong — fix hosting before requesting indexing.

### What you should expect

- **Week 1–2:** New sitemap processed; homepage and case studies start replacing old snippets in search.
- **Week 2–4:** “Not indexed” count may stay high while Google drops dead WordPress URLs.
- **Do not** resubmit the same sitemap daily; once is enough unless you change site structure.

After Step B + C, continue with §4 (monitor) and §5 (removals for the worst stale URLs).

## 4. Monitor (weekly, first month)

- **Pages** → indexed vs not indexed — watch for old WordPress URLs dropping and new URLs appearing.
- **Sitemaps** → “Success” and last read date.
- **Core Web Vitals** and **HTTPS** — should stay clean on GitHub Pages.

## 5. Retired WordPress on `zeddrix.com`

**Manual follow-up:** post-deploy GSC checks and items the code cannot handle → [seo-deindex-manual.md](seo-deindex-manual.md).

**Current state:** Namecheap DNS points to GitHub Pages. The old WordPress site on Hostinger is **not** serving `zeddrix.com` anymore. Google still shows old BeAmaZedd snippets because it has not fully re-crawled.

**What the portfolio deploy does:**

- Legacy certificate paths (e.g. `/mern-ecommerce-from-scratch-certificate/`) redirect to `/certificates/{slug}`.
- Common old paths like `/home/` and `/about-zeddrix-fabian/` redirect to `/`.

### 5a. Removals tool — block a URL (e.g. `/author/zedd/`)

Use **Indexing** → **Removals** → **New request** → **Temporarily remove URL**.

| Goal                      | What to enter                                            | Option to select                                                                              |
| ------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Hide one page from search | Full URL, e.g. `https://zeddrix.com/author/zedd/`        | **Remove this URL only**                                                                      |
| Hide all author archives  | `https://zeddrix.com/author/`                            | **Remove all URLs with this prefix**                                                          |
| Hide old guitar-tab posts | `https://zeddrix.com/song-` (if many share that pattern) | **Remove all URLs with this prefix** — only if they still appear in Google **search results** |

Then click **Next** → confirm. The URL is hidden from Google Search for **about six months**.

**Why only temporary?** Google designed this as an emergency “hide this from search now” tool, not a permanent delete button. After ~6 months, Google may show the URL again **if** it still exists and is crawlable. Permanent removal happens when the URL **404s**, **redirects** to something you want, or returns **`noindex`** — which your new site already does for dead paths. Removals are for **stale snippets still showing in search** while you wait for re-crawl.

**Do not** submit hundreds of individual removals. Use **prefix** for whole WordPress folders (`/author/`, `/category/`, `/tag/`) only when those URLs still show up when you Google your name or site.

### 5b. Can I delete all 320 “not indexed” pages at once?

**No.** Google Search Console has no “clear all old URLs” or “reset index” button. The **Page indexing** chart is a **report** of what Google already knows about your domain — mostly dead WordPress URLs. That is normal after a migration.

What actually cleans the slate:

1. **New sitemap submitted** (§3) — tells Google what to care about now.
2. **Old URLs return 404 or redirect** — Google drops them over weeks/months (your chart already shows total URLs trending down).
3. **Removals** — only for URLs that still **appear in search results** and look embarrassing or wrong; not for every row in the indexing report.
4. **Time** — the green “indexed” line should grow as portfolio pages are crawled; the grey “not indexed” line shrinks as old URLs are recrawled and abandoned.

You do **not** need zero “not indexed” pages. Many of those are old guitar-tab posts, author pages, and `/home/page/N/` URLs that **should** stay out of the index.

### 5c. “Page with redirect” (87 pages) — do I click Validate fix?

**Usually no.**

That report means: Google found URLs that **redirect**, so it **correctly does not index them**. The caption says _“These pages aren't indexed or served on Google”_ — that is the desired outcome for old WordPress content you no longer want ranked.

- **Validate fix** is for when you **fixed a problem** Google flagged (e.g. you removed broken redirects, fixed mobile usability). It asks Google to re-crawl and confirm the issue is gone.
- For old guitar-tab URLs (`/song-…-guitar-tabs/`) you want **gone from search**, not re-indexed. If they now 404 on the live site, Google will update that status on its own when it recrawls — no validation needed.
- Only use **Validate fix** if you changed server behavior (e.g. removed a bad redirect chain) and want Google to refresh that bucket faster.

**Indexing** → open **Page with redirect** → export examples if curious, but treat it as **informational**, not an error to fix.

### 5d. What you do manually (short list)

1. **Removals** (prefix) only for URL patterns still showing in **live Google search** — e.g. `/author/` if author archives still appear for “Zeddrix Fabian”.
2. **URL Inspection** on one old URL → **Test live URL** → confirm 404 or redirect to portfolio (not WordPress).
3. **Optional:** Ask your father to delete or park the Hostinger WordPress install.

**Timeline:** Re-indexing usually takes days to a few weeks. The indexing chart may look “messy” for a month; focus on new portfolio URLs getting indexed, not clearing the grey bar to zero.

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
- [ ] LinkedIn About mentions portfolio once (see [linkedin-profile-manual.md](linkedin-profile-manual.md))
- [ ] Update `zeddrix.com` links on Stack Exchange / other profiles when you edit them

## 10. Legacy certificate redirects (verify after deploy)

Test in a browser:

| Old WordPress path                                   | Should land on                                       |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `/mern-ecommerce-from-scratch-certificate/`          | `/certificates/mern-ecommerce-from-scratch`          |
| `/modern-javascript-from-the-beginning-certificate/` | `/certificates/modern-javascript-from-the-beginning` |

Full mapping lives in `[src/lib/data/legacy-redirects.ts](../src/lib/data/legacy-redirects.ts)` and `[src/lib/data/certificates.ts](../src/lib/data/certificates.ts)` (`legacyZeddrixPath`).

---

Related: [linkedin-profile-manual.md](linkedin-profile-manual.md) for LinkedIn and resume sync.
