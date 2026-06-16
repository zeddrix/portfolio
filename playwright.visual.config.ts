import { defineConfig, devices } from "@playwright/test";
import {
  PAGES_BASE_PATH,
  PAGES_SITE_URL,
} from "./tests/e2e/fixtures/pages-env";

const visualPort = 7212;
const visualHost = `http://127.0.0.1:${visualPort}`;
const visualAppURL = `${visualHost}${PAGES_BASE_PATH}`;

/** Playwright config for visual screenshot capture only. */
export default defineConfig({
  testDir: "tests/visual",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: visualHost,
    trace: "off",
  },
  webServer: {
    command: `pnpm dev --host 127.0.0.1 --port ${visualPort}`,
    url: visualAppURL,
    reuseExistingServer:
      !process.env.CI && !process.env.PW_DISABLE_REUSE_SERVER,
    timeout: 120_000,
    env: {
      BASE_PATH: PAGES_BASE_PATH,
      PUBLIC_SITE_URL: PAGES_SITE_URL,
    },
  },
});
