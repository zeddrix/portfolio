function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildStaticNotFoundHtml(siteUrl: string): string {
  const homeUrl = siteUrl.replace(/\/$/, "") + "/";
  const safeHomeUrl = escapeHtml(homeUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page Not Found | Zeddrix Fabian Portfolio</title>
    <meta name="description" content="The page you requested could not be found on this portfolio site." />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="canonical" href="${safeHomeUrl}" />
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f5f5f5;
        color: #18181b;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(90%, 48rem);
        padding: 6rem 0;
        text-align: center;
      }
      .status {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #71717a;
      }
      h1 {
        margin: 1rem 0 0;
        font-size: clamp(1.875rem, 4vw, 2.25rem);
        line-height: 1.1;
        font-weight: 700;
      }
      p {
        margin: 1rem 0 0;
        font-size: 1.125rem;
        font-weight: 500;
        color: #52525b;
      }
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-top: 2rem;
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        background: #000;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 600;
        text-decoration: none;
      }
      a:hover { opacity: 0.9; }
    </style>
  </head>
  <body>
    <main id="main" data-testid="error-page">
      <p class="status">404</p>
      <h1>Page not found</h1>
      <p>The page you requested could not be found on this portfolio site.</p>
      <a data-testid="error-home-link" href="${safeHomeUrl}">Back to home</a>
    </main>
  </body>
</html>
`;
}
