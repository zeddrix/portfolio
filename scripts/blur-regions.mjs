/**
 * Per-image crop and blur regions for capability-band screenshots.
 * Coordinates are in pixels for the source image dimensions noted inline.
 *
 * @typedef {{ x: number, y: number, width: number, height: number }} BlurRegion
 * @typedef {{ file: string, cropTop?: number, regions?: BlurRegion[] }} ImageBlurConfig
 */

/** @type {ImageBlurConfig[]} */
export const imageBlurConfigs = [
  {
    file: "pwa-queue-desktop.png",
    cropTop: 60,
    regions: [
      // Location filter chips (Cavite / Tanza)
      { x: 520, y: 200, width: 520, height: 90 },
    ],
  },
  {
    file: "queue-2-analytics.png",
    cropTop: 80,
  },
  {
    file: "docker-desktop.png",
    regions: [
      // Container ID column
      { x: 1420, y: 260, width: 420, height: 1480 },
      // Port(s) column
      { x: 1920, y: 260, width: 380, height: 1480 },
    ],
  },
  {
    file: "lemonsqueezy-dashboard.png",
    regions: [
      // Main revenue chart and headline figures
      { x: 480, y: 160, width: 2200, height: 620 },
      // Metric cards grid
      { x: 480, y: 780, width: 2200, height: 900 },
    ],
  },
  {
    file: "namecheap-dashboard-domain.png",
    regions: [
      // Header username
      { x: 2280, y: 10, width: 520, height: 90 },
      // Greeting and last-login line
      { x: 420, y: 250, width: 1100, height: 200 },
      // Account status cards (balance, 2FA, last login)
      { x: 1580, y: 170, width: 1250, height: 280 },
    ],
  },
  {
    file: "cloudflare-dashboard.png",
    regions: [
      // Top bar account email (beside logo, not over it)
      {
        x: 168,
        y: 0,
        width: 920,
        height: 112,
        solidFill: { r: 255, g: 255, b: 255 },
      },
      // Account title row: "{email}'s Account"
      {
        x: 240,
        y: 328,
        width: 2400,
        height: 200,
        solidFill: { r: 255, g: 255, b: 255 },
      },
    ],
  },
  {
    file: "cloudflare-deployments.png",
    regions: [
      // Header account email (beside logo)
      {
        x: 168,
        y: 0,
        width: 920,
        height: 112,
        solidFill: { r: 255, g: 255, b: 255 },
      },
    ],
  },
  {
    file: "render-dashboard-merns-shop.png",
    regions: [
      // Workspace name (top-left)
      { x: 10, y: 8, width: 560, height: 80 },
      // Service ID row
      { x: 380, y: 210, width: 1200, height: 90 },
      // Commit line containing cursoragent email
      { x: 380, y: 980, width: 2450, height: 140 },
    ],
  },
];
