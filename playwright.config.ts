import { defineConfig, devices } from "@playwright/test";
import {
  PAGES_BASE_PATH,
  PAGES_SITE_URL,
} from "./tests/e2e/fixtures/pages-env";

const e2ePort = 7212;
const e2eHost = `http://127.0.0.1:${e2ePort}`;
const e2eAppURL = `${e2eHost}${PAGES_BASE_PATH}`;

export default defineConfig({
  testDir: "tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: e2eHost,
    trace: "off",
  },
  webServer: {
    command: `pnpm dev --host 127.0.0.1 --port ${e2ePort}`,
    url: e2eAppURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      BASE_PATH: PAGES_BASE_PATH,
      PUBLIC_SITE_URL: PAGES_SITE_URL,
    },
  },
});
