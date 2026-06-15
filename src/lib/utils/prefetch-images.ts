const prefetchedUrls = new Set<string>();

export function prefetchImageUrl(url: string): void {
  if (typeof window === "undefined" || prefetchedUrls.has(url)) {
    return;
  }
  prefetchedUrls.add(url);
  const image = new Image();
  image.decoding = "async";
  image.src = url;
}

export function prefetchImageUrls(urls: string[]): void {
  for (const url of urls) {
    prefetchImageUrl(url);
  }
}

export function scheduleIdlePrefetch(urls: string[]): void {
  if (typeof window === "undefined") {
    return;
  }
  const run = () => prefetchImageUrls(urls);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2_000 });
    return;
  }
  setTimeout(run, 0);
}
