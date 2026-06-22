# SEO deindex — manual checklist

Tasks the agent cannot complete in code. Do these after deploying the portfolio SEO fixes.

Related: [seo-offsite-checklist.md](seo-offsite-checklist.md) (sitemap, broader migration).

## 1. Do not request indexing on old URLs

**Request indexing** tells Google to crawl and consider a URL for the index. Use it only for pages you **want** ranked (`/`, `/projects/*`, `/certificates/*`).

For dead WordPress paths (`/author/`, `/category/`, old posts), **never** request indexing.

## 2. Post-deploy verification (5 min)

After deploy to `https://zeddrix.com`, confirm live behavior:

| URL                                                                             | Expected                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `https://zeddrix.com/author/zedd/`                                              | HTTP **404**, page says "Page not found", view-source has `noindex` |
| `https://zeddrix.com/category/coding-projects/`                                 | HTTP **404**, `noindex`                                             |
| `https://zeddrix.com/booklist-add-your-books-titles-the-authors-name-isbn/`     | HTTP **404**, `noindex`                                             |
| `https://zeddrix.com/css-the-complete-guide-2021-incl-flexbox-grid-sass/`       | Redirects to `/certificates/css-complete-guide-2021`                |
| `https://zeddrix.com/node-js-api-masterclass-with-express-mongodb-certificate/` | Redirects to `/certificates/nodejs-api-masterclass`                 |

Quick check in terminal:

```bash
curl -sI "https://zeddrix.com/author/zedd/" | head -1
curl -s "https://zeddrix.com/author/zedd/" | grep -i noindex
```

## 3. Google Search Console — Test live URL

For each sample URL above:

1. GSC → **URL inspection** → paste URL → Enter.
2. Click **Test live URL** (not Request indexing).
3. Confirm Google sees **404** for dead paths or **redirect** for cert aliases.

Repeat monthly until the **Indexed pages** count drops. The report lags by weeks; temporary removals already hide URLs from search results.

## 4. What to expect

| Timeframe  | Outcome                                                      |
| ---------- | ------------------------------------------------------------ |
| Now        | Removals hide old URLs from Google Search results            |
| 1–4 weeks  | Indexed pages report starts dropping dead WordPress URLs     |
| 2–6 months | Removals expire; permanent drop depends on live 404/redirect |

You do **not** need zero rows in "Indexed pages". Only `https://zeddrix.com/` and current portfolio URLs should stay indexed long term.

## 5. `startup.zeddrix.com`

This subdomain is outside the portfolio repo. At Namecheap/DNS:

- Point to a parked page, or
- **301 redirect** to `https://zeddrix.com/`, or
- Return 404 if you retire it.

GSC removal for this URL is already submitted; fix DNS so recrawls confirm it is gone.

## 6. Optional — stronger cert redirects (Cloudflare)

GitHub Pages cannot return HTTP **301** for static redirect files (they use meta refresh + `noindex`). For stronger signals:

1. Move DNS through Cloudflare (orange cloud).
2. Add **Bulk Redirects** or Page Rules: old cert paths → `https://zeddrix.com/certificates/{slug}` with **301**.

Not required if meta-refresh redirects and `noindex` are working.

## 7. Optional — Hostinger WordPress

Delete or park the old WordPress install on Hostinger so it cannot be accidentally repointed to `zeddrix.com`.

## 8. Optional — Bing

[Bing Webmaster Tools](https://www.bing.com/webmasters) → add site → submit `https://zeddrix.com/sitemap.xml`.
